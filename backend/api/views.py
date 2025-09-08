from django.utils import timezone
from django.db import transaction as db_transaction
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Investment
from .serializers import InvestmentSerializer 
# Importar os modelos necessários
from users.models import CustomUser
from .models import (
    Profile, Wallet, Transaction, BankAccount, MachinePlan, Investment
)

# Importar todos os serializers necessários
from .serializers import (
    MyTokenObtainPairSerializer,
    RegisterSerializer,
    ProfileSerializer,
    WalletSerializer,
    TransactionSerializer,
    BankAccountSerializer,
    DepositSerializer,
    MachinePlanSerializer,
    InvestmentSerializer,
    InvestmentCreateSerializer,
    WithdrawalCreateSerializer,
    ChangePasswordSerializer,
    SetPaymentCodeSerializer,
)

# --- Views de Autenticação e Perfil ---

class MyTokenObtainPairView(TokenObtainPairView):
    """View de login personalizada."""
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    """Endpoint para registar um novo utilizador."""
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveAPIView):
    """Endpoint para ver o perfil do utilizador logado."""
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

class AcceptTermsView(APIView):
    """Endpoint para o utilizador aceitar os termos de uso."""
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        profile = request.user.profile
        if not profile.accepted_terms:
            profile.accepted_terms = True
            profile.save()
        return Response({"message": "Termos aceites com sucesso."}, status=status.HTTP_200_OK)

class ChangePasswordView(generics.UpdateAPIView):
    """Endpoint para um utilizador alterar a sua própria palavra-passe."""
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.object.set_password(serializer.validated_data.get("new_password"))
        self.object.save()
        return Response({"detail": "Palavra-passe alterada com sucesso."}, status=status.HTTP_200_OK)

class SetPaymentCodeView(generics.GenericAPIView):
    """Endpoint para definir/alterar o código de pagamento."""
    serializer_class = SetPaymentCodeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = request.user.profile
        profile.set_payment_code(serializer.validated_data['new_payment_code'])
        return Response({"detail": "Código de pagamento definido com sucesso."}, status=status.HTTP_200_OK)

# --- Views Principais da Aplicação ---
class InvestmentDetailView(generics.RetrieveAPIView):
    """Endpoint para ver os detalhes de um único investimento."""
    serializer_class = InvestmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Garante que um utilizador só pode ver os seus próprios investimentos
        return Investment.objects.filter(user=self.request.user)

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            wallet = user.wallet
            profile = user.profile
            dashboard_data = {
                'wallet': WalletSerializer(wallet).data,
                'profile': ProfileSerializer(profile).data,
            }
            return Response(dashboard_data, status=status.HTTP_200_OK)
        except (Wallet.DoesNotExist, Profile.DoesNotExist):
            return Response({"error": "Dados do utilizador não encontrados."}, status=status.HTTP_404_NOT_FOUND)

class BankAccountListView(generics.ListAPIView):
    queryset = BankAccount.objects.filter(is_active=True)
    serializer_class = BankAccountSerializer
    permission_classes = [IsAuthenticated]

class DepositView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DepositSerializer
    parser_classes = [MultiPartParser, FormParser]
    def perform_create(self, serializer):
        bank_id = serializer.validated_data.pop('destination_bank_id')
        destination_bank = BankAccount.objects.get(id=bank_id)
        serializer.save(user=self.request.user, transaction_type='DEPOSIT', status='PENDING', destination_bank=destination_bank)

class MachinePlanListView(generics.ListAPIView):
    queryset = MachinePlan.objects.filter(is_active=True, expiration_date__gte=timezone.now().date())
    serializer_class = MachinePlanSerializer
    permission_classes = [IsAuthenticated]

class InvestmentListView(generics.ListAPIView):
    serializer_class = InvestmentSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Investment.objects.filter(user=self.request.user).select_related('plan', 'user')

class InvestView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InvestmentCreateSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        plan_id = serializer.validated_data['plan_id']
        amount = serializer.validated_data['amount']
        user = request.user
        try:
            plan = MachinePlan.objects.get(id=plan_id, is_active=True, expiration_date__gte=timezone.now().date())
        except MachinePlan.DoesNotExist:
            return Response({"error": "Máquina de investimento inválida ou expirada."}, status=status.HTTP_400_BAD_REQUEST)
        if amount < plan.min_investment_value:
            return Response({"error": f"O valor do investimento deve ser no mínimo {plan.min_investment_value} MZN."}, status=status.HTTP_400_BAD_REQUEST)
        wallet = user.wallet
        if wallet.available_balance < amount:
            return Response({"error": "Saldo insuficiente para realizar este investimento."}, status=status.HTTP_400_BAD_REQUEST)
        with db_transaction.atomic():
            wallet.available_balance -= amount
            wallet.invested_balance += amount
            wallet.save()
            investment = Investment.objects.create(user=user, plan=plan, invested_amount=amount)
            Transaction.objects.create(user=user, transaction_type='INVESTMENT', amount=amount, status='APPROVED')
        return Response(InvestmentSerializer(investment).data, status=status.HTTP_201_CREATED)

class WithdrawalRequestView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WithdrawalCreateSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = serializer.validated_data['amount']
        account_name = serializer.validated_data.get('account_name', '')
        account_number = serializer.validated_data.get('account_number', '')
        user = request.user
        has_invested = Investment.objects.filter(user=user).exists()
        if not has_invested:
            return Response({"error": "É necessário fazer pelo menos um investimento antes de poder solicitar um saque."}, status=status.HTTP_403_FORBIDDEN)
        wallet = user.wallet
        if wallet.available_balance < amount:
            return Response({"error": "Saldo insuficiente para solicitar o saque."}, status=status.HTTP_400_BAD_REQUEST)
        with db_transaction.atomic():
            wallet.available_balance -= amount
            wallet.save()
            transaction = Transaction.objects.create(
                user=user,
                transaction_type='WITHDRAWAL',
                amount=amount,
                status='PENDING',
                withdrawal_account_name=account_name,
                withdrawal_account_number=account_number
            )
        return Response(TransactionSerializer(transaction).data, status=status.HTTP_201_CREATED)

class WithdrawalHistoryView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user, transaction_type='WITHDRAWAL')

class TransactionHistoryView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

