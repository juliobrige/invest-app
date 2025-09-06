# api/models.py
import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
import os

class VIPLevel(models.Model):
    level_number = models.PositiveSmallIntegerField(primary_key=True, verbose_name="Número do Nível")
    name = models.CharField(max_length=50, verbose_name="Nome do Nível")
    min_total_deposits = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    min_successful_referrals = models.PositiveIntegerField(default=0)
    withdrawal_fee_reduction = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Nível {self.level_number}: {self.name}"

    class Meta:
        ordering = ['level_number']
        verbose_name = "Nível VIP"
        verbose_name_plural = "Níveis VIP"

class MachinePlan(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nome da Máquina")
    image = models.ImageField(
        upload_to='machine_images/',
        null=True,
        blank=True, # A imagem é opcional
        verbose_name="Imagem da Máquina"
    )
    min_investment_value = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor Mínimo de Investimento")
    return_percentage = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Retorno (%)")
    lifespan_days = models.IntegerField(verbose_name="Tempo de Vida do Investimento (dias)")
    expiration_date = models.DateField(verbose_name="Data de Expiração da Máquina (deixa de estar disponível)")
    required_vip_level = models.ForeignKey(VIPLevel, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True, verbose_name="Está ativa para novos investimentos?")

    def __str__(self):
        return self.name

    @property
    def is_expired(self):
        """Verifica se a máquina já expirou para novos investimentos."""
        return timezone.now().date() > self.expiration_date

    class Meta:
        verbose_name = "Máquina de Investimento"
        verbose_name_plural = "Máquinas de Investimento"

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    accepted_terms = models.BooleanField(default=False)
    referral_code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    referred_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='referrals')
    vip_level = models.ForeignKey(VIPLevel, on_delete=models.SET_NULL, null=True, blank=True, default=1)
    def __str__(self): return self.user.name

class Wallet(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    available_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    invested_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_earnings = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    def __str__(self): return f"Carteira de {self.user.name}"

class Investment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='investments')
    plan = models.ForeignKey(MachinePlan, on_delete=models.PROTECT, verbose_name="Máquina Investida")
    invested_amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Valor Investido")
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.id: # Apenas na criação
            self.end_date = timezone.now() + timezone.timedelta(days=self.plan.lifespan_days)
        super().save(*args, **kwargs)

    @property
    def total_return(self):
        """Calcula o valor total que será recebido no final."""
        return self.invested_amount * (1 + (self.plan.return_percentage / 100))

    @property
    def total_profit(self):
        """Calcula apenas o lucro."""
        return self.total_return - self.invested_amount

    @property
    def days_passed(self):
        """Calcula quantos dias já passaram desde o início do investimento."""
        if not self.is_active:
            return self.plan.lifespan_days
        passed = (timezone.now() - self.start_date).days
        return max(0, min(passed, self.plan.lifespan_days))

    @property
    def current_value(self):
        """
        NOVO: Calcula o valor atual do investimento com base nos dias passados.
        Esta é a "magia" do crescimento diário.
        """
        if not self.is_active:
            return self.total_return

        if self.plan.lifespan_days == 0: # Evita divisão por zero
             return self.invested_amount

        daily_profit = self.total_profit / self.plan.lifespan_days
        current_profit = daily_profit * self.days_passed
        return self.invested_amount + current_profit

    def __str__(self):
        return f"Investimento de {self.user.name} em {self.plan.name}"
class Transaction(models.Model):
    TRANSACTION_CHOICES = (
        ('DEPOSIT', 'Depósito'),
        ('WITHDRAWAL', 'Retirada'), # Saque
        ('INVESTMENT', 'Investimento'),
        ('EARNING', 'Ganho'),
        ('BONUS', 'Bónus de Convite'),
    )
    STATUS_CHOICES = (
        ('PENDING', 'Pendente'),
        ('PROCESSING', 'Em Processamento'), # NOVO STATUS
        ('APPROVED', 'Aprovado'), # Concluído com sucesso
        ('REJECTED', 'Rejeitado'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    timestamp = models.DateTimeField(auto_now_add=True)
    
    reference_id = models.CharField(max_length=100, blank=True, null=True)
    proof_of_payment = models.ImageField(upload_to='proof_payments/', blank=True, null=True)
    destination_bank = models.ForeignKey('BankAccount', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']
    def __str__(self):
        return f"{self.get_transaction_type_display()} de {self.amount} por {self.user.name} - {self.status}"

class BankAccount(models.Model):
    bank_name = models.CharField(max_length=100, verbose_name="Nome do Banco")
    account_holder = models.CharField(max_length=150, verbose_name="Titular da Conta")
    account_number = models.CharField(max_length=50, blank=True, null=True)
    iban = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True, verbose_name="Ativo?")
    def __str__(self): return f"{self.bank_name} - {self.account_holder}"
    class Meta: verbose_name="Conta Bancária"; verbose_name_plural="Contas Bancárias"