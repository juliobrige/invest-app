from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ValidationError
import re 

def validate_angolan_phone_number(value):
    """
    Valida se o número de telefone segue o formato angolano (+244 seguido de 9 dígitos).
    Permite números com ou sem espaços.
    """
    # Remove espaços em branco para facilitar a validação
    cleaned_value = re.sub(r'\s+', '', value)

    # Verifica se o formato geral corresponde a +244 seguido por 9 dígitos numéricos
    if not re.match(r'^\+244\d{9}$', cleaned_value):
        raise ValidationError(
            'Número de telefone inválido. O formato deve ser +244 seguido de 9 dígitos (ex: +244912345678).'
        )
    
    # O modelo CharField irá guardar o valor com 13 caracteres
    if len(cleaned_value) != 13:
        raise ValidationError('O número de telefone deve conter 13 caracteres no total (+244xxxxxxxxx).')



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
