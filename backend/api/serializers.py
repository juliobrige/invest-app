from rest_framework import serializers
from django.conf import settings
from users.models import CustomUser
from django.db.models import Sum
from django.utils import timezone 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password

from .models import Profile, Wallet, MachinePlan, Investment, Transaction, BankAccount, VIPLevel

# --- Serializers de Autenticação e Utilizador ---

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name'] = user.name
        return token

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    referral_code = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = CustomUser
        fields = ('phone_number', 'name', 'password', 'password2', 'referral_code')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})
        return data

    def create(self, validated_data):
        referral_code = validated_data.pop('referral_code', None)
        user = CustomUser.objects.create_user(
            phone_number=validated_data['phone_number'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        if referral_code:
            try:
                referrer_profile = Profile.objects.get(referral_code=referral_code)
                user.profile.referred_by = referrer_profile.user
                user.profile.save()
            except Profile.DoesNotExist:
                pass
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'phone_number', 'name')

# --- Serializers da Aplicação ---

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    vip_level = serializers.StringRelatedField()
    class Meta:
        model = Profile
        fields = ('user', 'accepted_terms', 'referral_code', 'vip_level')
        read_only_fields = ('referral_code', 'vip_level')

# NOVO SERIALIZER para definir/alterar o código de pagamento
class SetPaymentCodeSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True, write_only=True)
    new_payment_code = serializers.CharField(required=True, write_only=True, min_length=4, max_length=6)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("A sua palavra-passe de login está incorreta.")
        return value

# ATUALIZADO: O serializer de saque agora exige o código de pagamento
class WithdrawalCreateSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=True)
    account_name = serializers.CharField(max_length=150, required=True)
    account_number = serializers.CharField(max_length=50, required=True)
    payment_code = serializers.CharField(required=True, write_only=True) # NOVO CAMPO

    def validate_payment_code(self, value):
        user = self.context['request'].user
        if not user.profile.check_payment_code(value):
            raise serializers.ValidationError("O código de pagamento está incorreto.")
        return value

class WalletSerializer(serializers.ModelSerializer):
    total_deposited = serializers.ReadOnlyField()
    total_withdrawn = serializers.ReadOnlyField()

    class Meta:
        model = Wallet
        fields = (
            'available_balance', 
            'invested_balance', 
            'total_earnings',
            'total_deposited',
            'total_withdrawn'
        )

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'transaction_type', 'amount', 'status', 'timestamp')

class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = ('id', 'bank_name', 'account_holder', 'account_number', 'iban')

class DepositSerializer(serializers.ModelSerializer):
    destination_bank_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Transaction
        fields = ('amount', 'reference_id', 'proof_of_payment', 'destination_bank_id')
        extra_kwargs = {'proof_of_payment': {'required': True}}

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("A sua senha antiga está incorreta.")
        return value

    def validate_new_password(self, value):
        validate_password(value)
        return value

class MachinePlanSerializer(serializers.ModelSerializer):
    time_left_seconds = serializers.SerializerMethodField()
    class Meta:
        model = MachinePlan
        fields = ('id', 'name', 'min_investment_value', 'return_percentage', 'lifespan_days', 'expiration_date', 'required_vip_level', 'is_expired', 'time_left_seconds', 'image')
    def get_time_left_seconds(self, obj):
        if obj.is_expired: return 0
        now = timezone.now()
        expiration_datetime = timezone.make_aware(timezone.datetime.combine(obj.expiration_date, timezone.datetime.max.time()))
        delta = expiration_datetime - now
        return max(0, int(delta.total_seconds()))

class InvestmentSerializer(serializers.ModelSerializer):
    plan = MachinePlanSerializer(read_only=True)
    current_value = serializers.ReadOnlyField()
    total_return = serializers.ReadOnlyField()
    days_passed = serializers.ReadOnlyField()
    class Meta:
        model = Investment
        fields = ('id', 'plan', 'invested_amount', 'start_date', 'end_date', 'is_active', 'current_value', 'total_return', 'days_passed')

class InvestmentCreateSerializer(serializers.Serializer):
    plan_id = serializers.IntegerField(required=True)
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=True)

