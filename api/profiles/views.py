from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from django.db import transaction, IntegrityError


from django.contrib.auth.hashers import check_password

from django.db.models import Q

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import filters,status, viewsets
from rest_framework.exceptions import ValidationError as DRFValidationError, NotFound
from rest_framework.pagination import PageNumberPagination

from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework.permissions import IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly
from .permissions import IsAdmin, IsDoctor, IsPatient

import requests
import json
from decouple import config


from profiles.services.emails import send_login_email,send_custom_email,send_welcome_email
from .models import HealthcareUser, Patient, Doctor
from .serializers import *

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

ENVIRONMENT = config('ENVIRONMENT', default="development")

is_production = ENVIRONMENT == 'production'

# Create your views here.



class FunnyAPIView(View):
    def get_chuck_norris_joke(self):
        """Fetch a random Chuck Norris joke."""
        try:
            response = requests.get("https://api.chucknorris.io/jokes/random", timeout=5)
            response.raise_for_status()  # Raise an error for bad status codes
            return response.json().get("value", "Chuck Norris is too powerful to joke about.")
        except (requests.RequestException, ValueError):
            return "Chuck Norris once roundhouse kicked a server, and it's still down."

    def get_dad_joke(self):
        """Fetch a random dad joke."""
        try:
            headers = {"Accept": "application/json"}
            response = requests.get("https://icanhazdadjoke.com/", headers=headers, timeout=5)
            response.raise_for_status()
            return response.json().get("joke", "Why don't skeletons fight each other? They don't have the guts.")
        except (requests.RequestException, ValueError):
            return "I'm reading a book on anti-gravity. It's impossible to put down!"

    def get_random_meme(self):
        """Fetch a random meme image."""
        try:
            response = requests.get("https://some-random-api.com/meme", timeout=5)
            response.raise_for_status()
            return response.json().get("image", "https://i.imgur.com/funny-meme.jpg")
        except (requests.RequestException, ValueError):
            return "https://i.imgur.com/fallback-meme.jpg"

    def get_programming_joke(self):
        """Fetch a random programming joke."""
        try:
            response = requests.get("https://official-joke-api.appspot.com/jokes/programming/random", timeout=5)
            response.raise_for_status()
            if response.json():
                return response.json()[0]
            return {"setup": "Why do programmers prefer dark mode?", "punchline": "Because light attracts bugs."}
        except (requests.RequestException, ValueError):
            return {"setup": "Why do programmers hate nature?", "punchline": "It has too many bugs."}

    def get_inspirational_quote(self):
        """Fetch a random inspirational quote."""
        try:
            response = requests.get("https://api.quotable.io/random", timeout=5)
            response.raise_for_status()
            return {
                "quote": response.json().get("content", "Stay hungry, stay foolish."),
                "author": response.json().get("author", "Steve Jobs"),
            }
        except (requests.RequestException, ValueError):
            return {
                "quote": "When something is important enough, you do it even if the odds are not in your favor.",
                "author": "Elon Musk",
            }

    def get(self, request, *args, **kwargs):
        """Handle GET requests and return a dynamic response based on the 'type' parameter."""
        content_type = request.GET.get("type", "chuck_norris")  # Default to Chuck Norris jokes

        if content_type == "chuck_norris":
            content = {"chuck_norris_joke": self.get_chuck_norris_joke()}
        elif content_type == "dad_joke":
            content = {"dad_joke": self.get_dad_joke()}
        elif content_type == "meme":
            content = {"meme": self.get_random_meme()}
        elif content_type == "programming_joke":
            content = {"programming_joke": self.get_programming_joke()}
        elif content_type == "inspirational_quote":
            content = {"inspirational_quote": self.get_inspirational_quote()}
        else:
            # Return error with documentation
            content = {
                "error": "Invalid content type specified.",
                "documentation": {
                    "supported_types": {
                        "type=chuck_norris": "Returns a Chuck Norris joke.",
                        "type=dad_joke": "Returns a dad joke.",
                        "type=meme": "Returns a random meme.",
                        "type=programming_joke": "Returns a programming joke.",
                        "type=inspirational_quote": "Returns an inspirational quote.",
                    },
                    "message": "Please use one of the supported types.",
                },
            }

        # Add a default message and status
        response_data = {
            "message": "Welcome to the ultimate API of chaos!",
            "status": "🔥 Ready to roll!",
            **content,  # Merge the content into the response
        }

        return JsonResponse(response_data)




# ----------------- Authentication Views -----------------

class AuthenticationMixin:

    def get_authenticated_user(self, request):
        # Try with access token first
        access_token = request.COOKIES.get('access')
        if access_token:
            try:
                token = AccessToken(access_token)
                user_id = token['user_id']
                return HealthcareUser.objects.get(id=user_id), None
            except Exception:
                # print("passed access",access_token)
                pass

        # Try with refresh token if access token is invalid
        refresh_token = request.COOKIES.get('refresh')
        if refresh_token:
            try:
                refresh = RefreshToken(refresh_token)
                user_id = refresh['user_id']
                new_access_token = str(refresh.access_token)
                response = Response()
                response.set_cookie('refresh', refresh.access_token, httponly=True, samesite='None' if is_production else 'None', secure=True)
                response.set_cookie('access', new_access_token, httponly=True, samesite='None' if is_production else 'None', secure=True)

                user = HealthcareUser.objects.get(id=user_id)
                return user, response
            except Exception:
                # print("passed refresh",refresh_token)
                pass

        response = Response()
        response.delete_cookie('access', samesite="None")
        response.delete_cookie('refresh', samesite="None")
        raise AuthenticationFailed('Unauthorized, please log in.')
    

# ---------------------   login   ---------------------

class CustomLoginView(AuthenticationMixin,APIView):


    @swagger_auto_schema(
        operation_summary="Retrieve authenticated user info with tokens",
        tags=["Authentication"],
        responses={
            200: openapi.Response(
                description="User info with JWT tokens",
                examples={
                    "application/json": {
                        "message": "User authenticated.",
                        "User": {"id": "...", "username": "..."},
                        "access": "jwt_access_token",
                        "refresh": "jwt_refresh_token"
                    }
                }
            ),
            401: "Unauthorized, please log in."
        }
    )
    def get(self, request):
        user, response = self.get_authenticated_user(request) 
        serialized_user = UserSerializer(user).data

                # Always issue new tokens in response
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)
        refresh = str(refresh)

        data = {
            "message": "User authenticated.",
            'User': serialized_user,
            'access': access,
            'refresh': refresh
        }

        
        if response:
            response.set_cookie('refresh', refresh, httponly=True, samesite='None' if is_production else 'None', secure=True)
            response.set_cookie('access', access, httponly=True, samesite='None' if is_production else 'None', secure=True)
            response.data = data
            return response
        
        return Response(data)
    @swagger_auto_schema(
        operation_description="Login a user",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['identifier', 'password'],
            properties={
                'identifier': openapi.Schema(type=openapi.TYPE_STRING, description='Email, phone or username'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='User password'),
            },
        ),
        responses={200: 'Login successful'},
        tags=["Authentication"]
    )
    # @swagger_auto_schema(
    #     operation_description="Login a user",
    # )
    def post(self, request):
        # Get the login credentials
        # print(request.data)
        identifier = request.data.get('identifier')
        password = request.data.get('password')
        
        if not identifier or not password:
            return Response({"error": "Both identifier and password are required."}, status=400)
        
        # user = HealthcareUser.objects.filter(email=identifier).first() or \
        #        HealthcareUser.objects.filter(phone_number=identifier).first() or \
        #        HealthcareUser.objects.filter(username=identifier).first()

        user = HealthcareUser.objects.filter(
            Q(email=identifier) | Q(phone_number=identifier) | Q(username=identifier)
        ).first()

        if not user:
            raise AuthenticationFailed("User not found.")
        if not check_password(password, user.password):
            raise AuthenticationFailed("Incorrect password.")
                # Send login email
        try:
            print("will send login email here")
            # send_login_email(user.email, user.username)
        except Exception as e:
            print(f"Failed to send login email: {str(e)}")
            return Response({"error": f"Failed to send login email: {str(e)}"}, status=500)

        refresh = RefreshToken.for_user(user)
        serialized_user = UserSerializer(user).data
        response = Response({
            "message": "Login successful.",
            "User": serialized_user,
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })
        response.set_cookie(
            key='access',
            value=str(refresh.access_token),
            httponly=True,
            samesite="None",
            # samesite='Lax' if is_production else 'None',
            secure=True,
        )
        response.set_cookie(
            key='refresh',
            value=str(refresh),
            httponly=True,
            samesite="None",
            secure=True
        )
        return response
    
class UserCreateView(APIView):
    @swagger_auto_schema(
        operation_description="Create a new user",
        tags=["Authentication"]
    )
    # @swagger_auto_schema(auto_schema=None)
    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                return Response({
                    "message": "User created successfully.",
                    "user": serializer.data
                }, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": "User creation failed", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ResetPasswordView(APIView):
    @swagger_auto_schema(
        operation_description="Reset a user's password",
        tags=["Authentication"]
    )
    # @swagger_auto_schema(auto_schema=None)
    def post(self, request):
        # take the token and the new passwords all over again
        pass
    
class ForgotPasswordView(APIView):
    @swagger_auto_schema(
        operation_description="Forgot a user's password",
        tags=["Authentication"],
        
    )
    # @swagger_auto_schema(auto_schema=None)

    def post(self, request):
        # take the email and then chack in db and send email with reset instaructiosn and link
        pass
    
# ---------------------   logout   ---------------------

class LogoutView(APIView):
    @swagger_auto_schema(
        operation_description="Logout a user",
        tags=["Authentication"]
    )
    def post(self, request):
        try:
            response = Response({"message": "Logout successful."}, status=status.HTTP_200_OK)
            response.delete_cookie(key='access', samesite="None")
            response.delete_cookie(key='refresh', samesite="None")
            return response

        except Exception as e:
            return Response(
                {"error": "Something went wrong during logout.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
      

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)  # Deserialize user input
    if serializer.is_valid():  # Validate input
        user = serializer.save(password=make_password(serializer.validated_data['password']))
        return Response({
            "message": "User created successfully.",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "phone_number": user.phone_number
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MeView(APIView, AuthenticationMixin):
    @swagger_auto_schema(
        operation_description="Gets logged in User",
        tags=["Authentication"]
    )
    def get(self, request):
        user, response = self.get_authenticated_user(request) 
        serialized_user = UserSerializer(user).data
        
        if response:
            response.data = {'User': serialized_user}
            return response
        
        return Response({'User': serialized_user})
      
            
# ---------------    get all user2   ---------------------

class AllUserView(APIView,AuthenticationMixin):
    def get(self, request):
        try:
            user, _ = self.get_authenticated_user(request)
            users = HealthcareUser.objects.all()  # Assuming a related name 'records' for associated data
            # serialized_records = UserSerializer(users, many=True).data
            return Response({'users': users})
        except AuthenticationFailed as e:
            response = JsonResponse({'detail': str(e)}, status=401)
            return response
        
# ----------------------- DRF’s Generic Views for all users
class UserList(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.

    * `list`: Returns a list of all users.
    * `retrieve`: Returns the specified user.
    * `create`: Creates a new user.
    * `update`: Updates the specified user.
    * `destroy`: Deletes the specified user.
    """
    serializer_class = UserSerializer
    docserializer = DoctorProfileSerializer
    permission_classes = [IsAuthenticated,IsAdmin]

    # -------------------------
    # 🟩 LIST
    # -------------------------
    @swagger_auto_schema(
        operation_summary="List healthcare users",
        operation_description="Returns a list of healthcare users filtered by optional query params.",
        manual_parameters=[
            openapi.Parameter('role', openapi.IN_QUERY, description="Filter by role", type=openapi.TYPE_STRING),
            openapi.Parameter('status', openapi.IN_QUERY, description="Filter by status", type=openapi.TYPE_STRING),
            openapi.Parameter('gender', openapi.IN_QUERY, description="Filter by gender", type=openapi.TYPE_STRING),
            openapi.Parameter('blood_group', openapi.IN_QUERY, description="Filter by blood group", type=openapi.TYPE_STRING),
            openapi.Parameter('search', openapi.IN_QUERY, description="Search in name/email/username", type=openapi.TYPE_STRING),
        ],
        tags=["Healthcare Users"]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    # -------------------------
    # 🟨 RETRIEVE
    # -------------------------
    @swagger_auto_schema(
        operation_summary="Retrieve a specific user",
        operation_description="Returns the details of a user by ID.",
        tags=["Healthcare Users"]
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    # -------------------------
    # 🟦 CREATE
    # -------------------------
    @swagger_auto_schema(
        operation_summary="Create a new user",
        operation_description="Creates a new user (doctor/patient) with required details.",
        tags=["Healthcare Users"]
    )
    def create(self, request, *args, **kwargs):
        try:
            data = request.data.copy()
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=201, headers=headers)
        
        except IntegrityError as ie:
            return Response({
                "error": "Failed to create user",
                "details": str(ie)
            })
        except DRFValidationError as ve:
            # This will catch both serializer validation errors and our converted integrity errors
            return Response(ve.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "error": "Failed to create user",
                "details": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
    
    def perform_create(self, serializer):
        print("perform_create method is called")
        try:
            with transaction.atomic():
                validated_data = serializer.validated_data
                
                profile_image_data = validated_data.pop('profile_image', None)
                patient_data = validated_data.pop('patient_profile', None)
                doctor_data = validated_data.pop('clinician_profile', None)
                print("data",doctor_data)


                validated_data['password'] = make_password(validated_data['password'])
                
                # medical_license = doctor_data['medical_license']
                # license_jurisdiction = doctor_data['license_jurisdiction']
                
                # if Doctor.objects.filter(medical_license=medical_license, license_jurisdiction=license_jurisdiction).exists():
                #     raise serializers.ValidationError({
                #         'medical_license': ['A doctor with this medical license and jurisdiction already exists.']
                #     })
                # Create user instance
                user = serializer.save(**validated_data)
                print("User Created:", user)
                
                    
                # Handle profile image
                if profile_image_data and profile_image_data.get('image'):
                    ProfileImage.objects.create(user=user, **profile_image_data)
                
                # Handle role-specific profiles
                if user.role == UserRole.PATIENT and patient_data:
                    Patient.objects.create(user=user, **patient_data)
                    
                elif user.role == UserRole.CLINICIAN and doctor_data:
                    # doctor_data = serializer.validated_data.get('clinician_profile')
                    # if docseri.is_valid():
                        specializations = doctor_data.pop('specializations', [])
                        doctor = Doctor.objects.create(
                            user=user,
                            **doctor_data
                        )
                        doctor.specializations.set([s['id'] for s in specializations])
                        user.status = UserStatus.PENDING_VERIFICATION
                        user.save()
                    
                elif user.role == UserRole.SYSTEM_ADMIN:
                    # Handle admin specific logic if needed
                    pass
                    
                elif user.role == UserRole.NURSE:
                    # Handle nurse specific logic if needed
                    pass
                    
                elif user.role == UserRole.SUPPORT_STAFF:
                    # Handle support staff specific logic if needed
                    pass
                

        except serializers.ValidationError as ve:
            raise ve  # Re-raise validation errors          
        except Exception as e:
            raise serializers.ValidationError({
                "error": "Failed to create user", 
                "details": str(e)
            })
            
            
                        # Parse JSON strings if they exist
            # if 'user_data' in data:
            #     try:
            #         user_data = json.loads(data['user_data'])
            #         data.update(user_data)
            #         del data['user_data']
            #     except json.JSONDecodeError as e:
            #         return Response({"error": "Invalid user_data JSON"}, status=400)

            # if 'clinician_profile' in data and isinstance(data['clinician_profile'], str):
            #     try:
            #         data['clinician_profile'] = json.loads(data['clinician_profile'])
            #     except json.JSONDecodeError as e:
            #         return Response({"error": "Invalid clinician_profile JSON"}, status=400)

            # if 'patient_profile' in data and isinstance(data['patient_profile'], str):
            #     try:
            #         data['patient_profile'] = json.loads(data['patient_profile'])
            #     except json.JSONDecodeError as e:
            #         return Response({"error": "Invalid patient_profile JSON"}, status=400)

   # -------------------------
    # 🟧 UPDATE (PUT)
    # -------------------------
    @swagger_auto_schema(
        operation_summary="Update a user (full)",
        operation_description="Fully updates a user by replacing all fields.",
        tags=["Healthcare Users"]
    )
    def update(self, serializer):
        instance = serializer.instance
        validated_data = serializer.validated_data
        
        try:
            with transaction.atomic():
                # Handle profile image updates
                profile_image_data = validated_data.pop('profile_image', None)
                if profile_image_data:
                    if instance.profile_image:
                        # Update existing
                        for attr, value in profile_image_data.items():
                            setattr(instance.profile_image, attr, value)
                        instance.profile_image.save()
                    else:
                        # Create new
                        ProfileImage.objects.create(user=instance, **profile_image_data)
                
                # Handle role-specific profile updates
                if instance.role == UserRole.PATIENT:
                    patient_data = validated_data.pop('patient_profile', None)
                    if patient_data and hasattr(instance, 'patient_profile'):
                        for attr, value in patient_data.items():
                            setattr(instance.patient_profile, attr, value)
                        instance.patient_profile.save()
                        
                elif instance.role == UserRole.CLINICIAN:
                    doctor_data = validated_data.pop('clinician_profile', None)
                    if doctor_data and hasattr(instance, 'clinician_profile'):
                        specializations_data = doctor_data.pop('specializations', None)
                        for attr, value in doctor_data.items():
                            setattr(instance.clinician_profile, attr, value)
                        instance.clinician_profile.save()
                        if specializations_data:
                            instance.clinician_profile.specializations.set(
                                [s['id'] for s in specializations_data]
                            )
                
                # Update the user instance
                serializer.save()
                
        except Exception as e:
            raise serializers.ValidationError({
                "error": "Failed to update user", 
                "details": str(e)
            })
    
        
    # -------------------------
    # 🟫 PARTIAL UPDATE (PATCH)
    # -------------------------
    @swagger_auto_schema(
        operation_summary="Update a user (partial)",
        operation_description="Partially updates user fields (PATCH).",
        tags=["Healthcare Users"]
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    # -------------------------
    # 🟥 DELETE
    # -------------------------
    @swagger_auto_schema(
        operation_summary="Delete a user",
        operation_description="Deletes a user from the system.",
        tags=["Healthcare Users"]
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    

    def get_queryset(self):
        queryset = HealthcareUser.objects.all().select_related(
            'patient_profile', 'clinician_profile', 'profile_image'
        ).prefetch_related(
            'clinician_profile__specializations'
        )

        filters = ['role', 'status', 'gender', 'blood_group']
        for f in filters:
            value = self.request.query_params.get(f)
            if value:
                queryset = queryset.filter(**{f: value})

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )

        if not queryset.exists():
            raise NotFound(detail="No users found matching the given criteria.")

        return queryset

    @swagger_auto_schema(
        operation_summary="List healthcare users",
        operation_description="Returns a list of healthcare users with optional filters like role, status, gender, blood_group, and search.",
        manual_parameters=[
            openapi.Parameter('role', openapi.IN_QUERY, description="Filter by user role (e.g., PATIENT, DOCTOR)", type=openapi.TYPE_STRING),
            openapi.Parameter('status', openapi.IN_QUERY, description="Filter by account status", type=openapi.TYPE_STRING),
            openapi.Parameter('gender', openapi.IN_QUERY, description="Filter by gender", type=openapi.TYPE_STRING),
            openapi.Parameter('blood_group', openapi.IN_QUERY, description="Filter by blood group", type=openapi.TYPE_STRING),
            openapi.Parameter('search', openapi.IN_QUERY, description="Search across username, email, first name, last name", type=openapi.TYPE_STRING),
        ],
        tags=["Healthcare Users"]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    
        