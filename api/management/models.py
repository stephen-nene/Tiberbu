from django.db import models
from uuid import uuid4
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from django.utils import timezone
# import date
from datetime import date


# Enums 
class ClinicalDocumentType(models.TextChoices):
    LAB_REPORT = 'lab_report', 'Lab Report'
    XRAY = 'xray', 'X-Ray'
    PRESCRIPTION = 'prescription', 'Prescription'
    REPORT = 'report', 'Report'
    IMAGE = 'image', 'Image'
    OTHER = 'other', 'Other'


class AppointmentStatus(models.TextChoices):
    SCHEDULED = 'scheduled', 'Scheduled'
    CANCELLED = 'cancelled', 'Cancelled'
    COMPLETED = 'completed', 'Completed'
    IN_PROGRESS = 'in_progress', 'In Progress'


class WeekDay(models.IntegerChoices):
    MONDAY = 0, 'Monday'
    TUESDAY = 1, 'Tuesday'
    WEDNESDAY = 2, 'Wednesday'
    THURSDAY = 3, 'Thursday'
    FRIDAY = 4, 'Friday'
    SATURDAY = 5, 'Saturday'
    SUNDAY = 6, 'Sunday'


# Base Models for Code Reusability
class BaseUUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)

    class Meta:
        abstract = True


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Specialization(BaseUUIDModel, TimeStampedModel):
    name = models.CharField(max_length=100, unique=True, help_text="Name of the specialization (e.g., Cardiology, Neurology)")
    slug = models.SlugField(max_length=100, unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    is_surgical = models.BooleanField(default=False)
    is_primary_care = models.BooleanField(default=False)
    icon = models.ImageField(upload_to='specialization_icons/', blank=True, null=True)
    qualifications = models.TextField(blank=True, null=True)
    average_consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    icd11_code = models.CharField(max_length=10, blank=True, null=True)
    snomed_ct_id = models.CharField(max_length=10, blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Clinical Specialty"
        verbose_name_plural = "Clinical Specialties"
        indexes = [models.Index(fields=['display_order', 'name'])]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if self.display_order == 0:  # or: if not self.display_order
            max_order = Specialization.objects.aggregate(models.Max("display_order"))["display_order__max"] or 0
            self.display_order = max_order + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({'Surgical' if self.is_surgical else 'Non-Surgical'})"


class Availability(BaseUUIDModel, TimeStampedModel):
    doctor = models.ForeignKey('profiles.Doctor', on_delete=models.PROTECT, related_name='availability_slots')
    weekday = models.PositiveSmallIntegerField(choices=WeekDay.choices)
    # JSON structure: [{ "start": "09:00", "end": "10:00" }, { "start": "11:00", "end": "12:00" }]
    # time_slots = models.JSONField(default=list)    
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_recurring = models.BooleanField(default=True)
    is_available = models.BooleanField(default=True)
    override_reason = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Clinician Availability"
        verbose_name_plural = "Clinician Availabilities"
        constraints = [
            models.UniqueConstraint(fields=['doctor', 'weekday', 'start_time', 'end_time'], name='unique_doctor_time_slot'),
            models.CheckConstraint(check=models.Q(end_time__gt=models.F('start_time')), name='end_time_after_start_time')
        ]
        ordering = ['weekday', 'start_time']

    def __str__(self):
        return f"{self.doctor} | {self.get_weekday_display()} {self.start_time}-{self.end_time}"


class Appointment(BaseUUIDModel, TimeStampedModel):
    patient = models.ForeignKey('profiles.Patient', on_delete=models.CASCADE)
    doctor = models.ForeignKey('profiles.Doctor', null=True, blank=True, on_delete=models.SET_NULL)
    start_time = models.TimeField(null=False, blank=False)
    end_time = models.TimeField(null=False, blank=False,)
    # scheduled_date = models.DateField(null=False, blank=False, validators=[MinValueValidator(date.today())])
    scheduled_date = models.DateTimeField(null=False, blank=False, validators=[MinValueValidator(timezone.now)])
    is_admin_override = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=AppointmentStatus.choices, default=AppointmentStatus.SCHEDULED)
    chief_complaint = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    priority = models.PositiveSmallIntegerField(default=3, validators=[MinValueValidator(1), MaxValueValidator(5)])

    class Meta:
        verbose_name = "Clinical Appointment"
        verbose_name_plural = "Clinical Appointments"
        constraints = [
            models.UniqueConstraint(fields=['doctor', 'scheduled_date'], name='unique_doctor_appointment_time',
                                    condition=models.Q(status=AppointmentStatus.SCHEDULED))
        ]
        indexes = [models.Index(fields=['scheduled_date', '-priority'])]
        
    def __str__(self):
        return f"{self.patient.user.username} - {self.doctor.user.username if self.doctor else 'Unassigned'} on {self.scheduled_time} ({self.get_status_display()})"


class TimeOff(BaseUUIDModel, TimeStampedModel):
    doctor = models.ForeignKey('profiles.Doctor', on_delete=models.PROTECT)
    start_datetime = models.DateTimeField(null=False, blank=False, validators=[MinValueValidator(date.today())])
    end_datetime = models.DateTimeField(null=False, blank=False, validators=[MinValueValidator(date.today())])
    reason = models.TextField(blank=True, null=True)
    is_approved = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Time Off"
        verbose_name_plural = "Time Offs"
    def __str__(self):
        return f"{self.doctor.user.get_full_name()} off from {self.start_datetime} to {self.end_datetime}"
    
class ClinicalAttachment(BaseUUIDModel, TimeStampedModel):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    content_object = GenericForeignKey()
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name='records')
    file = models.FileField(upload_to="clinical_attachments/",
                            validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg', 'dcm'])])
    document_type = models.CharField(max_length=50, choices=ClinicalDocumentType.choices)
    caption = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_sensitive = models.BooleanField(default=False)
    access_audit = models.JSONField(default=dict)

    class Meta:
        verbose_name = "Clinical Document"
        verbose_name_plural = "Clinical Documents"
        indexes = [models.Index(fields=['content_type', 'object_id'])]

    def __str__(self):
        return f"{self.document_type} for {self.content_object} - {self.caption or 'No Caption'}"

class Prescription(models.Model):
    """Prescriptions linked to medical records"""
    medical_record = models.OneToOneField(ClinicalAttachment, on_delete=models.CASCADE, related_name='prescription')
    issued_by = models.ForeignKey('profiles.Doctor', on_delete=models.SET_NULL, null=True, blank=True)
    medication_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    refills_remaining = models.PositiveIntegerField(default=0)
    instructions = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.medication_name} for {self.medical_record.appointment.patient.user.get_full_name()}"
