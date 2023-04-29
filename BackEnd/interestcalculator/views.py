from rest_framework.response import Response
from rest_framework import status, generics
from interestcalculator.serializers import BankSerializer, LoanCreateSerializer, LoanProductSerializer,LoanProductGetSerializer,LoanProductEvaluateSerializer
from interestcalculator.models import Bank, LoanProduct
import pyrebase
from rest_framework.exceptions import ValidationError
from interestcalculator.serializers import LoanProductSerializer
from interestcalculator.models import LoanProduct
import datetime
from dateutil.relativedelta import relativedelta
from interestcalculator.utils import ConnectToFirebase
from rest_framework.views import APIView
from authentication.utils import Utils
from interestcalculator.utils import FileWriter
from pathlib import Path
import os
import csv


# Create your views here.


class BankView(generics.GenericAPIView):
    serializer_class = BankSerializer
    queryset = Bank.objects.all()
    
    
    def post(self, request,**kwargs):
        print(request.data)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            serializer.save()
            return Response(data={"message":"bank created"}, status=status.HTTP_201_CREATED)
        except ValidationError as error:
            return Response(data={"error":error}, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request,**kwargs):
        print(request.data)
        serializer= self.serializer_class(self.get_queryset(),many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class LoanCreateView(generics.GenericAPIView):
    serializer_class = LoanCreateSerializer

    def post(self, request):
        print(request.data)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            serializer.save()
            return Response(data={"message":"loan created "}, status=status.HTTP_201_CREATED)
        except ValidationError as error:
            return Response(data={"error":error}, status=status.HTTP_400_BAD_REQUEST)

    
class LoanProductGetView(generics.GenericAPIView):
    serializer_class = LoanProductGetSerializer
    queryset = LoanProduct.objects.all()

    def get(self, request,**kwargs):
        # loans = [{"bank":"kcb","flat_rate":20,"reducing_rate":18},{"bank":"coop","flat_rate":22,"reducing_rate":20}]
        serializer= self.serializer_class(self.get_queryset(),many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LoanProductCreateView(generics.GenericAPIView):
    serializer_class = LoanProductSerializer

    def post(self, request):
        print(request.data)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            serializer.save()
            return Response(data={"message":"loan product created"}, status=status.HTTP_201_CREATED)
        except ValidationError as error:
            return Response(data={"error":error}, status=status.HTTP_400_BAD_REQUEST)
        # return Response(request.data, status=status.HTTP_201_CREATED) 

class LoanProductEvaluateView(generics.GenericAPIView):
    serializer_class = LoanProductEvaluateSerializer
    

    def post(self, request,**kwargs):
        # id=[], amount, start payment date,payment frequency,
        # priciple, interest,total payable, instalments=[{date:"", amount:"", balance:1000},{}], rate_type,loan_product_id
        # print(request.data)
        
        data = request.data
        products=[]
        interest_rates = []
        possible_total_payable = []
        temporary_installment_rate = []
        temporary_installment_amount = []
        # isolate the loan products the user wants to compare against
        [products.append(LoanProductSerializer(LoanProduct.objects.get(id=data["loan_product"][i])).data) for i in range(0, len(data["loan_product"]))]

        principle = data["amount"]
        payment_frequency = data["payment_frequency"]
        loan_period = data["loan_period"]
        type_interest = data["interest_type"]
        payment_starting_date = data["start_date"]
        payment_starting_date=payment_starting_date.split("-")
        for i in range(0,len(payment_starting_date)):
            payment_starting_date[i]=int(payment_starting_date[i])

        payment_starting_date = datetime.datetime(payment_starting_date[0],payment_starting_date[1],payment_starting_date[2])

        print(payment_starting_date)
        
        payment_frequency_value = 0
        
        if payment_frequency == "annually": payment_frequency_value= 12
        elif payment_frequency == "semi-annually": payment_frequency_value = 6
        elif payment_frequency == "quarterly": payment_frequency_value = 3
        elif payment_frequency == "monthly": payment_frequency_value = 1
        number_of_instalments = int((loan_period)/(payment_frequency_value))

        print("number of installments: ",number_of_instalments)
        print("payment frequency value:",payment_frequency_value)
        
        ## 'amount': 30000, 'payment_frequency': 'monthly', 'loan_period': 12, 'start_date': '2023-25-4', 'interest_type': 'flat'}
        ## [{'id': 1, 'loan_name': 'fuliza', 'bank': 1, 'flat_rate': 20, 'reducing_balance_rate': 18, 'processing_fees': 3, 'exercise_duty': 20, 'legal_fees': 10000}]
        
        # calculate flat rate for every product against principle, PRT/100
        if(type_interest=="flat"):
            [interest_rates.append(principle*((products[i]['flat_rate'])/((12/payment_frequency_value)*100))*number_of_instalments) for i in range(0, len(products))]
            
        # calculate reducing rate for every product
        # EMI = [P x Ix (1+I) ^T]/ [((1+I) ^T)-1)]
        # [interest_rates.append((((principle*((products[i]['reducing_balance_rate'])/(100*payment_frequency_value))*(1+products[i]['reducing_balance_rate'])^(number_of_instalments))/(((1+products[i]['reducing_balance_rate'])^(number_of_instalments))-1))*())-principle) for i in range(0,len(products))]
        elif(type_interest== "reduced"):
            [interest_rates.append((principle*((products[i]['reducing_balance_rate'])/(100*(12/payment_frequency_value)))*(1+products[i]['reducing_balance_rate'])**(number_of_instalments))/(((1+products[i]['reducing_balance_rate'])**(number_of_instalments))-1)) for i in range(0,len(products))]
        # calculate total payable sum for every possible interest
        
        [possible_total_payable.append(principle+interest_rates[i]+products[i]["processing_fees"]+products[i]["legal_fees"]+((((products[i]["exercise_duty"])/100))*products[i]["processing_fees"])) for i in range(0, len(products))]
        print("totalPayable: ",possible_total_payable)
        value_of_installment_amount=[]
        if(type_interest=="flat"):
            [temporary_installment_rate.append((possible_total_payable[i]-principle)/(number_of_instalments)) for i in range(0, len(products))]
            [temporary_installment_amount.append(round((possible_total_payable[i])/(number_of_instalments),2)) for i in range(0, len(products))]
            instalment_table = []
            total_loan= 0
            
            for i in range(0, len(products)):
                next_date = payment_starting_date
                installment_plan = {}
                total_loan= possible_total_payable[i]
                
                for j in range(1,(number_of_instalments+1)):
                    temp_next_date = next_date
                    installment_plan[str(j)] = {"next_date":temp_next_date.strftime("%Y-%m-%d %H:%M:%S"),"loan":total_loan,"installment":temporary_installment_amount[i],"remaining":(round(total_loan-temporary_installment_amount[i],2))}
                
                    total_loan = total_loan-temporary_installment_amount[i]
                    temp_next_date = payment_starting_date+ relativedelta(months=payment_frequency_value)

                instalment_table.append(installment_plan)
            value_of_installment_amount=temporary_installment_amount
            # print(instalment_table) 

        elif(type_interest=="reduced"):
            [temporary_installment_rate.append((possible_total_payable[i]-principle)/(number_of_instalments)) for i in range(0, len(products))]
            [temporary_installment_amount.append(round((possible_total_payable[i])/(number_of_instalments),2)) for i in range(0, len(products))]
            instalment_table = []
            total_loan= 0
            
            for i in range(0, len(products)):
                next_date = payment_starting_date
                installment_plan = {}
                total_loan= possible_total_payable[i]
                
                for j in range(1,(number_of_instalments+1)):
                    temp_next_date = next_date
                    installment_plan[str(j)] = {"next_date":temp_next_date.strftime("%Y-%m-%d %H:%M:%S"),"loan":total_loan,"installment":temporary_installment_amount[i],"remaining":(round(total_loan-temporary_installment_amount[i],2))}
                
                    total_loan = total_loan-temporary_installment_amount[i]
                    temp_next_date = payment_starting_date+ relativedelta(months=payment_frequency_value)

                instalment_table.append(installment_plan)
            value_of_installment_amount=temporary_installment_amount

        
        results = {"principle":principle,"payment_frequency":payment_frequency,"loan_period":loan_period,"type_interest":type_interest,"number":len(products),"total_payable":possible_total_payable,"interest":interest_rates,"number_of_installments":number_of_instalments,"installment_amount":value_of_installment_amount,"instalment_table":instalment_table}      
        print(results)
        try:
            fbse = ConnectToFirebase("EvaluationData",results)
            fbse.firebase_send()
        except:
            pass

        return Response(results, status=status.HTTP_200_OK)

class SendFileView(APIView):
    # email_params = openapi.Parameter(
    #     'email', in_=openapi.IN_BODY, description="email you registered with", type=openapi.TYPE_STRING,)
    # password_params = openapi.Parameter(
    #     'password', in_=openapi.IN_BODY, description="enter your password", type=openapi.TYPE_STRING,)

    # @swagger_auto_schema(manual_parameters=[email_params,password_params])

    def post(self, request):
        # take in the request data
        file_data = request.data
        print(request.user)
        validated_user_email = request.user.email

        print(file_data)
        
        headers = ["next_date","loan","installment","remaining"]
        base_path=Path(__file__).resolve().parent
        absolute_path = str(os.path.join(base_path,'generated-file.csv'))
        absolute_path_excel = str(os.path.join(base_path,'generated-file.xlsx'))
        fr = FileWriter()
        fr.write_dict_to_csv(absolute_path,file_data,headers)
        fr.write_dict_to_excell(absolute_path_excel,file_data)
        subject = "Loan Product Evaluation results"
        body = "you are receiving this email, because you evaluated loan products withLoanInterestCalculator App.\n Find the attached file with the results in this email.\n\nThanks,\n\nLoan Calculator Team"
        data = {'subject': subject, 'body': body,'username':request.user.username,'to_email': validated_user_email}
        
        try:
            Utils.send_email_with_attachment(data=data,file_information=file_data,file_name=absolute_path_excel)
            return Response(data={"message":f"Email sent to {validated_user_email}"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{type(e)}: {e}")
            return Response(data={"message":e}, status=status.HTTP_501_NOT_IMPLEMENTED)
        finally:
            os.remove(absolute_path)
            os.remove(absolute_path_excel)