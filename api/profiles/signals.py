
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import HealthcareUser, Doctor, Patient, UserRole, UserStatus


# Signals ----------------------------------------------------------------------

@receiver(post_save, sender=HealthcareUser)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Automatically creates role-specific profile when a new user is created.
    Also updates the user's status to active if they're a clinician or admin.
    """
    if not created:
        return
    
    try:
        profile_data = getattr(instance, '_profile_data', None)

        if instance.role == UserRole.CLINICIAN and profile_data:
            specializations = profile_data.pop('specializations', [])  # Safe pop
            
            doc = Doctor.objects.create(
                user=instance,
                **{k:v for k,v in profile_data.items() if k != 'specializations'}
            )
            doc.specializations.set([s['id'] for s in specializations])
            instance.status = UserStatus.PENDING_VERIFICATION
            instance.save()
            
        elif instance.role == UserRole.PATIENT and profile_data:
            Patient.objects.create(user=instance, **profile_data)
            
        elif instance.role == UserRole.SYSTEM_ADMIN:
            # Admins might need special handling
            # instance.status = UserStatus.ACTIVE
            # instance.is_staff = True
            # instance.is_superuser = True
            # instance.save()
            pass
            
            
        elif instance.role == UserRole.NURSE:
            # Create nurse profile if you have a Nurse model
            pass
            
        elif instance.role == UserRole.SUPPORT_STAFF:
            # Create support staff profile if needed
            pass
            
    except Exception as e:
        instance.delete()
        print(f"Error creating user profile: {e}")
        raise

@receiver(post_save, sender=HealthcareUser)
def save_user_profile(sender, instance, **kwargs):
    """
    Ensures the profile is saved when the user is saved.
    """
    if hasattr(instance, 'clinician_profile'):
        instance.clinician_profile.save()
    if hasattr(instance, 'patient_profile'):
        instance.patient_profile.save()