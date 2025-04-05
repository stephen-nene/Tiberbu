from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Specialization
from .serializers import SpecializationSerializer
from django.shortcuts import get_object_or_404

from profiles.permissions import IsAdminUserCustom


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