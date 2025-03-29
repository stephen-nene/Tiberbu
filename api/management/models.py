from django.db import models
from uuid import uuid1
# Create your models here.


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