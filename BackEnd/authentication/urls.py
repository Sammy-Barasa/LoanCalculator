from django.urls.conf import path
from authentication.views import RegisterView, VerifyEmailView, LoginView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path("register", RegisterView.as_view(), name="register_endpoint"),
    path("verify_email", VerifyEmailView.as_view(), name="verify_endpoint"),
    path("login", LoginView.as_view(), name="login_endpoint"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]