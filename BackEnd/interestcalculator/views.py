from rest_framework.response import Response
from rest_framework import status, generics
from interestcalculator.serializers import BankSerializer, LoanCreateSerializer, LoanProductSerializer,LoanProductEvaluateSerializer
from interestcalculator.models import Bank, LoanProduct
import pyrebase
import os

# from dotenv import dotenv_values
# config = dotenv_values(".env")
# print(config)
# Create your views here.



firebaseConfig = {
  "apiKey": "AIzaSyCJZJVSecrTTHHPOR6axx0s4MplRnXNjCY",
 "authDomain": "loaninterestcalculator-47138.firebaseapp.com",
  "databaseURL": "https://loaninterestcalculator-47138-default-rtdb.firebaseio.com",
  "projectId": "loaninterestcalculator-47138",
  "storageBucket": "loaninterestcalculator-47138.appspot.com",
  "messagingSenderId": "809479780786",
  "appId": "1:809479780786:web:d82d9a3013cdfc041f8cab",
  "measurementId": "G-6JPM2VVNMR"
}

firebase=pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()
# email_val = config['FIREBASE_EMAIL']
# pass_val = config['FIREBASE_PASSWORD']
email_val = os.environ.get("FIREBASE_EMAIL")
pass_val = os.environ.get("FIREBASE_PASSWORD")
user = auth.sign_in_with_email_and_password(email=email_val,password=pass_val )
user = auth.refresh(user['refreshToken'])
database=firebase.database()


class BankView(generics.GenericAPIView):
    serializer_class = BankSerializer
    queryset = Bank.objects.all()
    
    
    def post(self, request,**kwargs):
        print(request.data)
        return Response(request.data, status=status.HTTP_201_CREATED)

    def get(self, request,**kwargs):
        # banks = [{"name":"kcb"},{"name":"coop"}]
        print(request.data)
        serializer= self.serializer_class(self.get_queryset(),many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class LoanCreateView(generics.GenericAPIView):
    serializer_class = LoanCreateSerializer

    def post(self, request):
        print(request.data)
        return Response(request.data, status=status.HTTP_201_CREATED)
    
class LoanProductGetView(generics.GenericAPIView):
    serializer_class = LoanProductSerializer
    queryset = LoanProduct.objects.all()

    def get(self, request,**kwargs):
        # loans = [{"bank":"kcb","flat_rate":20,"reducing_rate":18},{"bank":"coop","flat_rate":22,"reducing_rate":20}]
        serializer= self.serializer_class(self.get_queryset(),many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class LoanProductEvaluateView(generics.GenericAPIView):
    serializer_class = LoanProductEvaluateSerializer
    

    def post(self, request,**kwargs):
        # id=[], amount, start payment date,payment frequency,
        print(request.data)
        database.child("EvaluationData").push(request.data, user['idToken'])
        return Response(request.data, status=status.HTTP_200_OK)
    # lookup_field = "bank_id"

    # overriding get queryset

    # def get_queryset(self):
    #     """
    #     returns specific work for detail(get),updated(put),deleting(delete) 
    #     """
    #     id = self.kwargs['bank_id']
    #     print(id)
    #     queryset = Bank.objects.get(id=id)
    #     return queryset
    
    # def put(self, request, bank_id):
    #     print(bank_id)
    #     data = request.data
    #     serializer = self.serializer_class(self.get_queryset(),data=data)
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()
    #     print(serializer.data)
    #     return Response(data={"message": "bank has been updated"}, status=status.HTTP_200_OK)