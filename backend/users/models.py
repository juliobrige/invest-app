from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ValidationError


def validate_angolan_phone_number(value):
    """Valida se o número de telefone começa com o prefixo de Angola."""
    if not value.startswith('+244'):
        raise ValidationError('O número de telefone deve começar com o prefixo de Angola (+244).')
    if len(value) != 13 or not value[1:].isdigit():
        raise ValidationError('O número de telefone deve ter 13 dígitos e conter apenas números após o "+".')


class CustomUserManager(BaseUserManager):
    """Manager para o nosso modelo de utilizador personalizado."""
    def create_user(self, phone_number, name, password=None, **extra_fields):
        if not phone_number:
            raise ValueError('O número de telefone é obrigatório.')
        
        user = self.model(phone_number=phone_number, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(phone_number, name, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    phone_number = models.CharField(
        max_length=13,
        unique=True,
        validators=[validate_angolan_phone_number],
        verbose_name="Número de Telefone"
    )
    name = models.CharField(max_length=150, verbose_name="Nome Completo")
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'phone_number'  
    REQUIRED_FIELDS = ['name']    

    def __str__(self):
        return self.name
