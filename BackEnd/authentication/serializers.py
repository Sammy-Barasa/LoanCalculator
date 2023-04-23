from rest_framework import serializers
from .models import User
from django.core.exceptions import ValidationError
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model


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
            "refresh": user.get_tokens_for_user()['refresh'],
            "access": user.get_tokens_for_user()['access']
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
            return AuthenticationFailed('Email has not been verified')
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
            "tokens": authenticated_user.get_tokens_for_user,
        }
        return data