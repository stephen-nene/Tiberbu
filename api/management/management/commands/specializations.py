from django.core.management.base import BaseCommand
from management.models import Specialization
from django.utils.text import slugify

class Command(BaseCommand):
    help = 'Seed initial medical specializations data'

    def handle(self, *args, **kwargs):
        specializations = [
            {
                'name': 'Cardiology',
                'description': 'Diagnosis and treatment of heart disorders',
                'department': 'Cardiovascular',
                'is_surgical': True,
                'is_primary_care': False,
                'average_consultation_fee': 150.00,
                'icd11_code': 'BA00',
                'snomed_ct_id': '394579002',
                'display_order': 1
            },
            {
                'name': 'Neurology',
                'description': 'Treatment of nervous system disorders',
                'department': 'Neurology & Neurosurgery',
                'is_surgical': False,
                'is_primary_care': False,
                'average_consultation_fee': 175.00,
                'icd11_code': '8A00',
                'snomed_ct_id': '394591009',
                'display_order': 2
            },
            {
                'name': 'Orthopedic Surgery',
                'description': 'Surgical treatment of musculoskeletal system',
                'department': 'Orthopedics',
                'is_surgical': True,
                'is_primary_care': False,
                'average_consultation_fee': 200.00,
                'icd11_code': 'FB00',
                'snomed_ct_id': '394609008',
                'display_order': 3
            },
            {
                'name': 'Pediatrics',
                'description': 'Medical care for infants, children, and adolescents',
                'department': 'Pediatrics',
                'is_surgical': False,
                'is_primary_care': True,
                'average_consultation_fee': 120.00,
                'icd11_code': 'KA00',
                'snomed_ct_id': '394537009',
                'display_order': 4
            },
            {
                'name': 'Obstetrics & Gynecology',
                'description': 'Women\'s reproductive health and childbirth',
                'department': 'Women\'s Health',
                'is_surgical': True,
                'is_primary_care': True,
                'average_consultation_fee': 160.00,
                'icd11_code': 'JA00',
                'snomed_ct_id': '394527004',
                'display_order': 5
            },
            {
                'name': 'Oncology',
                'description': 'Diagnosis and treatment of cancer',
                'department': 'Cancer Center',
                'is_surgical': True,
                'is_primary_care': False,
                'average_consultation_fee': 220.00,
                'icd11_code': '2A00',
                'snomed_ct_id': '394594008',
                'display_order': 6
            },
            {
                'name': 'Gastroenterology',
                'description': 'Digestive system disorders treatment',
                'department': 'Internal Medicine',
                'is_surgical': False,
                'is_primary_care': False,
                'average_consultation_fee': 180.00,
                'icd11_code': 'DA00',
                'snomed_ct_id': '394582007',
                'display_order': 7
            },
            {
                'name': 'Pulmonology',
                'description': 'Respiratory system diseases specialist',
                'department': 'Respiratory Medicine',
                'is_surgical': False,
                'is_primary_care': False,
                'average_consultation_fee': 170.00,
                'icd11_code': 'CA00',
                'snomed_ct_id': '394583002',
                'display_order': 8
            },
            {
                'name': 'Family Medicine',
                'description': 'Comprehensive primary care for all ages',
                'department': 'Primary Care',
                'is_surgical': False,
                'is_primary_care': True,
                'average_consultation_fee': 100.00,
                'icd11_code': 'KA20',
                'snomed_ct_id': '394539007',
                'display_order': 9
            },
            {
                'name': 'Neurosurgery',
                'description': 'Surgical treatment of nervous system disorders',
                'department': 'Neurology & Neurosurgery',
                'is_surgical': True,
                'is_primary_care': False,
                'average_consultation_fee': 300.00,
                'icd11_code': '8A0Z',
                'snomed_ct_id': '394610003',
                'display_order': 10
            }
        ]

        created_count = 0
        for spec in specializations:
            obj, created = Specialization.objects.get_or_create(
                name=spec['name'],
                defaults={
                    'slug': slugify(spec['name']),
                    'description': spec['description'],
                    'department': spec['department'],
                    'is_surgical': spec['is_surgical'],
                    'is_primary_care': spec['is_primary_care'],
                    'average_consultation_fee': spec['average_consultation_fee'],
                    'icd11_code': spec['icd11_code'],
                    'snomed_ct_id': spec['snomed_ct_id'],
                    'display_order': spec['display_order']
                }
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created {spec["name"]}'))
            else:
                self.stdout.write(self.style.WARNING(f'{spec["name"]} already exists'))

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {created_count} specializations'))