from django.test import TestCase

from django.contrib.auth.models import User
from .models import (
    PatientUser
)

from datetime import datetime


class PatientUserModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
      test_date = datetime.strptime("2023-01-01", '%Y-%m-%d').date()
      patient1 = User.objects.create_user(username='patient1', password='12345')
      PatientUser.objects.create(patientId=1234, 
                                 patient=patient1, 
                                 patientBirthdate=test_date,
                                 patientAddress="Kensington, London")
    
    def test_patientId_label(self):
       patient = PatientUser.objects.get(patientId=1234)
       field_label = patient._meta.get_field('patientId').verbose_name
       self.assertEqual(field_label, 'patientId')

    def test_patientBirthdate_label(self):
       patient = PatientUser.objects.get(patientId=1234)
       field_label = patient._meta.get_field('patientBirthdate').verbose_name
       self.assertEqual(field_label, "patientBirthdate")