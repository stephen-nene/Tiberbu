from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.core.validators import RegexValidator
from .models import HealthcareUser, Doctor, Patient, ClinicalImage,Gender,UserRole,UserStatus


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = HealthcareUser
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email',
            'phone_number', 'password', 'status', 'role', 'date_of_birth',
            'gender', 'address', 'profile_image', 'mfa_enabled'
        ]

    def create(self, validated_data):
        try:
            validated_data['password'] = make_password(validated_data['password'])
            return super().create(validated_data)
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
    
class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nest user details

    class Meta:
        model = Doctor
        fields = [
            'user', 'license_number', 'specializations', 'medical_license',
            'license_jurisdiction', 'certifications', 'accepting_new_patients',
            'emergency_availability', 'experience', 'bio', 'rating', 'is_available', 'fees'
        ]
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = HealthcareUser.objects.create(**user_data)
        doctor = Doctor.objects.create(user=user, **validated_data)
        return doctor
    
class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Patient
        fields = [
            'user', 'gender', 'medical_history', 'known_allergies',
            'permanent_medications', 'emergency_contacts', 'primary_insurance'
        ]

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = HealthcareUser.objects.create(**user_data)
        patient = Patient.objects.create(user=user, **validated_data)
        return patient

class ClinicalImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicalImage
        fields = [
            'id', 'content_type', 'object_id', 'image', 'caption',
            'clinical_context', 'sensitivity_level', 'access_log'
        ]
