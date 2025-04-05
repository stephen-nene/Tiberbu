from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import HTTP_HEADER_ENCODING

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from uuid import UUID
from profiles.models import HealthcareUser  # Import the HealthcareUser model

class CookieJWTAuthentication():
    def authenticate(self, request):
        # Get the access and refresh tokens from the cookies
        access_token = request.COOKIES.get("access")
        refresh_token = request.COOKIES.get("refresh")
        
        # If neither token is present, return None (no authentication)
        if not access_token and not refresh_token:
            return None
        
        # Try to decode and validate the access token first
        if access_token:
            try:
                print(f"Access Token: {access_token}")  # Debugging line
                # Decode the access token and validate it
                token = AccessToken(access_token)
                
                # Extract user_id from token (ensure it's a UUID)
                user_id = token['user_id']
                user_id = UUID(user_id)  # Ensure the user_id is a valid UUID
                
                # Query for the user with the extracted UUID
                user = HealthcareUser.objects.get(id=user_id)
                
                # Return the user and the validated token
                return user, token
                
            except InvalidToken:
                # If access token is invalid, check the refresh token
                print("Access token is invalid or expired. Trying refresh token.")
            except ValueError as e:
                # If user_id is not a valid UUID, raise an error
                raise InvalidToken(f"Invalid user ID in access token: {e}")

        # If no valid access token, try using the refresh token
        if refresh_token:
            try:
                print(f"Refresh Token: {refresh_token}")  # Debugging line
                validated_refresh_token = RefreshToken(refresh_token)
                
                # Generate a new access token using the refresh token
                new_access_token = validated_refresh_token.access_token
                print(f"New Access Token: {new_access_token}")
                
                # Now validate the new access token
                validated_token = self.get_validated_token(str(new_access_token))
                
                # Return the user and the validated token
                return self.get_user(validated_token), validated_token
            except InvalidToken:
                raise InvalidToken("Both access and refresh tokens are invalid.")
        
        return None

class IsAdmin(BasePermission):
    """
    Custom permission to only allow admins to access certain views.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'
    
class IsDoctor(BasePermission):
    """
    Custom permission to only allow doctors to access certain views.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'doctor'
class IsPatient(BasePermission):
    """
    Custom permission to only allow patients to access certain views.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'patient'