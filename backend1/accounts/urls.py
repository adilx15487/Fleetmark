from rest_framework.routers import DefaultRouter
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from accounts.views import UserViewSet, OAuth42CallbackView, SetRoleView

router = DefaultRouter()

router.register("users", UserViewSet, basename='user')

urlpatterns = [
    # JWT Authentication endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # 42 OAuth
    path('42/callback/', OAuth42CallbackView.as_view(), name='oauth_42_callback'),

    # Role selection (post-42-login)
    path('set-role/', SetRoleView.as_view(), name='set_role'),
] + router.urls