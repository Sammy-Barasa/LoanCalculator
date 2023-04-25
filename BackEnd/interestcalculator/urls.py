from django.urls.conf import path
from interestcalculator.views import BankView, LoanCreateView, LoanProductGetView,LoanProductEvaluateView,LoanProductCreateView

urlpatterns = [
    
    path("loanproducts/", LoanProductGetView.as_view(), name="loan_products_get_endpoint"),
    path("loanproducts/create/", LoanProductCreateView.as_view(), name="loan_products_get_endpoint"),
    path("loans/create/", LoanCreateView.as_view(), name="loans_create_endpoint"),
    path("banks/", BankView.as_view(), name="banks_endpoint"),
    path("evaluate/", LoanProductEvaluateView.as_view(), name="evaluate_loan_products_endpoint"),
]