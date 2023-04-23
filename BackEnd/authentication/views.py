from django.shortcuts import render

from django.urls import reverse
from rest_framework.response import Response
from rest_framework import status, generics
from authentication.serializers import RegisterSerializer
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

        # if fcm_token, create FCMDevice
#         device = FCMDevice()
#         try:
#             fcm_token = user_data['fcm_token']
#             if fcm_token:
#                 device.registration_id = fcm_token
#                 device.type = "Android"
#                 device.name = "Can be anything"
#                 device.user = user
#                 device.save()
#         except:
#             return
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
        Utils.send_email(data=data)
        return Response(data={"message":"Account has been created"}, status=status.HTTP_201_CREATED)
