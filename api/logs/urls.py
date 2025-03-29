from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from logs.views import TripViewSet, LogSheetViewSet

router = routers.DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'logs', LogSheetViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
