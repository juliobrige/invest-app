from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser
from api.models import Profile, Wallet

# Criamos uma "secção" para o Perfil que vai aparecer dentro da página do Utilizador
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Perfil do Utilizador'
    fk_name = 'user' # Essencial para resolver a ambiguidade
    # MELHORIA: Mostramos mais campos, mas como apenas de leitura
    readonly_fields = ('referral_code', 'referred_by', 'vip_level', 'accepted_terms')

# Criamos uma "secção" para a Carteira
class WalletInline(admin.StackedInline):
    model = Wallet
    can_delete = False
    verbose_name_plural = 'Carteira'
    # MELHORIA: Adicionamos um campo calculado para ver o balanço total
    readonly_fields = ('available_balance', 'invested_balance', 'total_earnings', 'total_balance')

    def total_balance(self, instance):
        # Um campo calculado para mostrar o balanço total na UI
        if instance.pk: # Garante que a instância da carteira existe
            return instance.available_balance + instance.invested_balance
        return 0
    total_balance.short_description = "Balanço Total (Disponível + Investido)"


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    """Configuração do painel de administração para o nosso utilizador personalizado."""
    inlines = (ProfileInline, WalletInline)
    
    # MELHORIA: Adicionamos o nível VIP diretamente na lista de utilizadores
    list_display = ('phone_number', 'name', 'get_vip_level', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('phone_number', 'name')
    ordering = ('-date_joined',)
    list_filter = ('is_staff', 'is_active', 'profile__vip_level') # Permite filtrar por nível VIP

    # Mantemos a estrutura do UserAdmin padrão para consistência e segurança
    fieldsets = (
        (None, {'fields': ('phone_number', 'password')}),
        ('Informações Pessoais', {'fields': ('name',)}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone_number', 'name', 'password', 'password2'),
        }),
    )

    @admin.display(description='Nível VIP')
    def get_vip_level(self, obj):
        # Função para ir buscar e mostrar o nome do nível VIP na lista
        if hasattr(obj, 'profile'):
            return obj.profile.vip_level.name
        return 'N/A'

