# from rest_framework.permissions import BasePermission, SAFE_METHODS
# from rest_framework_simplejwt.exceptions import InvalidToken
# from rest_framework.exceptions import AuthenticationFailed
# from rest_framework import HTTP_HEADER_ENCODING

# from rest_framework_simplejwt.authentication import JWTAuthentication
# from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
# from uuid import UUID
# from profiles.models import HealthcareUser  # Import the HealthcareUser model
# # from profiles.views import AuthenticationMixin
# # class CookieJWTAuthentication(AuthenticationMixin,BasePermission):
# # class IsAdminUserCustom(BasePermission):
# #     def has_permission(self, request, view):
# #         access_token = request.COOKIES.get('access')
# #         if access_token:
# #             try:
# #                 token = AccessToken(access_token)
# #                 user_id = token['user_id']
# #                 user = HealthcareUser.objects.get(id=user_id)
# #                 return user and user.role == 'admin'
# #             except Exception:
# #                 pass
        
# #         refresh_token = request.COOKIES.get('refresh')
# #         if refresh_token:
# #             try:
# #                 refresh = RefreshToken(refresh_token)
# #                 user_id = refresh['user_id']
# #                 user = HealthcareUser.objects.get(id=user_id)
# #                 return user and user.role == 'admin'
# #             except Exception:
# #                 pass
        
# #         raise AuthenticationFailed('Unauthorized, please log in.')
    
    
# class IsAdmin(BasePermission):
#     """
#     Custom permission to only allow admins to access certain views.
#     """

#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == 'admin'
    
# class IsDoctor(BasePermission):
#     """
#     Custom permission to only allow doctors to access certain views.
#     """

#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == 'doctor'
# class IsPatient(BasePermission):
#     """
#     Custom permission to only allow patients to access certain views.
#     """
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == 'patient'


from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'system_admin' 

class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'DOCTOR'

class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'PATIENT'
