# api/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db import transaction as db_transaction
from django.utils import timezone

# --- Imports dos Modelos ---
# Importar os modelos da app 'api' e da app 'users'
from users.models import CustomUser
from .models import Profile, Wallet, Transaction, BankAccount, MachinePlan, Investment

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
    WithdrawalCreateSerializer
)


# --- Views de Autenticação e Perfil ---

class MyTokenObtainPairView(TokenObtainPairView):
    """View de login personalizada para usar o serializer que funciona com número de telefone."""
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    """Endpoint para registar um novo utilizador com telefone e nome."""
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    """Endpoint para ver e atualizar o perfil do utilizador logado."""
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user.profile

class AcceptTermsView(APIView):
    """Endpoint para o utilizador aceitar os termos de uso."""
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        profile = request.user.profile
        if not profile.accepted_terms:
            profile.accepted_terms = True
            profile.save()
        return Response({"message": "Termos aceites com sucesso."}, status=status.HTTP_200_OK)


# --- Views Principais da Aplicação ---

class DashboardView(APIView):
    """Endpoint que agrega todos os dados necessários para o dashboard principal."""
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            wallet = user.wallet
            profile = user.profile
            recent_transactions = user.transactions.order_by('-timestamp')[:5]

            wallet_data = WalletSerializer(wallet).data
            profile_data = ProfileSerializer(profile).data
            transactions_data = TransactionSerializer(recent_transactions, many=True).data

            dashboard_data = {
                'wallet': wallet_data,
                'profile': profile_data,
                'recent_transactions': transactions_data,
            }
            return Response(dashboard_data, status=status.HTTP_200_OK)
        except (Wallet.DoesNotExist, Profile.DoesNotExist):
            return Response({"error": "Dados do utilizador não encontrados."}, status=status.HTTP_404_NOT_FOUND)

class DepositView(generics.CreateAPIView):
    """Endpoint para um utilizador submeter um pedido de depósito."""
    permission_classes = (IsAuthenticated,)
    serializer_class = DepositSerializer
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        bank_id = serializer.validated_data.pop('destination_bank_id')
        destination_bank = BankAccount.objects.get(id=bank_id)
        serializer.save(
            user=self.request.user,
            transaction_type='DEPOSIT',
            status='PENDING',
            destination_bank=destination_bank
        )

class BankAccountListView(generics.ListAPIView):
    """Endpoint para listar as contas bancárias ativas da empresa."""
    queryset = BankAccount.objects.filter(is_active=True)
    serializer_class = BankAccountSerializer
    permission_classes = (IsAuthenticated,)

# --- Views para as Novas Funcionalidades de Investimento e Saque ---

class MachinePlanListView(generics.ListAPIView):
    """Endpoint para listar todas as máquinas de investimento ativas e não expiradas."""
    queryset = MachinePlan.objects.filter(is_active=True, expiration_date__gte=timezone.now().date())
    serializer_class = MachinePlanSerializer
    permission_classes = [IsAuthenticated]

class InvestmentListView(generics.ListAPIView):
    """Endpoint para o utilizador ver os seus próprios investimentos."""
    serializer_class = InvestmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Investment.objects.filter(user=self.request.user)

class InvestView(generics.CreateAPIView):
    """Endpoint para um utilizador fazer um novo investimento."""
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

            investment = Investment.objects.create(
                user=user,
                plan=plan,
                invested_amount=amount
            )

            Transaction.objects.create(
                user=user,
                transaction_type='INVESTMENT',
                amount=amount,
                status='APPROVED'
            )
        
        return Response(InvestmentSerializer(investment).data, status=status.HTTP_201_CREATED)

class WithdrawalRequestView(generics.CreateAPIView):
    """Endpoint para o utilizador solicitar um saque."""
    permission_classes = [IsAuthenticated]
    serializer_class = WithdrawalCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = serializer.validated_data['amount']
        user = request.user

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
                status='PENDING'
            )

        return Response(TransactionSerializer(transaction).data, status=status.HTTP_201_CREATED)

class WithdrawalHistoryView(generics.ListAPIView):
    """Endpoint para o utilizador ver o seu histórico de saques."""
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user, transaction_type='WITHDRAWAL')
