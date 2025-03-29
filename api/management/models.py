from django.db import models
from uuid import uuid1
# Create your models here.


# stsus choices
class AppointmentStatus(models.TextChoices):
    SCHEDULED = 'scheduled'
    CANCELLED = 'cancelled'
    COMPLETED = 'completed'
    IN_PROGRESS = 'in_progress'
    

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True



class Specialization(TimeStampedModel):
    # Unique identifier for scalability
    id = models.UUIDField(primary_key=True, default=uuid1, editable=False)
    
    # Core Fields
    name = models.CharField(max_length=100, unique=True, help_text="Name of the specialization (e.g., Cardiology, Neurology)")
    slug = models.SlugField(max_length=100, unique=True, blank=True, null=True, help_text="SEO-friendly URL for the specialization")
    description = models.TextField(blank=True, null=True, help_text="Detailed description of this specialization")
    
    # Categorization
    department = models.CharField(max_length=100, blank=True, null=True, help_text="Department under which this specialization falls")
    is_surgical = models.BooleanField(default=False, help_text="Does this specialization involve surgery?")
    is_primary_care = models.BooleanField(default=False, help_text="Is this a primary care specialization?")
    
    # Additional Info
    icon = models.ImageField(upload_to='specialization_icons/', blank=True, null=True, help_text="Icon or logo for this specialization")
    qualifications = models.TextField(blank=True, null=True, help_text="Required qualifications for doctors in this specialization")
    average_consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Typical fee for consultation")
    

    is_active = models.BooleanField(default=True, help_text="Is this specialization currently active?")
    
    class Meta:
        verbose_name = "Specialization"
        verbose_name_plural = "Specializations"
        ordering = ['name']  # Sort by name by default
        indexes = [
            models.Index(fields=['name']),  # Index for fast lookups
        ]
    
    def __str__(self):
        return f"{self.name} ({'Surgical' if self.is_surgical else 'Non-Surgical'})"
    
    def save(self, *args, **kwargs):
        # Auto-generate slug if not provided
        if not self.slug:
            self.slug = self.name.lower().replace(' ', '-')
        super().save(*args, **kwargs)
        
class Availability(TimeStampedModel):
    # Unique identifier for scalability
    id = models.UUIDField(primary_key=True, default=uuid1, editable=False)
    
    # Core Fields
    doctor = models.ForeignKey('profiles.Doctor', on_delete=models.CASCADE, help_text="Doctor for whom the availability is set")
    start_time = models.TimeField(help_text="Start time of the availability")
    end_time = models.TimeField(help_text="End time of the availability")
    is_available = models.BooleanField(default=True, help_text="Is this availability currently available?")
    day = models.CharField(max_length=7, help_text="Days of the week for which this availability is set (e.g., 'Mon', 'Tue', 'Wed')")
    
    class Meta:
        verbose_name = "Availability"
        verbose_name_plural = "Availabilities"
        ordering = ['day', 'start_time']
        # Enforce unique availability for a doctor on a given day
        constraints = [
            models.UniqueConstraint(fields=['doctor', 'day'], name='unique_doctor_availability')
        ]
        
    def __str__(self):
        return f"{self.doctor} - {self.day} ({self.start_time} - {self.end_time})"
        

class Appointment(TimeStampedModel):
    # Unique identifier for scalability
    id = models.UUIDField(primary_key=True, default=uuid1, editable=False)
    
    # Core Fields
    patient = models.ForeignKey('profiles.Patient', on_delete=models.CASCADE, help_text="Patient who is scheduled for the appointment")
    doctor = models.ForeignKey('profiles.Doctor', null=True, blank=True, on_delete=models.SET_NULL, help_text="Doctor who is scheduled for the appointment")
    date = models.DateField(help_text="Date of the appointment")
    time = models.TimeField(help_text="Time of the appointment")
    status = models.CharField(max_length=20, choices=AppointmentStatus.choices, default=AppointmentStatus.SCHEDULED, help_text="Status of the appointment")
    
    # Additional Info
    reason = models.TextField(blank=True, null=True, help_text="Reason for the appointment")
    notes = models.TextField(blank=True, null=True, help_text="Additional notes or instructions for the appointment")

    class Meta:
        verbose_name = "Appointment"
        verbose_name_plural = "Appointments"
        ordering = ['date', 'time']
        # Enforce unique appointments for a doctor at a given time
        constraints = [
            models.UniqueConstraint(fields=['doctor', 'date', 'time'], name='unique_doctor_appointment')
        ]
    
    def __str__(self):
        return f"{self.patient.user.username} - {self.doctor.user.username if self.doctor else 'Unassigned'} on {self.date} at {self.time}"


class MedicalRecord(TimeStampedModel):
    # Unique identifier for scalability
    id = models.UUIDField(primary_key=True, default=uuid1, editable=False)
    
    # Core Fields
    patient = models.ForeignKey('profiles.Patient', on_delete=models.CASCADE, help_text="Patient who owns this medical record")
    doctor = models.ForeignKey('profiles.Doctor', on_delete=models.CASCADE, help_text="Doctor who created this medical record")
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, help_text="Appointment associated with this medical record")
    
    # Additional Info
    diagnosis = models.TextField(blank=True, null=True, help_text="Diagnosis provided by the doctor")
    treatment = models.TextField(blank=True, null=True, help_text="Treatment provided by the doctor")
    medication = models.TextField(blank=True, null=True, help_text="Medication prescribed by the doctor")
    follow_up = models.TextField(blank=True, null=True, help_text="Follow-up instructions provided by the doctor")
    
    class Meta:
        verbose_name = "Medical Record"
        verbose_name_plural = "Medical Records"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Medical Record for {self.patient.user.username} - {self.doctor.user.username}"