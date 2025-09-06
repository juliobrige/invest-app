# api/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Profile, Wallet, MachinePlan, Investment, Transaction, VIPLevel, BankAccount

@admin.register(VIPLevel)
class VIPLevelAdmin(admin.ModelAdmin):
    """Administração para os Níveis VIP."""
    list_display = ('level_number', 'name', 'min_total_deposits', 'min_successful_referrals')
    ordering = ('level_number',)

@admin.register(MachinePlan)
class MachinePlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'min_investment_value', 'return_percentage', 'lifespan_days', 'expiration_date', 'is_active', 'is_expired', 'image')
    list_filter = ('is_active', 'expiration_date')
    search_fields = ('name',)

@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'invested_amount', 'start_date', 'end_date', 'is_active', 'current_value')
    readonly_fields = ('current_value', 'start_date', 'end_date')
    list_filter = ('is_active', 'plan')
    search_fields = ('user__name',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """Administração para todas as transações, incluindo o novo fluxo de saques."""
    list_display = ('user', 'transaction_type', 'amount', 'status', 'timestamp')
    list_filter = ('status', 'transaction_type')
    search_fields = ('user__name', 'reference_id')
    readonly_fields = ('timestamp',)
    actions = ['mark_as_processing', 'approve_transactions', 'reject_transactions']

    def mark_as_processing(self, request, queryset):
        """Ação para o admin marcar um saque como 'Em Processamento'."""
        queryset.filter(transaction_type='WITHDRAWAL', status='PENDING').update(status='PROCESSING')
    mark_as_processing.short_description = "Marcar saques como 'Em Processamento'"

    def approve_transactions(self, request, queryset):
        """Ação para aprovar depósitos ou saques."""
        queryset.filter(status__in=['PENDING', 'PROCESSING']).update(status='APPROVED')
    approve_transactions.short_description = "Aprovar transações selecionadas (Depósitos/Saques)"
    
    def reject_transactions(self, request, queryset):
        """Ação para rejeitar transações."""
        queryset.update(status='REJECTED')
    reject_transactions.short_description = "Rejeitar transações selecionadas"

@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    list_display = ('bank_name', 'account_holder', 'iban', 'is_active')

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'accepted_terms', 'vip_level')
    search_fields = ('user__name',)

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'available_balance', 'invested_balance', 'total_earnings')
    search_fields = ('user__name',)