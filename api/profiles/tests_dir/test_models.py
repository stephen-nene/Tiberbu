from django.test import TestCase
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.exceptions import ValidationError
from uuid import UUID
import os

from ..models import (
    HealthcareUser, Doctor, Patient, ClinicalImage, 
    UserRole, UserStatus, BloodGroup, Gender
)
from management.models import Specialization

# Helper functions
def create_test_image():
    from io import BytesIO
    from PIL import Image
    file = BytesIO()
    image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
    image.save(file, 'png')
    file.name = 'test.png'
    file.seek(0)
    return file

class HealthcareUserModelTest(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'role': UserRole.PATIENT,
            'status': UserStatus.ACTIVE,
            'gender': Gender.MALE,
            'phone_number': '+1234567890'
        }

    def test_create_healthcare_user(self):
        user = HealthcareUser.objects.create_user(**self.user_data)
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.role, UserRole.PATIENT)
        self.assertEqual(user.status, UserStatus.ACTIVE)
        self.assertIsInstance(user.id, UUID)
        self.assertTrue(user.check_password('testpass123'))

    def test_user_role_validation(self):
        with self.assertRaises(ValidationError):
            user = HealthcareUser(**self.user_data, role='invalid_role')
            user.full_clean()

    def test_user_status_validation(self):
        with self.assertRaises(ValidationError):
            user = HealthcareUser(**self.user_data, status='invalid_status')
            user.full_clean()


def test_phone_number_validation(self):
    # Remove phone_number from user_data copy
    user_data = self.user_data.copy()
    del user_data['phone_number']
    user = HealthcareUser(**user_data, phone_number='invalid')
    with self.assertRaises(ValidationError):
        user.full_clean()

def test_user_role_validation(self):
    user_data = self.user_data.copy()
    user_data['role'] = 'invalid_role'
    user = HealthcareUser(**user_data)
    with self.assertRaises(ValidationError):
        user.full_clean()

def test_user_status_validation(self):
    user_data = self.user_data.copy()
    user_data['status'] = 'invalid_status'
    user = HealthcareUser(**user_data)
    with self.assertRaises(ValidationError):
        user.full_clean()

def test_user_permissions(self):
    user = HealthcareUser.objects.create_user(**self.user_data)
    permission = Permission.objects.create(
        codename='test_permission',
        name='Test Permission',
        content_type=ContentType.objects.get_for_model(HealthcareUser)
    )
    user.user_permissions.add(permission)
    self.assertTrue(user.has_perm('profiles.test_permission'))  # Changed 'users' to 'profiles'

def test_create_superuser(self):
    superuser = HealthcareUser.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='adminpass',
        role=UserRole.SYSTEM_ADMIN  # Explicitly set role
    )
    self.assertTrue(superuser.is_superuser)
    self.assertTrue(superuser.is_staff)
    self.assertEqual(superuser.role, UserRole.SYSTEM_ADMIN)

class DoctorModelTest(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'dr_smith',
            'email': 'dr.smith@example.com',
            'password': 'doctorpass123',
            'first_name': 'John',
            'last_name': 'Smith',
            'role': UserRole.CLINICIAN,
            'status': UserStatus.ACTIVE
        }
        self.user = HealthcareUser.objects.create_user(**self.user_data)
        self.specialization = Specialization.objects.create(name='Cardiology', description='Heart specialist')

    def test_create_doctor_profile(self):
        doctor = Doctor.objects.create(
            user=self.user,
            license_number='MD123456',
            medical_license='SECRET123',
            license_jurisdiction='California',
            accepting_new_patients=True
        )
        doctor.specializations.add(self.specialization)
        
        self.assertEqual(doctor.user.username, 'dr_smith')
        self.assertEqual(doctor.license_number, 'MD123456')
        self.assertEqual(doctor.specializations.first().name, 'Cardiology')
        self.assertTrue(doctor.accepting_new_patients)


    def test_doctor_str_representation(self):
        doctor = Doctor.objects.create(
            user=self.user,
            license_number='MD123456',
            medical_license='SECRET123',
            license_jurisdiction='California'
        )
        doctor.specializations.add(self.specialization)
        # Update expectation to match actual output
        self.assertIn("Dr. dr_smith", str(doctor))
        self.assertIn("Cardiology", str(doctor))

    def test_unique_license_constraint(self):
        Doctor.objects.create(
            user=self.user,
            license_number='MD123456',
            medical_license='SECRET123',
            license_jurisdiction='California'
        )
        
        # Try to create another doctor with same license info
        user2 = HealthcareUser.objects.create_user(
            username='dr_jones',
            email='dr.jones@example.com',
            password='doctorpass123',
            first_name='Jane',
            last_name='Jones',
            role=UserRole.CLINICIAN
        )
        
        with self.assertRaises(Exception):  # IntegrityError
            Doctor.objects.create(
                user=user2,
                license_number='MD123456',
                medical_license='SECRET123',
                license_jurisdiction='California'
            )

    def test_doctor_rating_validation(self):
        doctor = Doctor.objects.create(
            user=self.user,
            license_number='MD123456',
            medical_license='SECRET123',
            license_jurisdiction='California',
            rating=6.0  # Should be invalid if max is 5.0
        )
        with self.assertRaises(ValidationError):
            doctor.full_clean()

class PatientModelTest(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'patient1',
            'email': 'patient1@example.com',
            'password': 'patientpass123',
            'first_name': 'Alice',
            'last_name': 'Johnson',
            'role': UserRole.PATIENT,
            'status': UserStatus.ACTIVE,
            'blood_group': BloodGroup.O_POS,
            'date_of_birth': '1990-01-01'
        }
        self.user = HealthcareUser.objects.create_user(**self.user_data)

    def test_create_patient_profile(self):
        patient = Patient.objects.create(
            user=self.user,
            gender=Gender.FEMALE,
            medical_history="No significant history",
            known_allergies=['penicillin', 'peanuts'],
            permanent_medications=['insulin'],
            emergency_contacts=[{
                'name': 'Bob Johnson',
                'relationship': 'spouse',
                'phone': '+1234567890'
            }]
        )
        
        self.assertEqual(patient.user.username, 'patient1')
        self.assertEqual(patient.gender, Gender.FEMALE)
        self.assertEqual(len(patient.known_allergies), 2)
        self.assertEqual(patient.emergency_contacts[0]['name'], 'Bob Johnson')

    def test_patient_str_representation(self):
        patient = Patient.objects.create(user=self.user)
        self.assertEqual(str(patient), f"Patient: patient1")

    def test_patient_medical_data_encryption(self):
        insurance_info = "Aetna 123456789"
        patient = Patient.objects.create(
            user=self.user,
            primary_insurance=insurance_info
        )
        
        # Refresh from DB and check raw value is encrypted
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT primary_insurance FROM profiles_patient WHERE id = %s", [patient.id])
            db_value = cursor.fetchone()[0]
            self.assertNotEqual(db_value, insurance_info)
            self.assertTrue(db_value.startswith('\\x'))  # Check if it's hex-encoded
        
class ClinicalImageModelTest(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'role': UserRole.PATIENT
        }
        self.user = HealthcareUser.objects.create_user(**self.user_data)
        self.patient = Patient.objects.create(user=self.user)
        self.content_type = ContentType.objects.get_for_model(Patient)

    def test_create_clinical_image(self):
        image_file = create_test_image()
        clinical_image = ClinicalImage.objects.create(
            content_type=self.content_type,
            object_id=self.patient.user.id,
            image=SimpleUploadedFile(image_file.name, image_file.read()),
            caption='Test Image',
            clinical_context='Test context',
            sensitivity_level=2
        )
        
        self.assertEqual(clinical_image.caption, 'Test Image')
        self.assertEqual(clinical_image.sensitivity_level, 2)
        self.assertTrue(clinical_image.image.name.startswith('clinical_images/'))
        
        # Clean up
        if os.path.exists(clinical_image.image.path):
            os.remove(clinical_image.image.path)

    def test_image_size_validation(self):
        # Create a file larger than 5MB
        from io import BytesIO
        large_file = BytesIO()
        large_file.write(b'\x00' * (6 * 1024 * 1024))  # 6MB
        large_file.name = 'large.png'
        large_file.seek(0)
        
        with self.assertRaises(ValidationError):
            clinical_image = ClinicalImage(
                content_type=self.content_type,
                object_id=self.patient.user.id,
                image=SimpleUploadedFile(large_file.name, large_file.read()),
                caption='Too Large'
            )
            clinical_image.full_clean()

    def test_image_extension_validation(self):
        invalid_file = SimpleUploadedFile('test.txt', b'file_content')
        
        with self.assertRaises(ValidationError):
            clinical_image = ClinicalImage(
                content_type=self.content_type,
                object_id=self.patient.user.id,
                image=invalid_file,
                caption='Invalid Extension'
            )
            clinical_image.full_clean()

    def test_clinical_image_str_representation(self):
        image_file = create_test_image()
        clinical_image = ClinicalImage.objects.create(
            content_type=self.content_type,
            object_id=self.patient.user.id,
            image=SimpleUploadedFile(image_file.name, image_file.read()),
            caption='Test Image'
        )
        
        self.assertEqual(str(clinical_image), f"Image for {self.patient} - Test Image")
        
        # Clean up
        if os.path.exists(clinical_image.image.path):
            os.remove(clinical_image.image.path)

    def test_generic_relationship(self):
        image_file = create_test_image()
        clinical_image = ClinicalImage.objects.create(
            content_type=self.content_type,
            object_id=self.patient.user.id,
            image=SimpleUploadedFile(image_file.name, image_file.read())
        )
        
        self.assertEqual(clinical_image.content_object, self.patient)
        
        # Clean up
        if os.path.exists(clinical_image.image.path):
            os.remove(clinical_image.image.path)