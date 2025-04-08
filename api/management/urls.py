from django.urls import path, include
from rest_framework import routers
from management.views import *
from profiles.views import FunnyAPIView

router = routers.DefaultRouter()
router.register(r'specializations', SpecializationViewSet, basename='specialization')
router.register(r'availabilities', AvailabilityViewSet, basename='availability')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'clinical-attachments', ClinicalAttachmentViewSet, basename='clinical-attachment')
router.register(r'prescriptions', PrescriptionViewSet, basename='prescription')
# router.register(r'trips', TripViewSet)
# router.register(r'logs', LogSheetViewSet)

urlpatterns = [
    
    path('', include(router.urls)),
    path('home/', FunnyAPIView.as_view(), name='default_view'),
    # router.urls,
    
]
