from django.db import transaction

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Specialization,Availability,Appointment,ClinicalAttachment,Prescription,TimeOff
from .serializers import SpecializationSerializer,AvailabilitySerializer, AppointmentSerializer,ClinicalAttachmentSerializer,PrescriptionSerializer,TimeOffSerializer
from django.shortcuts import get_object_or_404

from rest_framework.permissions import IsAuthenticated


# from profiles.permissions import IsAdminUserCustom

from datetime import datetime, date, timedelta
from drf_yasg.utils import swagger_auto_schema

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

    @swagger_auto_schema(
        operation_description="Retrieve a list of all specializations",
        responses={200: SpecializationSerializer(many=True)},
        tags=['Specializations']
    )
    
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Create a new specialization",
        request_body=SpecializationSerializer,
        responses={201: SpecializationSerializer},
        tags=['Specializations']
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Partially update a specialization",
        operation_description="Update only the provided fields of a Specialization (e.g., time, status).",
        tags=["Specializations"]
    )

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retrieve a single specialization",
        responses={200: SpecializationSerializer},
        tags=['Specializations']
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Update a specialization",
        request_body=SpecializationSerializer,
        responses={200: SpecializationSerializer},
        tags=['Specializations']
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Filter ",
        tags=['Specializations']
    )
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

    @swagger_auto_schema(
        operation_description="Get list of all unique departments",
        tags=['Specializations']
    )
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

    @swagger_auto_schema(            
        operation_description="Get only surgical specializations",
        tags=['Specializations']
    )
    @action(detail=False, methods=['get'])
    def surgical(self, request):
        """
        Get only surgical specializations
        """
        surgical = self.get_queryset().filter(is_surgical=True)
        serializer = self.get_serializer(surgical, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Get only primary care specializations",
        tags=['Specializations']
    )
    @action(detail=False, methods=['get'])
    def primary_care(self, request):
        """
        Get only primary care specializations
        """
        primary_care = self.get_queryset().filter(is_primary_care=True)
        serializer = self.get_serializer(primary_care, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Toggle is_active status of a specialization",
        tags=['Specializations'],
        request_body=SpecializationSerializer,)
    @action(detail=True, methods=['post'])
    def toggle_active(self, request, slug=None):
        """
        Toggle is_active status of a specialization
        """
        specialization = self.get_object()
        specialization.is_active = not specialization.is_active
        specialization.save()
        return Response({'status': 'success', 'is_active': specialization.is_active})

    @swagger_auto_schema(
        operation_description="Toggle is_active status of a specialization",
        tags=['Specializations'],            
    )
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
    @swagger_auto_schema(
        operation_description="Create a new availability slot for a doctor",
        request_body=AvailabilitySerializer,
        responses={201: AvailabilitySerializer},
        tags=['Availability']
    )


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

    @swagger_auto_schema(
        operation_summary="List all availabilities",
        tags=["Availability"]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Retrieve availability by ID",
        tags=["Availability"]
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Create a new availability",
        operation_description="Create a new availability slot for a doctor",
        request_body=AvailabilitySerializer,
        responses={201: AvailabilitySerializer},
        tags=["Availability"]
    )
    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                availability = serializer.save()
                return Response(
                    AvailabilitySerializer(availability).data,
                    status=status.HTTP_201_CREATED
                )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Update an availability (full)",
        request_body=AvailabilitySerializer,
        tags=["Availability"]
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Partially update an availability",
        tags=["Availability"]
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Delete an availability",
        tags=["Availability"]
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    




class AppointmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling appointment operations including booking, retrieval, and cancellation.
    """
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    @swagger_auto_schema(
        operation_summary="List all appointments",
        operation_description="Retrieve a list of all booked appointments. Supports pagination and filtering (if configured).",
        tags=["Appointments"]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Retrieve an appointment",
        operation_description="Fetch detailed information about a specific appointment using its ID.",
        tags=["Appointments"]
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Book a new appointment",
        operation_description="Create a new appointment. The system checks for overlapping bookings and ensures valid scheduling.",
        request_body=AppointmentSerializer,
        responses={201: AppointmentSerializer, 400: 'Invalid input or conflicting schedule.'},
        tags=["Appointments"]
    )
    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)

                # Optional: Check for schedule conflicts
                # conflicts = Appointment.objects.filter(
                #     doctor=serializer.validated_data['doctor'],
                #     appointment_time=serializer.validated_data['appointment_time']
                # )
                # if conflicts.exists():
                #     return Response(
                #         {"detail": "Doctor already has an appointment at this time."},
                #         status=status.HTTP_400_BAD_REQUEST
                #     )

                appointment = serializer.save()
                return Response(
                    AppointmentSerializer(appointment).data,
                    status=status.HTTP_201_CREATED
                )

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Update an appointment",
        operation_description="Update all fields of an existing appointment.",
        request_body=AppointmentSerializer,
        tags=["Appointments"]
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    

    @swagger_auto_schema(
        operation_summary="Partially update an appointment",
        operation_description="Update only the provided fields of an appointment (e.g., time, status).",
        tags=["Appointments"]
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Cancel/Delete an appointment",
        operation_description="Remove an appointment from the system. This action is irreversible.",
        tags=["Appointments"]
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
class ClinicalAttachmentViewSet(viewsets.ModelViewSet):
    queryset = ClinicalAttachment.objects.all()
    serializer_class = ClinicalAttachmentSerializer
    permission_classes = [IsAuthenticated]  # Adjust this as needed (e.g., IsAdminUser, etc.)


    @swagger_auto_schema(
        operation_description="List all Clinical Attachments",
        responses={200: ClinicalAttachmentSerializer(many=True)},
        tags=['Clinical Attachments']
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Create a new Clinical Attachment",
        responses={201: ClinicalAttachmentSerializer},
        tags=['Clinical Attachments']
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retrieve a Clinical Attachment by ID",
        responses={200: ClinicalAttachmentSerializer},
        tags=['Clinical Attachments']
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update an existing Clinical Attachment",
        responses={200: ClinicalAttachmentSerializer},
        tags=['Clinical Attachments']
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Partial update of an existing Clinical Attachment",
        responses={200: ClinicalAttachmentSerializer},
        tags=['Clinical Attachments']
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Delete a Clinical Attachment by ID",
        responses={204: 'No Content'},
        tags=['Clinical Attachments']
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]  # Adjust this as needed (e.g., IsAdminUser, etc.)

    @swagger_auto_schema(
        operation_description="List all Prescriptions",
        responses={200: PrescriptionSerializer(many=True)},
        tags=['Prescriptions']
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Create a new Prescription",
        responses={201: PrescriptionSerializer},
        tags=['Prescriptions']
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retrieve a Prescription by ID",
        responses={200: PrescriptionSerializer},
        tags=['Prescriptions']
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update an existing Prescription",
        responses={200: PrescriptionSerializer},
        tags=['Prescriptions']
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Partial update of an existing Prescription",
        responses={200: PrescriptionSerializer},
        tags=['Prescriptions']
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Delete a Prescription by ID",
        responses={204: 'No Content'},
        tags=['Prescriptions']
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

class TimeOffViewSet(viewsets.ModelViewSet):
    queryset = TimeOff.objects.all()
    serializer_class = TimeOffSerializer
    permission_classes = [IsAuthenticated]  # Adjust this as needed (e.g., IsAdminUser, etc.)

    @swagger_auto_schema(
        operation_description="List all Time Offs",
        responses={200: TimeOffSerializer(many=True)},
        tags=['Time Offs']
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Create a new Time Off",
        responses={201: TimeOffSerializer},
        tags=['Time Offs']
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retrieve a Time Off by ID",
        responses={200: TimeOffSerializer},
        tags=['Time Offs']
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update an existing Time Off",
        responses={200: TimeOffSerializer},
        tags=['Time Offs']
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Partial update of an existing Time Off",
        responses={200: TimeOffSerializer},
        tags=['Time Offs']
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Delete a Time Off by ID",
        responses={204: 'No Content'},
        tags=['Time Offs']
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
