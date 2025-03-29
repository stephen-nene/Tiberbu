from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission, AbstractBaseUser

from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from uuid import uuid4, uuid1

from management.models import Specialization

# Create your models here.
class UserRole(models.TextChoices):
    ADMIN = 'admin', 'Admin'
    DOCTOR = 'doctor', 'Doctor'
    PATIENT = 'patient', 'Patient'
    NURSE = 'nurse', 'Nurse'
    USER = 'user', 'User'

class UserStatus(models.TextChoices):
    ACTIVE = 'active', 'Active'
    INACTIVE = 'inactive', 'Inactive'
    DEACTIVATED = 'deactivated', 'Deactivated'
    
class BloodGroup(models.TextChoices):
    A_POSITIVE = 'A_POSITIVE', 'A+'
    A_NEGATIVE = 'A_NEGATIVE', 'A-'
    B_POSITIVE = 'B_POSITIVE', 'B+'
    B_NEGATIVE = 'B_NEGATIVE', 'B-'
    AB_POSITIVE = 'AB_POSITIVE', 'AB+'
    AB_NEGATIVE = 'AB_NEGATIVE', 'AB-'
    O_POSITIVE = 'O_POSITIVE', 'O+'
    O_NEGATIVE = 'O_NEGATIVE', 'O-'
    
class Gender(models.TextChoices):
    MALE = 'male', 'Male'
    FEMALE = 'female', 'Female'
    OTHER = 'other', 'Other'

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True  
        

class User(AbstractUser):
    role = models.CharField(max_length=20, choices=UserRole.choices, default='user', db_index=True)
    status = models.CharField(max_length=255, choices=UserStatus.choices, default='inactive', db_index=True)
    # profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    address = models.JSONField(null=True, blank=True)
    profile_image = models.ForeignKey('Image', null=True, blank=True, on_delete=models.SET_NULL)
    email = models.EmailField(max_length=255, blank=False, unique=True, db_index=True)
    phone_number = models.CharField(blank=True, null=True, max_length=12, unique=True, db_index=True)
    token = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    # Fix reverse accessor conflicts
    groups = models.ManyToManyField(Group, related_name="tracker_users", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="tracker_user_permissions", blank=True)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['email']),  
            models.Index(fields=['role']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.username} - {self.role}"
    
    def get_primary_specialization(self):
        return self.specialization.first().name if self.specialization.exists() else "General"

    def __repr__(self):
        return f"<User: {self.username} - {self.role}>"
    
class Doctor(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    gender = models.CharField(max_length=20, choices=Gender.choices, null=True, blank=True)
    license_number = models.CharField(max_length=255, unique=True, db_index=True)
    specialization = models.ManyToManyField(Specialization, related_name="doctors")
    experience = models.PositiveIntegerField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    is_available = models.BooleanField(default=True, db_index=True)
    fees = models.PositiveIntegerField(null=True, blank=True)
    # Add more doctor-specific fields 
    
    class Meta:
        verbose_name = "Doctor"
        verbose_name_plural = "Doctors"
        indexes = [
            models.Index(fields=['license_number']),
        ]

    def __str__(self):
        return f"Dr. {self.user.username} - {self.specialization}"
    
class Patient(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=Gender.choices, null=True, blank=True)
    emergency_contact = models.CharField(max_length=15, null=True, blank=True)
    blood_group = models.CharField(max_length=20, choices=BloodGroup.choices, null=True, blank=True)
    medical_history = models.TextField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Patient"
        verbose_name_plural = "Patients"

    def __str__(self):
        return f"Patient: {self.user.username}"
    
    
    
    
def user_directory_path(instance, filename):
    # Handle model type and user dynamically
    model_name = instance.content_type.model
    user = getattr(instance.content_object, 'user', None)
    username = user.username if user else 'anonymous'

    # Generate unique file name
    ext = filename.split('.')[-1]
    unique_filename = f"{uuid1()}.{ext}"

    return f"uploads/{model_name}/{username}/{unique_filename}"

class Image(TimeStampedModel):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    image = models.ImageField(upload_to=user_directory_path)  # Dynamic upload path
    caption = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True, help_text="Description of the image")
    
    
    def __str__(self):
        return f"Image for {self.content_object} - {self.caption or 'No Caption'}"

    def __repr__(self):
        return f"<Image: {self.content_object} - {self.caption or 'No Caption'}>"
