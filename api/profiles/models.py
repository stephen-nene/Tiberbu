from django.db import models

# Create your models here.
class UserRole(models.TextChoices):
    ADMIN = 'admin', 'Admin'
    USER = 'user', 'User'

class UserStatus(models.TextChoices):
    ACTIVE = 'active', 'Active'
    INACTIVE = 'inactive', 'Inactive'
    DEACTIVATED = 'deactivated', 'Deactivated'

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True  