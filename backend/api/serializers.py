from rest_framework import serializers
from django.conf import settings
from users.models import CustomUser # Importar o nosso novo modelo de utilizador
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Profile, Wallet, MachinePlan, Investment, Transaction, BankAccount, VIPLevel, timezone

class MachinePlanSerializer(serializers.ModelSerializer):
    """Serializer para listar as máquinas de investimento disponíveis."""
    time_left_seconds = serializers.SerializerMethodField()

    class Meta:
        model = MachinePlan
        fields = (
            'id', 'name', 'min_investment_value', 'return_percentage',
            'lifespan_days', 'expiration_date', 'required_vip_level',
            'is_expired', 'time_left_seconds'
        )

    def get_time_left_seconds(self, obj):
        """Calcula o tempo restante em segundos para a contagem regressiva no frontend."""
        if obj.is_expired:
            return 0
        now = timezone.now()
        expiration_datetime = timezone.make_aware(
            timezone.datetime.combine(obj.expiration_date, timezone.datetime.max.time())
        )
        delta = expiration_datetime - now
        return max(0, int(delta.total_seconds()))

class InvestmentSerializer(serializers.ModelSerializer):
    """Serializer para exibir os detalhes de um investimento do utilizador."""
    plan = MachinePlanSerializer(read_only=True)
    current_value = serializers.ReadOnlyField()
    total_return = serializers.ReadOnlyField()
    days_passed = serializers.ReadOnlyField()

    class Meta:
        model = Investment
        fields = (
            'id', 'plan', 'invested_amount', 'start_date', 'end_date',
            'is_active', 'current_value', 'total_return', 'days_passed'
        )

class InvestmentCreateSerializer(serializers.Serializer):
    """Serializer para receber os dados ao criar um novo investimento."""
    plan_id = serializers.IntegerField(required=True)
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=True)


class WithdrawalCreateSerializer(serializers.Serializer):
    """Serializer para receber os dados ao solicitar um saque."""
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=True)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer personalizado para o login, para que funcione com 'phone_number'.
    O SimpleJWT por defeito procura por 'username', por isso precisamos de o adaptar.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name'] = user.name
        return token

class RegisterSerializer(serializers.ModelSerializer):
    """Serializer para o registo com número de telefone e nome."""
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    referral_code = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = CustomUser
        fields = ('phone_number', 'name', 'password', 'password2', 'referral_code')
        extra_kwargs = {
            'password': {'write_only': True}
        }

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
        
        # Lógica para associar o convite (se existir)
        if referral_code:
            try:
                referrer_profile = Profile.objects.get(referral_code=referral_code)
                user.profile.referred_by = referrer_profile.user
                user.profile.save()
            except Profile.DoesNotExist:
                pass
        
        return user

class UserSerializer(serializers.ModelSerializer):
    """Serializer para exibir informações do nosso utilizador personalizado."""
    class Meta:
        model = CustomUser
        fields = ('id', 'phone_number', 'name')

# --- Serializers da Aplicação (Atualizados para usar o novo UserSerializer) ---
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    vip_level = serializers.StringRelatedField() 

    class Meta:
        model = Profile
        fields = ('user', 'accepted_terms', 'referral_code', 'vip_level')
        read_only_fields = ('referral_code', 'vip_level')


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ('available_balance', 'invested_balance', 'total_earnings')
        read_only_fields = fields

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'transaction_type', 'amount', 'status', 'timestamp', 'reference_id')

class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = ('id', 'bank_name', 'account_holder', 'account_number', 'iban')

class DepositSerializer(serializers.ModelSerializer):
    destination_bank_id = serializers.IntegerField(write_only=True)
    proof_of_payment = serializers.ImageField(required=True, allow_null=False)

    class Meta:
        model = Transaction
        fields = ('amount', 'reference_id', 'proof_of_payment', 'destination_bank_id')