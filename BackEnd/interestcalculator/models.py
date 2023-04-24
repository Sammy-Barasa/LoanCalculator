from django.db import models
from django.contrib.auth import get_user_model


# Create your models here.
#person choices to be personalised


User= get_user_model()


class Bank(models.Model):
    bank_name=models.CharField(max_length=50)

    def __str__(self):
        return f"{self.bank_name}"
    
class LoanProduct(models.Model):
    loan_name = models.CharField(max_length=50)
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE, related_name="from_bank")
    flat_rate=models.IntegerField()
    reducing_balance_rate=models.IntegerField()
    processing_fees=models.IntegerField(default=3)
    exercise_duty=models.IntegerField(default=20)
    legal_fees=models.IntegerField(default=10000)

    def __str__(self):
        return f"{self.bank},flat{self.loan_name}"
    

class Loan(models.Model):
    person = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='loanee')
    loan_product = models.ForeignKey(
        LoanProduct, on_delete=models.CASCADE, related_name='loan_taken')
    amount=models.IntegerField(default=0)
    payment_frequency=models.CharField(max_length=50) #annually, quarterly, monthly ,every 6 month
    loan_period=models.IntegerField() # in months
    start_date=models.DateField()
    interest_type=models.CharField(max_length=200)
    principle = models.IntegerField(blank=True)
    interest = models.IntegerField(blank=True)
    total_payable = models.IntegerField(blank=True)

    def __str__(self):
        return f"{self.person},{self.loan_product} - {self.amount},{self.rate_type} for {self.loan_period}"
    