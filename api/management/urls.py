from django.urls import path, include
from rest_framework import routers
from management.views import *

router = routers.DefaultRouter()
# router.register(r'trips', TripViewSet)
# router.register(r'logs', LogSheetViewSet)

urlpatterns = [
    
    path('api/', include(router.urls)),
]
