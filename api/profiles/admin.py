from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import HealthcareUser, Doctor, Patient


# Customizing UserAdmin for HealthcareUser
@admin.register(HealthcareUser)
class HealthcareUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'status', 'date_of_birth', 'mfa_enabled', 'is_active', 'is_staff')
    list_filter = ('role', 'status', 'is_active', 'is_staff', 'date_of_birth')
    search_fields = ('username', 'email', 'phone_number')
    ordering = ('username',)
    fieldsets = (
        (_('Personal Info'), {'fields': ('first_name', 'last_name', 'email', 'phone_number', 'date_of_birth','blood_group', 'gender')}),
        (_('Access Control'), {'fields': ('role', 'status', 'mfa_enabled', 'groups', 'user_permissions')}),
        (_('Security'), {'fields': ('password', 'last_login', 'is_active', 'is_staff', 'is_superuser')}),
        (_('Audit Info'), {'fields': ('terms_accepted_at', 'privacy_policy_version')}),
    )


# Doctor Admin
@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('user', 'license_number', 'license_jurisdiction', 'is_available', 'rating', 'experience')
    list_filter = ('is_available', 'specializations')
    search_fields = ('user__username', 'license_number', 'specializations__name')
    ordering = ('user__username',)
    fieldsets = (
        ('Doctor Info', {'fields': ('user',  'specializations', 'license_number', 'license_jurisdiction', 'medical_license')}),
        ('Practice Details', {'fields': ('experience', 'bio', 'rating', 'fees', 'is_available', 'accepting_new_patients', 'emergency_availability')}),
    )


# Patient Admin
@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('user', 'user__gender')
    search_fields = ('user__username', 'user__email')
    ordering = ('user__username',)
    fieldsets = (
        ('Patient Info', {'fields': ('user', 'user__gender', 'medical_history')}),
        ('Health Data', {'fields': ('known_allergies', 'permanent_medications', 'emergency_contacts', 'primary_insurance')}),
    )


# Clinical Image Admin
# @admin.register(ClinicalImage)
# class ClinicalImageAdmin(admin.ModelAdmin):
#     list_display = ('content_object', 'caption', 'sensitivity_level', 'image')
#     search_fields = ('caption', 'content_object__username')
#     list_filter = ('sensitivity_level',)
#     ordering = ('-id',)
#     fieldsets = (
#         ('Image Details', {'fields': ('content_object', 'image', 'caption', 'clinical_context')}),
#         ('Security', {'fields': ('sensitivity_level', 'access_log')}),
#     )
