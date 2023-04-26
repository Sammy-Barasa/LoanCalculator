
from rest_framework import serializers
from interestcalculator.models import Bank,LoanProduct,Loan
from django.contrib.auth import get_user_model




User= get_user_model()


class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = ['id','bank_name']
        read_only_fields = ['id']
        
        # validate

        def validate(self, attr):
            return attr

        # create
        def create(self, validated_data):
            bank = Bank.objects.create(**validated_data)
            return bank
        
        def update(self, instance, validated_data):
            instance.bank_name = validated_data.get('bank_name', instance.bank_name)
            instance.save()
            return instance
        
class LoanProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanProduct

        fields = ['id','loan_name','bank','flat_rate','reducing_balance_rate','processing_fees','exercise_duty','legal_fees']
        read_only_fields = ['id','processing_fees','exercise_duty','legal_fees']
        
        # validate

        def validate(self, attr):
            return attr

        # create
        def create(self, validated_data):
            bank_id = validated_data.pop('bank')
            loanproduct = LoanProduct.objects.create(from_bank=int(bank_id),**validated_data)
            return loanproduct
        # update
        def update(self, instance, validated_data):
            instance.loan_name = validated_data.get('loan_name', instance.loan_name)
            instance.flat_rate = validated_data.get('flat_rate', instance.flat_rate)
            instance.reducing_balance_rate = validated_data.get('reducing_balance_rate', instance.reducing_balance_rate)
            instance.save()
            return instance

class LoanProductGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanProduct

        fields = ['id','loan_name','bank','flat_rate','reducing_balance_rate','processing_fees','exercise_duty','legal_fees']
        read_only_fields = ['id','processing_fees','exercise_duty','legal_fees']
        depth = 1
        # validate

        def validate(self, attr):
            return attr



class LoanCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan

        #annually, quarterly, monthly ,every 6 month

        fields = ['id','loan_product','amount','payment_frequency','loan_period','start_date','interest_type','principle','interest','total_payable']
        read_only_fields = ['id']
        
        # validate

        def validate(self, attr):
            return attr

        # create
        def create(self, validated_data):
            loan = Loan.objects.create(loanee=User.object.get(id=self.context["request"].user),loan_taken=Loan.object.get(id=self.context["request"]["data"]["loan_product_id"]),**validated_data)
            return loan
        
class LoanGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan

        #annually, quarterly, monthly ,every 6 month


        fields = ['id','loan_product','amount','payment_frequency','loan_period','start_date','interest_type','principle','interest','total_payable']
        read_only_fields = ['id','loan_product','amount','payment_frequency','loan_period','start_date','interest_type','principle','interest','total_payable']
        
        # validate

        def validate(self, attr):
            return attr
        # # update
        # def update(self, instance, validated_data):
        #     instance.loan_name = validated_data.get('loan_name', instance.loan_name)
        #     instance.flat_rate = validated_data.get('flat_rate', instance.flat_rate)
        #     instance.reducing_balance_rate = validated_data.get('reducing_balance_rate', instance.reducing_balance_rate)
        #     instance.save()
        #     return instance


class LoanProductEvaluateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan

        # fields = ['id','loan_name','bank','flat_rate','reducing_balance_rate','processing_fees','exercise_duty','legal_fees']
        # read_only_fields = ['id','bank','processing_fees','exercise_duty','legal_fees']
        
        fields = ['id','loan_product','amount','payment_frequency','loan_period','start_date','interest_type']
        # read_only_fields = ['id','bank','processing_fees','exercise_duty','legal_fees']
        # validate

        def validate(self, attr):
            return attr