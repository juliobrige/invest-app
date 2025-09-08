from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    # Autenticação e Perfil
    MyTokenObtainPairView,
    RegisterView,
    ProfileView,
    AcceptTermsView,
    ChangePasswordView, # Corrigido de PasswordChangeView para corresponder ao seu views.py
    SetPaymentCodeView,

    # Views Principais
    DashboardView,
    BankAccountListView,
    DepositView,
    MachinePlanListView,
    
    # Investimentos
    InvestmentListView,
    InvestmentDetailView, # <-- A view que faltava ligar
    InvestView,
    
    # Saques e Transações
    WithdrawalRequestView,
    WithdrawalHistoryView,
    TransactionHistoryView,
)

urlpatterns = [
    # --- Autenticação e Gestão de Conta ---
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/password/change/', ChangePasswordView.as_view(), name='password_change'),
    path('auth/payment-code/set/', SetPaymentCodeView.as_view(), name='set_payment_code'),

    # --- Perfil e Dashboard ---
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/accept-terms/', AcceptTermsView.as_view(), name='accept_terms'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),

    # --- Investimentos e Máquinas ---
    path('machines/', MachinePlanListView.as_view(), name='machine_plan_list'),
    path('investments/', InvestmentListView.as_view(), name='investment_list'),
    path('investments/<int:pk>/', InvestmentDetailView.as_view(), name='investment-detail'), # <-- A ROTA ADICIONADA
    path('invest/', InvestView.as_view(), name='invest'),

    # --- Transações (Depósitos e Saques) ---
    path('banks/', BankAccountListView.as_view(), name='bank_list'),
    path('deposit/', DepositView.as_view(), name='deposit'),
    path('withdraw/', WithdrawalRequestView.as_view(), name='withdrawal_request'),
    path('withdrawals/', WithdrawalHistoryView.as_view(), name='withdrawal_history'),
    path('transactions/', TransactionHistoryView.as_view(), name='transaction_history'),
]

