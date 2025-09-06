from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction as db_transaction
from api.models import Investment, Transaction

class Command(BaseCommand):
    """
    Comando de gestão do Django para processar investimentos concluídos.
    Executa automaticamente todos os dias para finalizar os investimentos que chegaram à sua data de fim.
    """
    help = 'Verifica e finaliza os investimentos que já atingiram a sua data de fim (end_date).'

    def handle(self, *args, **options):
        # Escreve uma mensagem no terminal a indicar que o processo começou.
        self.stdout.write(self.style.SUCCESS('A iniciar o processo de verificação de investimentos concluídos...'))

        # 1. Encontrar todos os investimentos que estão ativos mas cuja data de fim já passou.
        investments_to_process = Investment.objects.filter(
            is_active=True,
            end_date__lte=timezone.now()
        )

        if not investments_to_process.exists():
            self.stdout.write(self.style.SUCCESS('Nenhum investimento para processar.'))
            return

        processed_count = 0
        # 2. Iterar sobre cada investimento encontrado.
        for investment in investments_to_process:
            try:
                # Usamos uma transação atómica para garantir a integridade dos dados.
                # Se algo falhar no meio, todas as operações são revertidas.
                with db_transaction.atomic():
                    user = investment.user
                    wallet = user.wallet
                    
                    # 3. Calcular o valor total de retorno (investimento inicial + lucro).
                    total_return = investment.total_return
                    profit = investment.total_profit

                    # 4. Atualizar a carteira do utilizador.
                    wallet.invested_balance -= investment.invested_amount # Retira o valor do "saldo investido"
                    wallet.available_balance += total_return # Adiciona o valor total ao "saldo disponível"
                    wallet.total_earnings += profit # Adiciona o lucro ao registo de ganhos totais
                    wallet.save()

                    # 5. Criar uma transação de "Ganho" para o histórico do utilizador.
                    Transaction.objects.create(
                        user=user,
                        transaction_type='EARNING',
                        amount=profit,
                        status='APPROVED'
                    )

                    # 6. Marcar o investimento como inativo.
                    investment.is_active = False
                    investment.save()
                    
                    processed_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Investimento #{investment.id} de {user.name} processado com sucesso.'))

            except Exception as e:
                self.stderr.write(self.style.ERROR(f'Erro ao processar o investimento #{investment.id}: {e}'))

        self.stdout.write(self.style.SUCCESS(f'Processo concluído. {processed_count} investimentos foram finalizados.'))