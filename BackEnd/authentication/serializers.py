from rest_framework import serializers
from .models import User
from django.core.exceptions import ValidationError
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from authentication.models import get_tokens_for_user


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=60, min_length=4, write_only=True)
#     fcm_token = serializers.CharField(write_only=True, required= False)
    class Meta:
        model = get_user_model()
        fields = ['email', 'username', 'password']
#         extra_kwargs = {'fcm_token':{
#                                       'required':False,
#                                       'allow_null':True
#                                     }
#                        }

    def validate(self, attr):
        email = attr.get('email')
        username = attr.get('username')
        password = attr.get('password')

        if not password.isalnum():
            raise ValidationError('Username must contain only alphanumeric')
        return attr

    def create(self, validated_data):
        validated_data.pop("fcm_token",None)
        return get_user_model().objects.create_user(**validated_data)


class EmailVerifySerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=700)

    class Meta:
        model = get_user_model()
        fields = ['token']


class LoginViewSerializer(serializers.Serializer):
    # fields
    username = serializers.CharField(max_length=100, read_only=True)
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(
        min_length=6, max_length=100, write_only=True)
    tokens = serializers.SerializerMethodField()

    # get_user_token from the method in our user model
    def get_tokens(self, obj):
        user = User.objects.get(email=obj['email'])
        return{
            "refresh": get_tokens_for_user(user)['refresh'],
            "access": get_tokens_for_user(user)['access']
        }

    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'password', 'username', 'tokens']

    # validate
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # authenticate the user
        authenticated_user = auth.authenticate(email=email, password=password)
        print(authenticated_user)
        if not authenticated_user:
            raise AuthenticationFailed('Invalid credentials, try again')
        if not authenticated_user.is_verified:
            print("email not verified")
            raise AuthenticationFailed('Email has not been verified')
        if not authenticated_user.is_active:
            raise AuthenticationFailed('Account disabled, contact admin')

        '''
        # return the access token of the users
        tokens = authenticated_user.get_tokens_for_user()
        # referctored into get_token method
        '''
        data = {
            "id": authenticated_user.id,
            "username": authenticated_user.username,
            "email": authenticated_user.email,
            "tokens": get_tokens_for_user(authenticated_user),
        }
        return data
    
class RegisterSocialSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=60, min_length=4, write_only=True)
#     fcm_token = serializers.CharField(write_only=True, required= False)
    class Meta:
        model = get_user_model()
        fields = ['email', 'username', 'password','is_verified']
#         extra_kwargs = {'fcm_token':{
#                                       'required':False,
#                                       'allow_null':True
#                                     }
#                        }

    def validate(self, attr):
        email = attr.get('email')
        username = attr.get('username')
        password = attr.get('password')

        if not password.isalnum():
            raise ValidationError('Username must contain only alphanumeric')
        return attr

    def create(self, validated_data):
        # validated_data.pop("fcm_token",None)
        return get_user_model().objects.create_user(**validated_data)

class SocialSerializer(serializers.Serializer):
    # fields
    username = serializers.CharField(max_length=100, read_only=False)
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(
        min_length=6, max_length=100, write_only=True)
    # tokens = serializers.SerializerMethodField()
    # # is_verified = serializers.BooleanField()

    # # get_user_token from the method in our user model
    # def get_tokens(self, obj):
    #     user = User.objects.get(email=obj['email'])
    #     return{
    #         "refresh": get_tokens_for_user(user)['refresh'],
    #         "access": get_tokens_for_user(user)['access']
    #     }

    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'password', 'username', 'is_verified','tokens']

    # validate
    def validate(self, attrs):
        print("here")
        print(attrs)
        email = attrs.get('email')
        password = attrs.get('password')
        is_verified = attrs.get("is_verified")
        username = attrs.get('username')
        # authenticate the user
        
        try:
            authenticated_user = auth.authenticate(email=email, password=password)
            print(authenticated_user)
            if not authenticated_user:
                print(username)
                print(attrs)
                rserializer=RegisterSocialSerializer(data={"email":email,"password":password,"is_verified":is_verified,"username":username})
                rserializer.is_valid(raise_exception=True)
                rserializer.save()
                user_data = rserializer.validated_data
                new_user = auth.authenticate(email=user_data["email"], password=password)
                data_user = {
                    "id": new_user.id,
                    "username": new_user.username,
                    "email": new_user.email,
                    "tokens": get_tokens_for_user(new_user),
                }
                return data_user
                
            if not authenticated_user.is_verified:
                print("email not verified")
                raise AuthenticationFailed('Email has not been verified')
            if not authenticated_user.is_active:
                raise AuthenticationFailed('Account disabled, contact admin')
                
            data = {
            "id": authenticated_user.id,
            "username": authenticated_user.username,
            "email": authenticated_user.email,
            "tokens": get_tokens_for_user(authenticated_user),
            }
            return data
        except:
            return attrs


