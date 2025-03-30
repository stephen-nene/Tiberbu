from rest_framework import serializers
from .models import Specialization

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'department',
            'is_surgical',
            'is_primary_care',
            'average_consultation_fee',
            'icd11_code',
            'snomed_ct_id',
            'display_order',
            'is_active',
            # 'created_at',
            # 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']