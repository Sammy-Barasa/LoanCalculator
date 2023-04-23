import os
from django.shortcuts import render

from django.urls import reverse
from rest_framework.response import Response
from rest_framework import status, generics
from authentication.serializers import RegisterSerializer,LoginViewSerializer, EmailVerifySerializer
from authentication.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.sites.shortcuts import get_current_site
from drf_yasg.utils import swagger_auto_schema
from authentication.renderers import UserRenderer
from authentication.utils import Utils
from django.conf import settings
from drf_yasg import openapi
from django.contrib.auth import authenticate
import jwt
from rest_framework.exceptions import AuthenticationFailed
# from fcm_django.models import FCMDevice
from django.http import HttpResponseRedirect


# Create your views here.
class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.validated_data
        # use saved email to send verifying link
        validated_user = User.objects.get(email=user_data['email'])

        # give user a token tto verify email
        tokens = validated_user.get_tokens_for_user()
        # print(tokens)
        accesstoken = tokens["access"]
        print("access: ", str(accesstoken))
        # link to verify API endpoint
        endpoint = reverse('verify_endpoint')
        # current site domain
        domain = get_current_site(request).domain
        print(domain)
        # constract link from http/https + domain + verify_endpoint and q=access
        verifylink = 'https://'+domain+endpoint+'?token=' + str(accesstoken)
        print(verifylink)
        # constract the message
        subject = "Verify your Email"
        body = "Hi, "+validated_user.username + \
            ",WorkRecordManager wants to verify your email.use this link to do so.\n" + verifylink
        data = {'subject': subject, 'body': body,
                'to_email': validated_user.email}
        try:
            Utils.send_email(data=data)
            return Response(data={"message":"Account has been created"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"{type(e)}: {e}")
            return Response(data={"message":e}, status=status.HTTP_501_NOT_IMPLEMENTED)


class VerifyEmailView(generics.GenericAPIView):
    serializer_class = EmailVerifySerializer

    token_params = openapi.Parameter(
        'token', in_=openapi.IN_QUERY, description="verify your email using  your token", type=openapi.TYPE_STRING,)

    @swagger_auto_schema(manual_parameters=[token_params])
    def get(self, request):
        #  get token and verify it
        tokens = request.GET.get('token')
        print(tokens)
        try:
            payload = jwt.decode(tokens, os.environ.get("JWT_SECRET"))
            print(payload)
            user = User.objects.get(id=payload['user_id'])
            if not user.is_verified:
                # set user is_verified status to True
                user.is_verified = True
                user.save()

                return HttpResponseRedirect("https://loancalculatorweb.netlify.app/login")
            return Response({"message", "email is already verified"}, status=status.HTTP_200_OK)
        except jwt.exceptions.DecodeError as identifier:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.InvalidSignatureError as identifier:
            return Response({"error": "token signature does not match the one provided as part of the token"}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.ExpiredSignatureError as identifier:
            return Response({"error": "your token has expired"}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginViewSerializer

    def post(self, request):
        # take in the request data
        data = request.data
        #send data to serializer
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)