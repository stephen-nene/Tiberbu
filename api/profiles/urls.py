from django.urls import path, include
from rest_framework import routers
from profiles.views import *

from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)


router = routers.DefaultRouter()
# router.register(r'trips', TripViewSet)
# router.register(r'logs', LogSheetViewSet)

urlpatterns = [
    # path('api/', include(router.urls)),
    
        # Authentication routes ----------------------------
    path('auth/me/', MeView.as_view(), name='me'),  # Logged-in user info route
    path('auth/login/', CustomLoginView.as_view(), name='login'),  # JWT login
    path('auth/signup/', UserCreateView.as_view(), name='signup'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/forgot/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('auth/reset/', ResetPasswordView.as_view(), name='reset_password'),
    
    # Other routes ---------------------------
    # path('auth/token', TokenObtainPairView.as_view(), name='token_obtain'),  # 
    # path('auth/refresh', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh token
    
    
    # All users ---------------------------------------
    path('users/',AllUserView.as_view(),name='all users')
    
    
]
