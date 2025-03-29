from django.contrib import admin
from .models import Specialization


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

