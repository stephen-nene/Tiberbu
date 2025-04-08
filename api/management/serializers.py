from rest_framework import serializers
from .models import Specialization,Availability, WeekDay,Appointment,ClinicalAttachment,Prescription,TimeOff
from profiles.models import Doctor,Patient,HealthcareUser
# from profiles.serializers import DoctorSerializer
# from profiles.serializers import DoctorSerializer
class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = [
            'id',
            'name',
            'slug',
            # 'doctor',
            # 'doctor_detail',
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
    
class UserSerializerViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthcareUser
        fields = ['id','username','email']
        
class ShortSpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = [
            'name',
            'description',
            'department',
            # 'is_surgical',
            # 'is_primary_care',
            'average_consultation_fee',
            'is_active',
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']
        
class DoctorSerializer(serializers.ModelSerializer):
    specializations = ShortSpecializationSerializer(many=True, read_only=True)
    user = UserSerializerViewSerializer(read_only=True)
    class Meta:
        model = Doctor
        fields = [
            'user','license_number', 'specializations', 'medical_license', 'license_jurisdiction', 'certifications', 'accepting_new_patients', 'emergency_availability', 'experience', 'bio', 'rating', 'is_available', 'fees'
        ]


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializerViewSerializer(read_only=True)

    class Meta:
        model = Patient
        fields = [
            'user',  'medical_history', 'known_allergies',
            'permanent_medications', 'emergency_contacts', 'primary_insurance'
        ]

class AvailabilitySerializer(serializers.ModelSerializer):
    doctor = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())  # This will be a FK to Doctor model
    doctor_detail = DoctorSerializer(source='doctor', read_only=True)
    weekday = serializers.ChoiceField(choices=WeekDay.choices)  # If WeekDay is a tuple of choices
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    is_recurring = serializers.BooleanField(default=True)
    is_available = serializers.BooleanField(default=True)
    override_reason = serializers.CharField(allow_blank=True, required=False)
    class Meta:
        model = Availability
        fields = [
            'id',
            'doctor',
            'doctor_detail',
            'weekday',
            'start_time',
            'end_time',
            'is_available',
            'is_recurring',
            'override_reason',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at','doctor_detail', 'updated_at']
        

    
    def validate(self, data):
                # Custom validation if needed (e.g., for overlapping time slots)
        # Add validation logic here if necessary.
        # Ensure that end_time is after start_time
        if data['end_time'] <= data['start_time']:
            raise serializers.ValidationError('End time must be after start time.')
        return data
    
class AppointmentSerializer(serializers.ModelSerializer):
    doctor = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())
    doctor_detail = DoctorSerializer(source='doctor', read_only=True)
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())
    patient_detail = PatientSerializer(source='patient', read_only=True)
    class Meta:
        model = Appointment
        fields = [
            'id',
            'doctor',
            'patient',
            'doctor_detail',
            'patient_detail',
            'is_admin_override',
            'scheduled_date',
            'start_time',
            'end_time',
            'chief_complaint',
            'status',
            'notes',
            'priority'
        ]
        read_only_fields = ['created_at', 'updated_at']
        

# class ClinicalAttachmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ClinicalAttachment
#         fields = [
#             'id',
#             'appointment',
#             'file',
#             'description',
#             'created_at',
#             'updated_at'
#         ]
#         read_only_fields = ['created_at', 'updated_at']
class ClinicalAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicalAttachment
        fields = '__all__'  # Serialize all fields in the model

    def validate(self, attrs):
        # You can add custom validation logic here if needed
        return attrs
    
    