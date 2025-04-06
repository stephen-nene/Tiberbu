from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Specialization, Availability, Appointment, ClinicalAttachment
)


@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    list_display = ('name', 'department', 'is_surgical', 'is_active', 'display_order')
    list_filter = ('is_surgical', 'is_primary_care', 'department', 'is_active')
    search_fields = ('name', 'department', 'icd11_code', 'snomed_ct_id')
    ordering = ('display_order', 'name')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('is_active', 'display_order')
    readonly_fields = ('created_at', 'updated_at')

    def get_queryset(self, request):
        return super().get_queryset(request).select_related()


@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'weekday', 'start_time', 'end_time', 'is_available')
    list_filter = ('weekday', 'is_available', 'is_recurring')
    search_fields = ('doctor__user__username', 'doctor__user__first_name', 'doctor__user__last_name')
    ordering = ('weekday', 'start_time')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'scheduled_date', 'status', 'priority')
    list_filter = ('status', 'priority', 'scheduled_date')
    search_fields = ('patient__user__username', 'doctor__user__username', 'chief_complaint')
    ordering = ('-scheduled_date', 'priority')
    readonly_fields = ('created_at', 'updated_at')

    actions = ['mark_completed', 'mark_cancelled']

    def mark_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f"{updated} appointments marked as completed.")
    mark_completed.short_description = "Mark selected appointments as completed"

    def mark_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f"{updated} appointments cancelled.")
    mark_cancelled.short_description = "Cancel selected appointments"


@admin.register(ClinicalAttachment)
class ClinicalAttachmentAdmin(admin.ModelAdmin):
    list_display = ('document_type', 'caption', 'content_object', 'is_sensitive', 'preview_file')
    list_filter = ('document_type', 'is_sensitive')
    search_fields = ('caption', 'description', 'document_type')
    readonly_fields = ('created_at', 'updated_at')

    def preview_file(self, obj):
        if obj.file:
            return format_html('<a href="{}" target="_blank">View File</a>', obj.file.url)
        return "No file"
    preview_file.short_description = "Preview"
