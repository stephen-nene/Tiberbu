from django.contrib import admin
from .models import Specialization,Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    # Fields to show in the list view
    list_display = ('patient', 'doctor', 'date', 'time', 'created_at')
    # Filters for better navigation
    list_filter = ('date', 'doctor', 'patient')
    # Enable search by patient and doctor names
    search_fields = ('patient__user__username', 'doctor__user__username', 'date')
    # Order by most recent first
    ordering = ('-date', '-time')
    # Make timestamps read-only
    readonly_fields = ('created_at', 'updated_at')
    
    # Group fields logically
    fieldsets = (
        (None, {
            'fields': ('patient', 'doctor', 'date', 'time')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    # Custom action to mark appointments as canceled (example)
    actions = ['mark_appointments_as_canceled']

    def mark_appointments_as_canceled(self, request, queryset):
        queryset.update(status='canceled')
        self.message_user(request, f"{queryset.count()} appointment(s) marked as canceled.")
    mark_appointments_as_canceled.short_description = "Mark selected appointments as canceled"



@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    # Fields to display in the admin list view
    list_display = ('name', 'department', 'is_surgical', 'is_primary_care', 'is_active')
    # Filters for easy navigation
    list_filter = ('is_surgical', 'is_primary_care', 'is_active', 'department')
    # Search functionality
    search_fields = ('name', 'department', 'qualifications')
    # Ordering by name
    ordering = ('name',)
    # Read-only timestamps
    readonly_fields = ('created_at', 'updated_at')
    # Group fields logically
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'description', 'icon')
        }),
        ('Categorization', {
            'fields': ('department', 'is_surgical', 'is_primary_care')
        }),
        ('Additional Information', {
            'fields': ('qualifications', 'average_consultation_fee')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
      
    )

    # Prepopulate slug field based on the name
    prepopulated_fields = {'slug': ('name',)}

