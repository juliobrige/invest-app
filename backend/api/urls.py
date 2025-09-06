# api/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

# Importar todas as views, incluindo as novas
from .views import (
    MyTokenObtainPairView,
    RegisterView,
    ProfileView,
    AcceptTermsView,
    DashboardView,
    DepositView,
    BankAccountListView,
    MachinePlanListView,
    InvestmentListView,
    InvestView,
    WithdrawalRequestView,
    WithdrawalHistoryView,
)

urlpatterns = [
    # --- Endpoints de Autenticação e Perfil ---
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/accept-terms/', AcceptTermsView.as_view(), name='accept_terms'),

    # --- Endpoints Principais da Aplicação ---
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('deposit/', DepositView.as_view(), name='deposit'),
    path('banks/', BankAccountListView.as_view(), name='bank-list'),

    # --- NOVOS Endpoints para Investimentos ---
    path('machines/', MachinePlanListView.as_view(), name='machine-list'),
    path('investments/', InvestmentListView.as_view(), name='investment-list'),
    path('invest/', InvestView.as_view(), name='invest'),

    # --- NOVOS Endpoints para Saques (Withdrawals) ---
    path('withdraw/', WithdrawalRequestView.as_view(), name='withdraw-request'),
    path('withdrawals/', WithdrawalHistoryView.as_view(), name='withdrawal-history'),
]