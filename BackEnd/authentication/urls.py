from django.urls.conf import path
from authentication.views import RegisterView, VerifyEmailView, LoginView, SocialLoginView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register_endpoint"),
    path("verify_email/", VerifyEmailView.as_view(), name="verify_endpoint"),
    path("login/", LoginView.as_view(), name="login_endpoint"),
    path("login/social/", SocialLoginView.as_view(), name="social_login_endpoint"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]