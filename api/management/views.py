from django.db import transaction

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Specialization,Availability,Appointment 
from .serializers import SpecializationSerializer,AvailabilitySerializer, AppointmentSerializer
from django.shortcuts import get_object_or_404

from profiles.permissions import IsAdminUserCustom

from datetime import datetime, date, timedelta


class SpecializationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing medical specializations.
    """
    queryset = Specialization.objects.filter(is_active=True).order_by('display_order')
    serializer_class = SpecializationSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    # def get_permissions(self):
    #     if self.action in ['create', 'update', 'partial_update', 'destroy', 'toggle_active']:
    #         return [IsAdminUserCustom()]
    #     return [permissions.AllowAny()]

    def get_queryset(self):
        """
        Optionally filter by department or type
        """
        queryset = super().get_queryset()
        
        # Filter by department if provided
        department = self.request.query_params.get('department', None)
        if department:
            queryset = queryset.filter(department__iexact=department)
            
        # Filter by surgical status if provided
        is_surgical = self.request.query_params.get('is_surgical', None)
        if is_surgical in ['true', 'false']:
            queryset = queryset.filter(is_surgical=(is_surgical == 'true'))
            
        # Filter by primary care status if provided
        is_primary_care = self.request.query_params.get('is_primary_care', None)
        if is_primary_care in ['true', 'false']:
            queryset = queryset.filter(is_primary_care=(is_primary_care == 'true'))
            
        return queryset

    def perform_create(self, serializer):
        """Automatically set the slug when creating"""
        serializer.save(slug=serializer.validated_data['name'].lower().replace(' ', '-'))

    @action(detail=False, methods=['get'])
    def departments(self, request):
        """
        Get list of all unique departments
        """
        departments = Specialization.objects.filter(is_active=True)\
            .order_by('department')\
            .values_list('department', flat=True)\
            .distinct()
        return Response([d for d in departments if d])

    @action(detail=False, methods=['get'])
    def surgical(self, request):
        """
        Get only surgical specializations
        """
        surgical = self.get_queryset().filter(is_surgical=True)
        serializer = self.get_serializer(surgical, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def primary_care(self, request):
        """
        Get only primary care specializations
        """
        primary_care = self.get_queryset().filter(is_primary_care=True)
        serializer = self.get_serializer(primary_care, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, slug=None):
        """
        Toggle is_active status of a specialization
        """
        specialization = self.get_object()
        specialization.is_active = not specialization.is_active
        specialization.save()
        return Response({'status': 'success', 'is_active': specialization.is_active})

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete by setting is_active=False
        """
        specialization = self.get_object()
        specialization.is_active = False
        specialization.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer


    def create(self, request, *args, **kwargs):
        """
        Handles the creation of Availability slots for a doctor.
        The creation is wrapped in a transaction to ensure atomicity.
        """
        try:
            with transaction.atomic():
                # Serialize the data but don't validate or handle the logic here
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                # data=request.data
                # if Availability.objects.filter(
                #     doctor=doctor,
                #     weekday=serializer.validated_data['weekday'],
                #     start_time=serializer.validated_data['start_time'],
                #     end_time=serializer.validated_data['end_time']
                # ).exists():
                #     return Response(
                #         {"detail": "This availability slot already exists for this doctor."},
                #         status=status.HTTP_400_BAD_REQUEST
                #     )
                # You can add business logic here to associate with the doctor, etc.
                # Minimum duration check
                # duration = datetime.combine(date.today(), data['end_time']) - datetime.combine(date.today(), data['start_time'])
                # if duration < timedelta(minutes=15):
                #     raise serializers.ValidationError({
                #         'end_time': 'Time slot must be at least 15 minutes long.'
                #     })

                # Overlap validation
                # if not self.instance or any(data.get(field) != getattr(self.instance, field) 
                # for field in ['doctor', 'weekday', 'start_time', 'end_time']):
                #     overlaps = Availability.objects.filter(
                #         doctor=data['doctor'],
                #         weekday=data['weekday'],
                #         start_time__lt=data['end_time'],
                #         end_time__gt=data['start_time']
                #     ).exclude(pk=self.instance.pk if self.instance else None)

                #     if overlaps.exists():
                #         raise serializers.ValidationError({
                #             'non_field_errors': ['This time slot overlaps with existing availability.']
                #         })

                # Create the availability slot without additional logic in the serializer
                availability = serializer.save()

                return Response(
                    AvailabilitySerializer(availability).data,
                    status=status.HTTP_201_CREATED
                )

        except Exception as e:
            # Handle any exceptions here (e.g., unique constraint violations, etc.)
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    
    # def create(self, request, *args, **kwargs):
        