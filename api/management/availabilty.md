# **Doctor Availability System (7-Day Schedule) - Backend Implementation**

Here's how to implement a **7-day availability system** for doctors in Django, including models, views, and serializers.

---

## **1. Enhanced Models**

### **`Availability` Model (Updated)**
```python
# appointments/models.py
from django.db import models
from uuid import uuid4
from django.core.validators import MinValueValidator, MaxValueValidator

class DayOfWeek(models.TextChoices):
    MONDAY = 'Mon', 'Monday'
    TUESDAY = 'Tue', 'Tuesday'
    WEDNESDAY = 'Wed', 'Wednesday'
    THURSDAY = 'Thu', 'Thursday'
    FRIDAY = 'Fri', 'Friday'
    SATURDAY = 'Sat', 'Saturday'
    SUNDAY = 'Sun', 'Sunday'

class Availability(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    doctor = models.ForeignKey('profiles.Doctor', on_delete=models.CASCADE)
    day = models.CharField(
        max_length=3,
        choices=DayOfWeek.choices,
        help_text="Day of the week"
    )
    start_time = models.TimeField(help_text="Format: HH:MM")
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    # Optional: Recurring weekly?
    is_recurring = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['doctor', 'day'],
                name='unique_doctor_day'
            )
        ]
        ordering = ['day', 'start_time']

    def __str__(self):
        return f"{self.doctor} - {self.get_day_display()}: {self.start_time}-{self.end_time}"
```

### **`Doctor` Model (Add Helper Methods)**
```python
# profiles/models.py
class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=100)

    def set_availability(self, day, start_time, end_time, is_available=True):
        """Set availability for a specific day."""
        Availability.objects.update_or_create(
            doctor=self,
            day=day,
            defaults={
                'start_time': start_time,
                'end_time': end_time,
                'is_available': is_available
            }
        )

    def get_weekly_availability(self):
        """Return all availability slots for the week."""
        return self.availability_set.all().order_by('day', 'start_time')
```

---

## **2. API Views**

### **Bulk Availability Set/Clear**
```python
# appointments/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Availability, DayOfWeek
from .serializers import AvailabilitySerializer

class DoctorAvailabilityView(generics.ListCreateAPIView):
    serializer_class = AvailabilitySerializer

    def get_queryset(self):
        doctor_id = self.kwargs['doctor_id']
        return Availability.objects.filter(doctor_id=doctor_id)

    def post(self, request, *args, **kwargs):
        doctor_id = kwargs['doctor_id']
        data = request.data

        # Example payload:
        # {
        #     "availability": [
        #         {"day": "Mon", "start_time": "09:00", "end_time": "17:00"},
        #         {"day": "Tue", "start_time": "08:00", "end_time": "16:00"}
        #     ]
        # }
        created_slots = []
        for slot in data.get('availability', []):
            slot['doctor'] = doctor_id
            serializer = self.get_serializer(data=slot)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            created_slots.append(serializer.data)

        return Response(created_slots, status=status.HTTP_201_CREATED)

class ToggleDayAvailabilityView(generics.UpdateAPIView):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_available = not instance.is_available
        instance.save()
        return Response(self.get_serializer(instance).data)
```

---

## **3. Serializers**
```python
# appointments/serializers.py
from rest_framework import serializers
from .models import Availability

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['id', 'doctor', 'day', 'start_time', 'end_time', 'is_available']
        extra_kwargs = {
            'doctor': {'read_only': True}
        }

    def validate(self, data):
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("End time must be after start time.")
        return data
```

---

## **4. URLs**
```python
# appointments/urls.py
from django.urls import path
from .views import DoctorAvailabilityView, ToggleDayAvailabilityView

urlpatterns = [
    path(
        'doctors/<uuid:doctor_id>/availability/',
        DoctorAvailabilityView.as_view(),
        name='doctor-availability'
    ),
    path(
        'availability/<uuid:pk>/toggle/',
        ToggleDayAvailabilityView.as_view(),
        name='toggle-availability'
    ),
]
```

---

## **5. Key Features**
1. **7-Day Support**:  
   - Uses `DayOfWeek` choices for consistent day formatting.  
2. **Bulk Operations**:  
   - Set multiple days at once via API.  
3. **Atomic Updates**:  
   - `update_or_create()` prevents duplicates.  
4. **Validation**:  
   - Ensures `end_time` > `start_time`.  

---

## **6. Example API Requests**
### **Set Weekly Availability**
```bash
POST /api/doctors/123e4567-e89b-12d3-a456-426614174000/availability/
Headers: {"Authorization": "Bearer <token>"}
Body:
{
    "availability": [
        {"day": "Mon", "start_time": "09:00", "end_time": "17:00"},
        {"day": "Tue", "start_time": "08:00", "end_time": "16:00"}
    ]
}
```

### **Toggle a Day's Availability**
```bash
PATCH /api/availability/123e4567-e89b-12d3-a456-426614174000/toggle/
Headers: {"Authorization": "Bearer <token>"}
```

---

## **7. Testing**
### **Test Cases to Implement**
1. **Model Tests**:  
   - Ensure `UniqueConstraint` prevents duplicate days.  
   - Validate time ranges (`end_time` > `start_time`).  

2. **API Tests**:  
   - Test bulk creation of slots.  
   - Verify role-based access (only doctors can modify their slots).  

3. **Edge Cases**:  
   - Midnight-crossing slots (e.g., `23:00` to `01:00`).  
   - Timezone handling (if applicable).  

---

## **Next Steps**
1. **Add Recurring Slots**:  
   - Use `is_recurring` to mark weekly repeating availability.  
2. **Integrate with Appointments**:  
   - Validate bookings against availability slots.  
3. **Optimize Queries**:  
   - Prefetch availability for calendar views.  

Need help with any of these? 🚀