from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import transaction
from django.contrib.auth.hashers import make_password
from uuid import uuid4
from faker import Faker
import random

from profiles.models import HealthcareUser, UserRole, Specialization,Doctor,Patient

class Command(BaseCommand):
    help = "Seed initial users (Admin, Doctor, Patient)"
    
    def handle(self, *args, **kwargs):
        fake = Faker()
        # Check if there are fewer than 3 specializations in the database
        specialization_count = Specialization.objects.count()

        if specialization_count < 3:
            self.stdout.write(self.style.NOTICE("Fewer than 3 specializations found. Calling 'seed_specializations' to create them."))
            call_command('specializations')  # Call the command to seed specializations
        else:
            self.stdout.write(self.style.SUCCESS(f"Found {specialization_count} specializations in the database. Skipping 'seed_specializations'."))

        # Now, proceed with creating users
        users_data = [
            {
                "username": "admin",
                "email": "admin@example.com",
                "role": UserRole.SYSTEM_ADMIN,
                "status": "active",
                "password": "adminpassword123",
                "is_staff": True,
                "is_superuser": True,
                "doctor_profile": False,  # No profile for admin
            },
            {
                "username": "dr_jones",
                "email": "drjones@example.com",
                "role": UserRole.CLINICIAN,
                "status": "active",
                "password": "doctorpassword123",
                "is_staff": True,
                "is_superuser": False,
                "doctor_profile": True,
            },
            {
                "username": "dr_davis",
                "email": "drdavis@example.com",
                "role": UserRole.CLINICIAN,
                "status": "active",
                "password": "doctorpassword123",
                "is_staff": True,
                "is_superuser": False,
                "doctor_profile": True,
            },
            {
                "username": "jane_patient",
                "email": "janepatient@example.com",
                "role": UserRole.PATIENT,
                "status": "active",
                "password": "patientpassword123",
                "is_staff": False,
                "is_superuser": False,
                "doctor_profile": False,
            },
            {
                "username": "john_patient",
                "email": "johnpatient@example.com",
                "role": UserRole.PATIENT,
                "status": "active",
                "password": "patientpassword123",
                "is_staff": False,
                "is_superuser": False,
                "doctor_profile": False,
            },
        ]

        created_count = 0

        with transaction.atomic():
            for user_data in users_data:
                # Create HealthcareUser
                user, created = HealthcareUser.objects.get_or_create(
                    username=user_data["username"],
                    defaults={
                        "id": uuid4(),
                        "email": user_data["email"],
                        "role": user_data["role"],
                        "status": user_data["status"],
                        "password": make_password(user_data["password"]),
                        "is_staff": user_data["is_staff"],
                        "is_superuser": user_data["is_superuser"],
                    },
                )

                if created:
                    created_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Created user: {user.username}'))

                    # Create associated profile (Doctor or Patient) based on the user role
                    if user_data["doctor_profile"]:
                            # Get all available specializations from the database
                        available_specializations = Specialization.objects.all()

                        # Randomly select between 1 and 3 specializations
                        selected_specializations = random.sample(list(available_specializations), k=random.randint(1, 3))

                        # Create Doctor Profile
                        doctor = Doctor.objects.create(
                            user=user,
                            license_number=fake.bothify(text='???-#####'),
                            medical_license=fake.bothify(text='?????-#####'),
                            license_jurisdiction="Medical Board",
                            certifications=fake.pydict(3),
                            experience=fake.random_int(min=5, max=20),
                            bio=fake.text(),
                            fees=fake.random_int(min=50, max=200),
                            accepting_new_patients=fake.boolean(),
                            emergency_availability=fake.boolean(),
                        )
                        # Add the selected specializations to the doctor profile
                        doctor.specializations.set(selected_specializations)
                        doctor.save()
                        self.stdout.write(self.style.SUCCESS(f'Created doctor profile for {user.username} with specializations: {", ".join([spec.name for spec in selected_specializations])}'))

                    elif user_data["role"] == UserRole.PATIENT:
                        # Create Patient Profile
                        patient = Patient.objects.create(
                            user=user,
                            medical_history=fake.text(),
                            known_allergies=fake.pydict(3),
                            permanent_medications=fake.pydict(3),
                            emergency_contacts=[fake.phone_number(), fake.phone_number()],
                            primary_insurance=fake.md5(),
                        )
                        self.stdout.write(self.style.SUCCESS(f'Created patient profile for {user.username}'))

                else:
                    self.stdout.write(self.style.WARNING(f'User {user.username} already exists'))

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {created_count} users'))
