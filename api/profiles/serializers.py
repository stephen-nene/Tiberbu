from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.core.validators import RegexValidator
from .models import HealthcareUser, Doctor, Patient, ClinicalImage,Gender,UserRole,UserStatus
from management.serializers import SpecializationSerializer

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
            'gender',
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
            'user', 'gender', 'medical_history', 'known_allergies',
            'permanent_medications', 'emergency_contacts', 'primary_insurance'
        ]



class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    # Optional nested data for patient or doctor info
    patient_profile = serializers.DictField(write_only=True, required=False)
    clinician_profile = serializers.DictField(write_only=True, required=False)
    
    # Read-only fields for retrieval
    # patient = PatientSerializer(read_only=True)
    # doctor = DoctorSerializer(read_only=True)
    profile = serializers.SerializerMethodField()

    class Meta:
        model = HealthcareUser
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email',
            'phone_number', 'password', 'status', 'role', 'date_of_birth',
            'gender', 'address', 'profile_image', 'mfa_enabled', 'patient_profile', 'clinician_profile',
            'profile'  

        ]
           
    def get_profile(self, obj):
        """
        Returns the appropriate profile based on user role
        """
        if obj.role == UserRole.CLINICIAN and hasattr(obj, 'clinician_profile'):
            return DoctorProfileSerializer(obj.clinician_profile).data
        elif obj.role == UserRole.PATIENT and hasattr(obj, 'patient_profile'):
            return PatientProfileSerializer(obj.patient_profile).data
        return None

    def create(self, validated_data):
        try:
            patient_data = validated_data.pop('patient_profile', {})
            doctor_data = validated_data.pop('clinician_profile', {})
            validated_data['password'] = make_password(validated_data['password'])

            # Create user instance without saving yet
            user = HealthcareUser(**validated_data)

            # Attach the role-specific data to be used in signal
            if user.role == UserRole.PATIENT:
                user._profile_data = patient_data
            elif user.role == UserRole.CLINICIAN:
                user._profile_data = doctor_data

            user.save()
            return user
        except Exception as e:
            raise serializers.ValidationError({"error": "Failed to create user", "details": str(e)})

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)

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
    
class ClinicalImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicalImage
        fields = [
            'id', 'content_type', 'object_id', 'image', 'caption',
            'clinical_context', 'sensitivity_level', 'access_log'
        ]
