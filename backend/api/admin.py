# api/admin.py
from django.contrib import admin
from django.db import transaction as db_transaction
from django.utils.html import format_html
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from .models import Profile, Wallet, MachinePlan, Investment, Transaction, VIPLevel, BankAccount

class ProfileInline(admin.StackedInline):
    """Permite editar o Perfil diretamente na página do Utilizador."""
    model = Profile
    can_delete = False
    verbose_name_plural = 'Perfis'
    fk_name = 'user'

class WalletInline(admin.StackedInline):
    """Mostra os dados da Carteira diretamente na página do Utilizador."""
    model = Wallet
    can_delete = False
    verbose_name_plural = 'Carteiras'
    # Campos da carteira são apenas para leitura para evitar erros manuais
    readonly_fields = ('available_balance', 'invested_balance', 'total_earnings', 'total_balance')

    def total_balance(self, instance):
        # Um campo calculado para mostrar o balanço total na UI
        return instance.available_balance + instance.invested_balance
    total_balance.short_description = "Balanço Total (Disponível + Investido)"

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    """
    Uma versão melhorada do admin de Utilizadores que inclui o Perfil e a Carteira.
    """
    inlines = (ProfileInline, WalletInline, )

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super(CustomUserAdmin, self).get_inline_instances(request, obj)

# --- Administração dos Outros Modelos ---

@admin.register(VIPLevel)
class VIPLevelAdmin(admin.ModelAdmin):
    """Administração para os Níveis VIP."""
    list_display = ('level_number', 'name', 'min_total_deposits', 'min_successful_referrals')
    ordering = ('level_number',)

@admin.register(MachinePlan)
class MachinePlanAdmin(admin.ModelAdmin):
    """Administração para os Planos de Máquinas."""
    list_display = ('name', 'min_investment_value', 'return_percentage', 'lifespan_days', 'expiration_date', 'is_active', 'is_expired')
    list_filter = ('is_active', 'expiration_date')
    search_fields = ('name',)

@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    """Administração para os Investimentos."""
    list_display = ('id', 'user_link', 'plan', 'invested_amount', 'start_date', 'end_date', 'is_active')
    readonly_fields = ('current_value', 'start_date', 'end_date', 'total_return', 'total_profit')
    list_filter = ('is_active', 'plan__name')
    search_fields = ('user__username', 'user__first_name', 'user__last_name')
    list_display_links = ('id', 'user_link')

    def user_link(self, obj):
        # Cria um link para a página do utilizador
        return format_html('<a href="/admin/auth/user/{}/change/">{}</a>', obj.user.id, obj.user.username)
    user_link.short_description = 'Utilizador'

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """Administração para as Transações com lógica de aprovação/rejeição melhorada."""
    list_display = ('id', 'user_link', 'transaction_type', 'amount', 'colored_status', 'timestamp')
    list_filter = ('status', 'transaction_type')
    search_fields = ('user__username', 'reference_id')
    readonly_fields = ('timestamp',)
    actions = ['approve_selected', 'reject_selected']
    list_display_links = ('id',)

    def user_link(self, obj):
        return format_html('<a href="/admin/auth/user/{}/change/">{}</a>', obj.user.id, obj.user.username)
    user_link.short_description = 'Utilizador'

    def colored_status(self, obj):
        # Adiciona cores ao estado para uma identificação visual rápida
        if obj.status == 'APPROVED':
            color = 'green'
        elif obj.status == 'REJECTED':
            color = 'red'
        elif obj.status == 'PENDING':
            color = 'orange'
        else:
            color = 'gray'
        return format_html('<b style="color: {};">{}</b>', color, obj.get_status_display())
    colored_status.short_description = 'Estado'
    colored_status.admin_order_field = 'status'

    @admin.action(description='✅ Aprovar transações PENDENTES selecionadas')
    def approve_selected(self, request, queryset):
        # Ação agora só funciona em transações pendentes para evitar reprocessamento
        transactions_to_process = queryset.filter(status='PENDING')
        
        approved_count = 0
        for trans in transactions_to_process:
            try:
                with db_transaction.atomic():
                    if trans.transaction_type == 'DEPOSIT':
                        wallet = trans.user.wallet
                        wallet.available_balance += trans.amount
                        wallet.save()
                    # Para SAQUES, a aprovação significa que o dinheiro foi enviado.
                    # O saldo já foi debitado no momento do pedido.
                    
                    trans.status = 'APPROVED'
                    trans.save()
                    approved_count += 1
            except Exception as e:
                self.message_user(request, f"Erro ao aprovar a transação #{trans.id}: {e}", level='error')

        if approved_count > 0:
            self.message_user(request, f'{approved_count} transações foram aprovadas com sucesso.')

    @admin.action(description='❌ Rejeitar transações PENDENTES selecionadas')
    def reject_selected(self, request, queryset):
        transactions_to_process = queryset.filter(status='PENDING')
        
        rejected_count = 0
        for trans in transactions_to_process:
            try:
                with db_transaction.atomic():
                    # Se for um SAQUE rejeitado, o dinheiro deve ser devolvido à carteira.
                    if trans.transaction_type == 'WITHDRAWAL':
                        wallet = trans.user.wallet
                        wallet.available_balance += trans.amount
                        wallet.save()
                    # Se for um DEPÓSITO rejeitado, não fazemos nada na carteira.
                    
                    trans.status = 'REJECTED'
                    trans.save()
                    rejected_count += 1
            except Exception as e:
                self.message_user(request, f"Erro ao rejeitar a transação #{trans.id}: {e}", level='error')
        
        if rejected_count > 0:
            self.message_user(request, f'{rejected_count} transações foram rejeitadas.')

@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    list_display = ('bank_name', 'account_holder', 'iban', 'is_active')

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    """Administração para visualização de todas as carteiras."""
    list_display = ('user', 'available_balance', 'invested_balance', 'total_earnings', 'total_balance')
    search_fields = ('user__username',)
    readonly_fields = ('available_balance', 'invested_balance', 'total_earnings', 'total_balance')

    def total_balance(self, instance):
        return instance.available_balance + instance.invested_balance
    total_balance.short_description = "Balanço Total"

