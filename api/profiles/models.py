from django.db import models



from django.contrib.auth.models import AbstractUser, Group, Permission
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.validators import RegexValidator, FileExtensionValidator
from django.core.exceptions import ValidationError
import pgcrypto
from uuid import uuid4, uuid1
from management.models import Specialization


# Enums ------------------------------------------------------------------------
class UserRole(models.TextChoices):
    SYSTEM_ADMIN = 'system_admin', 'System Administrator'
    CLINICIAN = 'clinician', 'Licensed Clinician'
    PATIENT = 'patient', 'Patient'
    NURSE = 'nurse', 'Registered Nurse'
    SUPPORT_STAFF = 'support', 'Support Staff'

class UserStatus(models.TextChoices):
    ACTIVE = 'active', 'Active'
    PENDING_VERIFICATION = 'pending', 'Pending Verification'
    SUSPENDED = 'suspended', 'Suspended'
    ARCHIVED = 'archived', 'Archived'

class BloodGroup(models.TextChoices):
    A_POS = 'A+', 'A+'
    A_NEG = 'A-', 'A-'
    B_POS = 'B+', 'B+'
    B_NEG = 'B-', 'B-'
    AB_POS = 'AB+', 'AB+'
    AB_NEG = 'AB-', 'AB-'
    O_POS = 'O+', 'O+'
    O_NEG = 'O-', 'O-'

class Gender(models.TextChoices):
    MALE = 'male', 'Male'
    FEMALE = 'female', 'Female'
    NON_BINARY = 'non_binary', 'Non-binary'
    UNDISCLOSED = 'undisclosed', 'Prefer not to say'


# Helper Models ----------------------------------------------------------------
class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True  


def user_directory_path(instance, filename):
    model_name = instance.content_type.model
    user = getattr(instance.content_object, 'user', None)
    username = user.username if user else 'anonymous'
    ext = filename.split('.')[-1]
    unique_filename = f"{uuid1()}.{ext}"
    return f"uploads/{model_name}/{username}/{unique_filename}"       


def validate_image_size(image):
    max_size_kb = 5120  # 5MB limit
    if image.size > max_size_kb * 1024:
        raise ValidationError(f"Image size exceeds {max_size_kb} KB.")


# Main Models -------------------------------------------------------------------
class HealthcareUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.PATIENT, db_index=True)
    status = models.CharField(max_length=20, choices=UserStatus.choices, default=UserStatus.PENDING_VERIFICATION, db_index=True)
    blood_group = models.CharField(max_length=3, choices=BloodGroup.choices, blank=True)

    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=Gender.choices, default=Gender.UNDISCLOSED)

    address = models.JSONField(null=True, blank=True)
    profile_image = models.ForeignKey('ProfileImage', null=True, blank=True, on_delete=models.SET_NULL,related_name="user_profile_image")
    
    email = models.EmailField(max_length=255, unique=True, db_index=True)
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$')],
        help_text="International format: +[country code][number]"
    )   

    terms_accepted_at = models.DateTimeField(null=True, blank=True)
    privacy_policy_version = models.CharField(max_length=20, blank=True)

    mfa_enabled = models.BooleanField(default=False)
    token = models.CharField(max_length=255, null=True, blank=True, db_index=True)

    groups = models.ManyToManyField(Group, related_name="users", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="user_permissions", blank=True)

    class Meta:
        verbose_name = "Healthcare User"
        verbose_name_plural = "Healthcare Users"
        indexes = [
            models.Index(fields=['username', 'email']),
            models.Index(fields=['role']),
            models.Index(fields=['status']),
            models.Index(fields=['date_of_birth', 'gender']),
        ]
        permissions = [
            ('view_full_profile', "Can view complete user profile"),
            ('emergency_access', "Has emergency access privileges")
        ]

    def __str__(self):
        return f"{self.get_full_name()} - {self.username} - {self.role}"


class Doctor(TimeStampedModel):
    user = models.OneToOneField(HealthcareUser, on_delete=models.CASCADE, primary_key=True, related_name='clinician_profile')
    # gender = models.CharField(max_length=20, choices=Gender.choices, null=True, blank=True)
    license_number = models.CharField(max_length=255, unique=True, db_index=True)
    
    specializations = models.ManyToManyField(Specialization, related_name="doctors")

    medical_license = pgcrypto.EncryptedCharField(max_length=50, help_text="Encrypted medical license number")
    license_jurisdiction = models.CharField(max_length=100, help_text="Issuing authority for medical license")
    certifications = models.JSONField(default=dict, help_text="Board certifications and qualifications")

    accepting_new_patients = models.BooleanField(default=True)
    emergency_availability = models.BooleanField(default=False)

    experience = models.PositiveIntegerField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    is_available = models.BooleanField(default=True, db_index=True)
    fees = models.PositiveIntegerField(null=True, blank=True)
    
            # Clinical settings
    # default_facility = models.ForeignKey(
    #     'Facility',
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True
    # )

    class Meta:
        verbose_name = "Clinician Profile"
        verbose_name_plural = "Clinician Profiles"
        constraints = [
            models.UniqueConstraint(fields=['medical_license', 'license_jurisdiction'], name='unique_medical_license')
        ]

    def __str__(self):
        return f"Dr. {self.user.username} - {self.specializations.first()}"


class Patient(TimeStampedModel):
    user = models.OneToOneField(HealthcareUser, on_delete=models.CASCADE, primary_key=True, related_name='patient_profile')
    # gender = models.CharField(max_length=20, choices=Gender.choices, null=True, blank=True)

    medical_history = models.TextField(null=True, blank=True)
    known_allergies = models.JSONField(default=list, help_text="List of known allergies and reactions")
    permanent_medications = models.JSONField(default=list, help_text="Long-term medication regimen")
    emergency_contacts = models.JSONField(default=list, help_text="Emergency contacts")

    primary_insurance = pgcrypto.EncryptedTextField(null=True, blank=True, help_text="Encrypted insurance policy details")

    class Meta:
        verbose_name = "Patient Health Profile"
        verbose_name_plural = "Patient Health Profiles"

    def __str__(self):
        return f"Patient: {self.user.username}"


# class ClinicalImage(models.Model):
#     content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
#     object_id = models.UUIDField()
#     content_object = GenericForeignKey('content_type', 'object_id')
    
#     image = models.ImageField(
#         upload_to='clinical_images/%Y/%m/',
#         validators=[FileExtensionValidator(allowed_extensions=['jpg', 'png', 'dcm']), validate_image_size]
#     )
#     caption = models.CharField(max_length=255, blank=True)
#     clinical_context = models.TextField(blank=True)

#     sensitivity_level = models.PositiveSmallIntegerField(
#         choices=[(1, 'Public'), (2, 'Internal'), (3, 'Restricted')],
#         default=2
#     )
#     access_log = models.JSONField(default=list)

#     class Meta:
#         verbose_name = "Clinical Image"
#         verbose_name_plural = "Clinical Images"
#         indexes = [models.Index(fields=['content_type', 'object_id'])]

#     def __str__(self):
#         return f"Image for {self.content_object} - {self.caption or 'No Caption'}"


# models.py
class ProfileImage(models.Model):
    """
    Dedicated model for user profile pictures (avatars)
    Simplified compared to clinical images
    """
    # user = models.OneToOneField(
    #     HealthcareUser, 
    #     on_delete=models.CASCADE,
    #     related_name='profile_image_rel'  # Different from clinical images
    # )
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    image = models.ImageField(
        upload_to='profile_images/%Y/%m/',
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),
            validate_image_size
        ]
    )
    thumbnail = models.ImageField(upload_to='profile_thumbs/%Y/%m/', blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profile Image"
        verbose_name_plural = "Profile Images"

    def __str__(self):
        return f"Profile image for {self.user.username}"

    def save(self, *args, **kwargs):
        # Add thumbnail generation logic here if needed
        super().save(*args, **kwargs)