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