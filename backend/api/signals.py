from django.db import models # ADICIONE ESTA LINHA
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Profile, Wallet, Transaction, VIPLevel
from users.models import CustomUser # Importar o CustomUser para a contagem

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_dependencies(sender, instance, created, **kwargs):
    """Cria um Perfil e uma Carteira automaticamente para cada novo utilizador."""
    if created:
        Profile.objects.create(user=instance)
        Wallet.objects.create(user=instance)

@receiver(post_save, sender=Transaction)
def handle_approved_deposit(sender, instance, created, **kwargs):
    """
    Verifica se é um depósito aprovado para dar bónus e atualizar o nível VIP.
    """
    if instance.transaction_type == 'DEPOSIT' and instance.status == 'APPROVED':
        # Verificamos se é a primeira transação de depósito aprovada
        is_first_deposit = Transaction.objects.filter(
            user=instance.user,
            transaction_type='DEPOSIT',
            status='APPROVED'
        ).count() == 1

        if is_first_deposit:
            referrer = instance.user.profile.referred_by
            if referrer:
                bonus_amount = 500.00
                Transaction.objects.create(
                    user=referrer,
                    transaction_type='BONUS',
                    amount=bonus_amount,
                    status='APPROVED'
                )
                referrer_wallet = referrer.wallet
                referrer_wallet.available_balance += bonus_amount
                referrer_wallet.save()

        # Atualiza sempre o nível VIP após um depósito aprovado
        update_vip_level(instance.user)

def update_vip_level(user):
    """Calcula e atualiza o nível VIP de um utilizador."""
    profile = user.profile
    
    # Calcula os totais do utilizador
    total_deposited = sum(t.amount for t in user.transactions.filter(transaction_type='DEPOSIT', status='APPROVED'))
    
    # CORRIGIDO: Agora usamos CustomUser para a contagem
    successful_referrals = CustomUser.objects.filter(profile__referred_by=user).annotate(
        deposit_count=models.Count('transactions', filter=models.Q(transactions__transaction_type='DEPOSIT', transactions__status='APPROVED'))
    ).filter(deposit_count__gt=0).count()

    # Encontra o melhor nível VIP que o utilizador alcançou
    eligible_levels = VIPLevel.objects.filter(
        min_total_deposits__lte=total_deposited,
        min_successful_referrals__lte=successful_referrals
    ).order_by('-level_number')

    if eligible_levels.exists():
        best_level = eligible_levels.first()
        if profile.vip_level != best_level:
            profile.vip_level = best_level
            profile.save()
