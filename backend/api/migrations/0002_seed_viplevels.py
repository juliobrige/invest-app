from django.db import migrations

def create_vip_levels(apps, schema_editor):
    """
    Cria os Níveis VIP iniciais na base de dados.
    """
    VIPLevel = apps.get_model('api', 'VIPLevel')
    
    if VIPLevel.objects.exists():
        return

    levels = [
        VIPLevel(level_number=1, name='Bronze', min_total_deposits=0, min_successful_referrals=0, withdrawal_fee_reduction=0),
        VIPLevel(level_number=2, name='Prata', min_total_deposits=50000, min_successful_referrals=5, withdrawal_fee_reduction=0.10),
        VIPLevel(level_number=3, name='Ouro', min_total_deposits=250000, min_successful_referrals=15, withdrawal_fee_reduction=0.25),
        VIPLevel(level_number=4, name='Platina', min_total_deposits=1000000, min_successful_referrals=30, withdrawal_fee_reduction=0.50),
        VIPLevel(level_number=5, name='Diamante', min_total_deposits=5000000, min_successful_referrals=50, withdrawal_fee_reduction=0.75),
    ]
    VIPLevel.objects.bulk_create(levels)

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_vip_levels),
    ]
