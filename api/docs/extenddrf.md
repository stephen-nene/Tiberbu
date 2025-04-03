Yes! You can **extend DRF ViewSets** in multiple ways to include custom logic, validations, and related data. Let’s go through some key extensions:

---

## **1. Adding Custom Validation Before Creating a Record**
If you need to perform additional checks before saving an object, override the `perform_create` method.

### **Example: Ensure only one profile per user**
```python
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import User, DoctorProfile
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """
        Check if the user already has a profile before creating.
        """
        role = self.request.data.get("role")
        user = serializer.save()  # Save the user first

        if role == "doctor":
            if DoctorProfile.objects.filter(user=user).exists():
                return Response(
                    {"error": "Doctor profile already exists for this user."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            DoctorProfile.objects.create(user=user, specialization="General")

        # Additional checks can be done here for other roles.
```
Now, if a user already has a profile, it prevents duplicate profile creation.

---

## **2. Including Related Data in the Response**
Django serializers allow **nested serialization** to include related data.

### **Example: User with Related Profile Data**
Modify the serializer to fetch profile data dynamically.

```python
from rest_framework import serializers
from .models import User, DoctorProfile, PatientProfile, StaffProfile, AdminProfile

class UserSerializer(serializers.ModelSerializer):
    profile_data = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'profile_data']

    def get_profile_data(self, obj):
        """
        Dynamically fetch related profile based on user role.
        """
        if obj.role == "doctor" and hasattr(obj, "doctor_profile"):
            return {"specialization": obj.doctor_profile.specialization}
        elif obj.role == "patient" and hasattr(obj, "patient_profile"):
            return {"medical_history": obj.patient_profile.medical_history}
        elif obj.role == "staff" and hasattr(obj, "staff_profile"):
            return {"department": obj.staff_profile.department}
        elif obj.role == "admin" and hasattr(obj, "admin_profile"):
            return {"permissions": obj.admin_profile.permissions}
        return None
```
Now, when you retrieve a user, you get related profile data dynamically.

**Example Response**
```json
{
    "id": 1,
    "username": "doctor1",
    "role": "doctor",
    "profile_data": {
        "specialization": "Cardiology"
    }
}
```

---

## **3. Custom Actions in ViewSet**
You can define custom endpoints within ViewSets using the `@action` decorator.

### **Example: Get Users by Role**
```python
from rest_framework.decorators import action
from rest_framework.response import Response

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='by-role/(?P<role>\w+)')
    def get_users_by_role(self, request, role=None):
        """
        Custom endpoint to filter users by role.
        """
        users = self.queryset.filter(role=role)
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
```
**Now, you can filter users by role using:**
```
GET /users/by-role/doctor/
```
This will return only users with the role of **doctor**.

---

## **4. Overriding `get_queryset` for Custom Filtering**
Instead of filtering in the frontend, you can override `get_queryset`.

### **Example: Filter Users to Show Only Active Ones**
```python
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Only return active users.
        """
        return User.objects.filter(is_active=True)
```
This automatically filters users, **only showing active ones**.

---

## **5. Performing Extra Validation on Updates**
If you want to add extra checks when updating a user, override `perform_update`.

### **Example: Prevent Role Change for Doctors**
```python
def perform_update(self, serializer):
    user = self.get_object()
    new_role = self.request.data.get("role")

    if user.role == "doctor" and new_role != "doctor":
        return Response({"error": "Doctors cannot change their role."}, status=status.HTTP_400_BAD_REQUEST)

    serializer.save()
```
Now, if someone tries to change a **doctor's role**, they’ll get an error.

---

## **6. Using `prefetch_related` and `select_related` for Query Optimization**
For efficient database queries, use **`select_related`** (OneToOne & ForeignKey) and **`prefetch_related`** (ManyToMany).

```python
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Optimize queries by prefetching related data.
        """
        return User.objects.select_related('doctor_profile', 'patient_profile', 'staff_profile', 'admin_profile')
```
Now, Django fetches all related profile data in **one query**, improving performance.

---

## **Final Thoughts**
### ✅ **What You Can Extend in DRF**
- **Add custom validation** before saving (`perform_create`, `perform_update`).
- **Include related data** using `SerializerMethodField`.
- **Add custom endpoints** using `@action` decorator.
- **Optimize queries** with `select_related` and `prefetch_related`.
- **Filter records dynamically** by overriding `get_queryset`.

Would you like me to extend this further, e.g., authentication handling with JWT, permission-based views, or anything specific?