from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    """Configuração do painel de administração para o nosso utilizador personalizado."""
    list_display = ('phone_number', 'name', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('phone_number', 'name')
    ordering = ('-date_joined',)
    
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

admin.site.register(CustomUser, CustomUserAdmin)