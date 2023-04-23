from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from rest_framework_simplejwt.tokens import RefreshToken
from phone_field import PhoneField

# Create your models here.

# Custom User model for verify user emails and sending verification links


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        if username is None:
            raise TypeError('Users should have a unique username')
        if email is None:
            raise TypeError('Users should have a unique email')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, password):
        if password is None:
            raise TypeError('Users should have password')

        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user


class User(AbstractUser):
    username = models.CharField(max_length=255, unique=True, db_index=True)
    email = models.EmailField(max_length=255, unique=True, db_index=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    phone = PhoneField(blank=True, help_text='Contact phone number')
    mpesa_no = PhoneField(blank=True, help_text='Mpesa phone number')
    is_developer = models.BooleanField(default=False)
    is_social_login = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.username}-{self.email}"

def get_tokens_for_user(user_obj):
    refresh = RefreshToken.for_user(user_obj)
    refresh['user_name'] = user_obj.username
    refresh['email'] = user_obj.email
    print(refresh)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
