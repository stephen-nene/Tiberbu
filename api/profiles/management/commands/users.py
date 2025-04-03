from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth.hashers import make_password
from uuid import uuid4

from profiles.models import HealthcareUser, UserRole

class Command(BaseCommand):
    help = "Seed initial users (Admin, Doctor, Patient)"

    def handle(self, *args, **kwargs):
        users_data = [
            {
                "username": "admin",
                "email": "admin@example.com",
                "role": UserRole.SYSTEM_ADMIN,
                "status": "active",
                "password": "mnbvcxzxcvbnm",  
                "is_staff": True,
                "is_superuser": True,
            },
            {
                "username": "dr_smith",
                "email": "drsmith@example.com",
                "role": UserRole.CLINICIAN,
                "status": "active",
                "password": "mnbvcxzxcvbnm",
            },
            {
                "username": "jane_doe",
                "email": "janedoe@example.com",
                "role": UserRole.PATIENT,
                "status": "active",
                "password": "mnbvcxzxcvbnm",
            },
        ]

        created_count = 0

        with transaction.atomic():
            for user_data in users_data:
                user, created = HealthcareUser.objects.get_or_create(
                    username=user_data["username"],
                    defaults={
                        "id": uuid4(),
                        "email": user_data["email"],
                        "role": user_data["role"],
                        "status": user_data["status"],
                        "password": make_password(user_data["password"]),
                        "is_staff": user_data.get("is_staff", False),
                        "is_superuser": user_data.get("is_superuser", False),
                    },
                )

                if created:
                    created_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Created user: {user.username}'))
                else:
                    self.stdout.write(self.style.WARNING(f'User {user.username} already exists'))

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {created_count} users'))
