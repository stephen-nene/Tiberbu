from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.core.validators import RegexValidator
from .models import HealthcareUser, Doctor, Patient, Gender,UserRole,UserStatus,ProfileImage
from management.serializers import SpecializationSerializer

from django.db import transaction


class ProfileImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = ProfileImage
        fields = ['image', 'thumbnail']
        read_only_fields = ['thumbnail']
        
class DoctorProfileSerializer(serializers.ModelSerializer):
    # specializations = serializers.StringRelatedField(many=True)
    specializations = SpecializationSerializer(many=True, read_only=True)

    class Meta:
        model = Doctor
        fields = [
            'license_number',
            'specializations',
            'medical_license',
            'license_jurisdiction',
            'certifications',
            'accepting_new_patients',
            'emergency_availability',
            'experience',
            'bio',
            'rating',
            'is_available',
            'fees'
        ]

class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            
            'medical_history',
            'known_allergies',
            'permanent_medications',
            'emergency_contacts',
            'primary_insurance'
        ]
        

class DoctorSerializer(serializers.ModelSerializer):
    specializations = SpecializationSerializer(many=True, read_only=True)

    class Meta:
        model = Doctor
        fields = [
            'user', 'license_number', 'specializations', 'medical_license',
            'license_jurisdiction', 'certifications', 'accepting_new_patients',
            'emergency_availability', 'experience', 'bio', 'rating', 'is_available', 'fees'
        ]
    

    
class PatientSerializer(serializers.ModelSerializer):


    class Meta:
        model = Patient
        fields = [
            'user',  'medical_history', 'known_allergies',
            'permanent_medications', 'emergency_contacts', 'primary_insurance'
        ]



class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        min_length=8,
        required=True,  # Explicitly mark as required
        style={'input_type': 'password'}  # For browsable API
    )
    # email = serializers.EmailField(required=True)
    # username = serializers.CharField(required=True)
    # Optional nested data for patient or doctor info
    patient_profile = serializers.DictField(write_only=True, required=False)
    clinician_profile = serializers.DictField(write_only=True, required=False)
    
    # Read-only fields for retrieval
    # patient = PatientSerializer(read_only=True)
    # doctor = DoctorSerializer(read_only=True)
    profile_image = ProfileImageSerializer(required=False)
    profile = serializers.SerializerMethodField()

    class Meta:
        model = HealthcareUser
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email',
            'phone_number', 'password', 'status', 'role', 'date_of_birth',
            'gender', 'address', 'profile_image', 'mfa_enabled', 
            'patient_profile', 'clinician_profile', 'profile'
        ]
    def create(self, validated_data):
        # This will be called by perform_create
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
      
    def get_profile(self, obj):
        """
        Returns the appropriate profile based on user role
        """
        if obj.role == UserRole.CLINICIAN and hasattr(obj, 'clinician_profile'):
            return DoctorProfileSerializer(obj.clinician_profile).data
        elif obj.role == UserRole.PATIENT and hasattr(obj, 'patient_profile'):
            return PatientProfileSerializer(obj.patient_profile).data
        return None

    def validate_phone_number(self, value):
        phone_validator = RegexValidator(
            regex=r'^\+?1?\d{9,15}$',
            message="Phone number must be in international format: +[country code][number]."
        )
        phone_validator(value)
        return value

    def validate_role(self, value):
        allowed_roles = [choice[0] for choice in UserRole.choices]
        if value not in allowed_roles:
            raise serializers.ValidationError(f"Invalid role. Choose from: {', '.join(allowed_roles)}")
        return value

    def validate_status(self, value):
        allowed_statuses = [choice[0] for choice in UserStatus.choices]
        if value not in allowed_statuses:
            raise serializers.ValidationError(f"Invalid status. Choose from: {', '.join(allowed_statuses)}")
        return value

    def validate_gender(self, value):
        allowed_genders = [choice[0] for choice in Gender.choices]
        if value not in allowed_genders:
            raise serializers.ValidationError(f"Invalid gender. Choose from: {', '.join(allowed_genders)}")
        return value
    
    
     
# class ClinicalImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ClinicalImage
#         fields = [
#             'id', 'content_type', 'object_id', 'image', 'caption',
#             'clinical_context', 'sensitivity_level', 'access_log'
#         ]

