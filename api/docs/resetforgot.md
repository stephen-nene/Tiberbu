Your `ResetPasswordView` and `ForgotPasswordView` classes need proper implementation to handle password reset functionality in a Django REST Framework (DRF) API. Below is a detailed implementation:

---

### **1. Reset Password View**
- Takes a **token** and **new password**.
- Validates the token.
- Updates the user's password.

---

### **2. Forgot Password View**
- Takes an **email**.
- Checks if the email exists in the database.
- Sends a password reset link with a token.

---

### **Implementation:**

```python
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Generate reset token
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = request.build_absolute_uri(
            reverse("reset-password", kwargs={"uidb64": uidb64, "token": token})
        )

        # Send email
        send_mail(
            "Password Reset Request",
            f"Click the link to reset your password: {reset_link}",
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

        return Response({"message": "Password reset link sent to email"}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not new_password or not confirm_password:
            return Response({"error": "Both password fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError):
            return Response({"error": "Invalid reset link"}, status=status.HTTP_400_BAD_REQUEST)

        # Verify the token
        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        # Update password
        user.set_password(new_password)
        user.save()

        return Response({"message": "Password successfully reset"}, status=status.HTTP_200_OK)
```

---

### **How It Works**
1. **Forgot Password Flow**:
   - User provides an email.
   - If the email exists, a password reset link with a token is sent.

2. **Reset Password Flow**:
   - User clicks the link and provides a new password.
   - The system verifies the token and updates the password.

---

### **URLs Configuration**
Make sure to add URLs for these views in `urls.py`:

```python
from django.urls import path
from .views import ForgotPasswordView, ResetPasswordView

urlpatterns = [
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("reset-password/<uidb64>/<token>/", ResetPasswordView.as_view(), name="reset-password"),
]
```

This ensures the password reset process is **secure, functional, and user-friendly.** 🚀








-------------------------------------------





Here's a complete implementation for password reset functionality using Django REST Framework and JWT:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
import jwt
from .serializers import PasswordResetSerializer, PasswordResetConfirmSerializer

User = get_user_model()

class ForgotPasswordView(APIView):
    """
    Initiate password reset process by sending email with reset link
    """
    def post(self, request):
        email = request.data.get('email')
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'detail': 'If this email exists, a reset link has been sent.'},
                status=status.HTTP_200_OK
            )
        
        # Generate reset token (expires in 1 hour)
        reset_token = get_random_string(50)
        user.password_reset_token = reset_token
        user.password_reset_token_expires = timezone.now() + timedelta(hours=1)
        user.save()
        
        # Generate JWT for the reset link
        jwt_payload = {
            'user_id': user.id,
            'reset_token': reset_token,
            'exp': timezone.now() + timedelta(hours=1)
        }
        jwt_token = jwt.encode(jwt_payload, settings.SECRET_KEY, algorithm='HS256')
        
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={jwt_token}"
        
        # Send email
        send_mail(
            'Password Reset Request',
            f'Click this link to reset your password: {reset_link}\n'
            f'This link will expire in 1 hour.',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        
        return Response(
            {'detail': 'If this email exists, a reset link has been sent.'},
            status=status.HTTP_200_OK
        )


class ResetPasswordView(APIView):
    """
    Complete password reset process with new password
    """
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            # Decode JWT token
            token = serializer.validated_data['token']
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            
            user = User.objects.get(
                id=payload['user_id'],
                password_reset_token=payload['reset_token'],
                password_reset_token_expires__gt=timezone.now()
            )
        except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            return Response(
                {'detail': 'Invalid or expired token.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        user.set_password(serializer.validated_data['new_password'])
        user.password_reset_token = None
        user.password_reset_token_expires = None
        user.save()
        
        return Response(
            {'detail': 'Password has been reset successfully.'},
            status=status.HTTP_200_OK
        )
```

### Required Serializers (create serializers.py):

```python
from rest_framework import serializers

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return data
```

### User Model Updates:

Make sure your `HealthcareUser` model has these fields:
```python
class HealthcareUser(AbstractUser):
    # ... existing fields ...
    password_reset_token = models.CharField(max_length=50, null=True, blank=True)
    password_reset_token_expires = models.DateTimeField(null=True, blank=True)
```

### Settings Configuration:

```python
# settings.py
FRONTEND_URL = 'https://yourfrontend.com'  # Your frontend URL for reset links
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'  # Configure your email backend
DEFAULT_FROM_EMAIL = 'noreply@yourdomain.com'  # Your email sender
```

### How It Works:

1. **Forgot Password Flow**:
   - User submits email
   - System generates a random token and JWT
   - Sends email with reset link containing JWT
   - Token is valid for 1 hour

2. **Reset Password Flow**:
   - User submits new password with the JWT token
   - System verifies JWT and checks token in database
   - If valid, updates password and clears reset token

### Security Features:

1. Uses JWT for secure token transmission
2. Includes expiration (1 hour)
3. Requires password confirmation
4. Invalidates token after use
5. Doesn't reveal if email exists (security best practice)

### Frontend Integration:

1. The reset link should point to your frontend reset page
2. Frontend should extract the JWT from URL and include it in the reset request

### Testing:

You can test with:
```python
# Forgot password
curl -X POST http://localhost:8000/api/auth/forgot-password/ -H "Content-Type: application/json" -d '{"email":"user@example.com"}'

# Reset password
curl -X POST http://localhost:8000/api/auth/reset-password/ -H "Content-Type: application/json" -d '{"token":"jwt.token.here","new_password":"newpass123","confirm_password":"newpass123"}'
```


