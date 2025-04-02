## **1. Generating Swagger (OpenAPI) Documentation in Django DRF**
To generate Swagger and OpenAPI documentation in Django REST Framework (DRF), use **drf-yasg**.

### **Step 1: Install drf-yasg**
```bash
pip install drf-yasg
```

### **Step 2: Configure Swagger in `urls.py`**
Add this to your **project's** `urls.py`:
```python
from django.urls import path, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="User API",
        default_version='v1',
        description="API documentation for user management",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="support@example.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
]
```
Now, visit:
- **Swagger UI:** `http://127.0.0.1:8000/swagger/`
- **Redoc UI:** `http://127.0.0.1:8000/redoc/`

---

## **2. Enforcing Role-Based Profile Creation in DRF**
To **restrict who can create a user profile**, we customize permissions and override the `perform_create` method in the ViewSet.

### **Use Custom Permissions for Role-Based Access**
Create a custom permission class to **allow only admins to create any user** and **doctors to create patients**.

#### **permissions.py**
```python
from rest_framework import permissions

class CanCreateUser(permissions.BasePermission):
    """
    Only Admins can create any user.
    Doctors can create only patients.
    Patients can register themselves.
    """

    def has_permission(self, request, view):
        if request.method == "POST":  # Only applies to user creation
            role = request.data.get("role")  # Get role from request body
            user = request.user  # Authenticated user

            # Admins can create any user
            if user.role == "admin":
                return True
            
            # Doctors can create only patient accounts
            if user.role == "doctor" and role == "patient":
                return True
            
            # Patients should not create accounts from API
            return False
        
        return True  # Allow other operations (GET, PUT, DELETE)
```

Now apply this permission to the `UserViewSet`.

---

### **3. Update User ViewSet to Apply Permissions**
```python
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer
from .permissions import CanCreateUser

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing users, restricted by role-based permissions.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, CanCreateUser]

    def perform_create(self, serializer):
        """
        Custom logic to enforce role-based profile creation.
        """
        user = self.request.user
        role = self.request.data.get("role")

        if user.role == "admin":
            serializer.save()  # Admin can create any user
        
        elif user.role == "doctor" and role == "patient":
            serializer.save()  # Doctor can create only patient profiles
        
        else:
            return Response({"error": "You do not have permission to create this user."}, status=status.HTTP_403_FORBIDDEN)
```

Now:
✅ **Admins can create any user**  
✅ **Doctors can create only patients**  
✅ **Patients cannot create accounts through the API**  

For patients, you can create a separate **signup API**.

---

## **4. Create a Separate Signup API for Patients**
Since **patients should register themselves**, create a separate API that bypasses permission checks.

### **views.py**
```python
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer

@api_view(['POST'])
def patient_signup(request):
    """
    API for patients to register themselves.
    """
    data = request.data
    data["role"] = "patient"  # Ensure only patients can register

    serializer = UserSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

### **urls.py**
```python
from django.urls import path
from .views import patient_signup

urlpatterns = [
    path('signup/', patient_signup, name='patient-signup'),
]
```

Now:
- **Doctors/Admins use `/users/` API**
- **Patients register via `/signup/` API**

---

## **5. Documenting API Endpoints in Swagger**
To ensure Swagger documents these APIs properly, add docstrings in the ViewSet.

### **Example with Swagger Annotations**
```python
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class UserViewSet(viewsets.ModelViewSet):
    """
    Handles creating, reading, updating, and deleting users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, CanCreateUser]

    @swagger_auto_schema(
        operation_description="Create a new user (Admins can create any user, Doctors can create only patients).",
        responses={201: UserSerializer, 403: "Permission denied"},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
```

### **Adding Swagger Docs for Signup API**
```python
@swagger_auto_schema(
    method='post',
    operation_description="Allows patients to register themselves.",
    responses={201: UserSerializer, 400: "Validation error"},
)
@api_view(['POST'])
def patient_signup(request):
    """
    API for patients to register themselves.
    """
    data = request.data
    data["role"] = "patient"  # Enforce patient role

    serializer = UserSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

---

## **6. Summary**
### ✅ **Swagger & OpenAPI Documentation**
- **Installed `drf-yasg`** for auto-generating API docs.
- **Configured Swagger UI** (`/swagger/`) and Redoc (`/redoc/`).
- **Added `swagger_auto_schema`** for documenting endpoints.

### ✅ **Role-Based Profile Creation**
- **Custom Permission Class (`CanCreateUser`)**:
  - Admins can create any user.
  - Doctors can create only patients.
  - Patients cannot create accounts via API.

- **Separated Patient Signup API (`/signup/`)**:
  - Patients register themselves through a separate view.

- **Restricted UserViewSet with `perform_create`** to enforce permissions.

---

## **Next Steps**
Would you like to add:
1. **JWT authentication & token refresh handling?**
2. **Extending Swagger with authentication examples?**
3. **Improved query optimizations (`select_related`, `prefetch_related`)?**

Let me know what you’d like to refine!