# Generated by Django 4.2 on 2023-04-24 20:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Bank',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bank_name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='LoanProduct',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('loan_name', models.CharField(max_length=50)),
                ('flat_rate', models.IntegerField()),
                ('reducing_balance_rate', models.IntegerField()),
                ('processing_fees', models.IntegerField(default=3)),
                ('exercise_duty', models.IntegerField(default=20)),
                ('legal_fees', models.IntegerField(default=10000)),
                ('bank', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='from_bank', to='interestcalculator.bank')),
            ],
        ),
        migrations.CreateModel(
            name='Loan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(default=0)),
                ('payment_frequency', models.CharField(max_length=50)),
                ('loan_period', models.IntegerField()),
                ('start_date', models.DateField()),
                ('interest_type', models.CharField(max_length=200)),
                ('principle', models.IntegerField(blank=True)),
                ('interest', models.IntegerField(blank=True)),
                ('total_payable', models.IntegerField(blank=True)),
                ('loan_product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='loan_taken', to='interestcalculator.loanproduct')),
                ('person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='loanee', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]