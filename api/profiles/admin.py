from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Doctor, Patient, Image

# Customize the UserAdmin
@admin.register(User)
class UserAdmin(UserAdmin):
    # Define the fields to be displayed in the admin list view
    list_display = ('username', 'email', 'role', 'status', 'is_active')
    list_filter = ('role', 'status', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'phone_number')
    ordering = ('-date_joined',)
    readonly_fields = ('last_login', 'date_joined', 'token')

    # Define fieldsets for grouping related fields
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password', 'profile_image')}),
        ('Personal Info', {'fields': ('phone_number', 'address')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Status & Role', {'fields': ('role', 'status', 'token')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )


# Admin for Doctor
@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('user', 'license_number', 'is_available', 'experience', 'fees')
    list_filter = ('is_available', 'gender', 'specialization')
    search_fields = ('user__username', 'license_number', 'specialization__name')
    autocomplete_fields = ('specialization',)
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {'fields': ('user', 'license_number', 'gender', 'bio', 'rating', 'fees', 'experience')}),
        ('Specialization', {'fields': ('specialization',)}),
        ('Availability', {'fields': ('is_available',)}),
        # ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


# Admin for Patient
@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('user', 'date_of_birth', 'gender', 'blood_group')
    list_filter = ('gender', 'blood_group')
    search_fields = ('user__username', 'emergency_contact', 'medical_history')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {'fields': ('user', 'date_of_birth', 'gender', 'blood_group')}),
        ('Contact & History', {'fields': ('emergency_contact', 'medical_history')}),
        # ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


# Admin for Image
@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('content_object', 'caption', 'created_at')
    list_filter = ('content_type',)
    search_fields = ('caption', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {'fields': ('content_type', 'object_id', 'content_object', 'image')}),
        ('Details', {'fields': ('caption', 'description')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
