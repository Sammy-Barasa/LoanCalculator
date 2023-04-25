from interestcalculator.serializers import LoanProductSerializer
from interestcalculator.models import LoanProduct
data = {
  "loan_product_ids": [1,2],
  "amount": 30000,
  "date": "2023-25-4",
  "frequency":"monthly"
}
products=[]
inp = [products.append(LoanProductSerializer(LoanProduct.objects.get(id=data["loan_product_ids"][i]))) for i in range(0, len(data["loan_product_ids"]))]

print(inp)
print(products)