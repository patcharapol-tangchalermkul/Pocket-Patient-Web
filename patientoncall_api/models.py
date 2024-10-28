from datetime import datetime
import uuid

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class PatientUser(models.Model):
  patientId = models.IntegerField(primary_key=True, default=None, editable=True)
  patient = models.ForeignKey(User, on_delete=models.CASCADE)
  patientBirthdate = models.DateField(blank=True, null=True)
  patientAddress = models.CharField(max_length=1024, default="", blank=True, null=True)

VISIT_TYPE = (
   ('GP Consultation', 'GP Consultation'),
   ('Hospital Clinic', 'Hospital Clinic'),
   ('Hospital Admission', 'Hospital Admission'),
)
class MedicalHistory(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  patient = models.ForeignKey(User, on_delete=models.CASCADE)
  admissionDate = models.DateField(default=datetime.today, blank=True, null=True)
  dischargeDate = models.DateField(default=datetime.today, blank=True, null=True)
  summary = models.CharField(max_length=1024, default="", blank=True, null=True)
  consultant =models.CharField(max_length=64, default="", blank=True, null=True)
  visitType = models.CharField(max_length=100, choices=VISIT_TYPE, default='Hospital Admission')
  letter = models.FileField(upload_to='letterattachments/', blank=True, null=True, default=True)
  addToMedicalHistory = models.BooleanField(default=True)
#   byPatient = models.BooleanField(default=False)

  def replace_file(self, file):
     self.letter = file
      
  def updateAdmissionDate(self, date):
     self.admissionDate = date

  def updateDischargeDate(self, date):
      self.dischargeDate = date   
   
  def updateSummary(self, summary):
     self.summary = summary

  def updateConsultant(self, consultant):
     self.consultant = consultant
   
  def updateVisitType(self, visitType):
     self.visitType = visitType

  def __str__(self) -> str:
     return f"{self.patient.username}: {self.summary} ({self.admissionDate}, {self.visitType})"

  class Meta:
     ordering = ('-admissionDate',)

LAB_TYPE = (
   ('Full Blood Count Report','Full Blood Count Report'),
   ('Cancer Blood Test','Cancer Blood Test'),
   ('Electrolyte Test','Electrolyte Test'),
   ('Genetic Test','Genetic Test'),
   ('Liver Function Test','Liver Function Test'),
   ('Thyroid Function Test','Thyroid Function Test'),
)

class LabHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(default=datetime.today, blank=True, null=True)
    labType = models.CharField(max_length=100, choices=LAB_TYPE, default='Full Blood Count Report')
    report = models.FileField(upload_to='labattachments/', blank=True, null=True, default=True)
    visitEntry = models.ForeignKey(MedicalHistory, on_delete=models.CASCADE, blank=True, null=True)
    
    class Meta:
       ordering = ('-date',)
       


class Medication(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    drug = models.CharField(max_length=256)
    dosage = models.CharField(max_length=1024)
    startDate = models.DateField()
    endDate = models.DateField()
    duration = models.CharField(max_length=1024)
    route = models.CharField(max_length=1024)
    status = models.CharField(max_length=32, default="current")
    comments = models.CharField(max_length=1024, blank=True, null=True)
    byPatient = models.BooleanField(default=False)

    class Meta:
     ordering = ('-startDate',)

SCAN_TYPE = (
   ('MRI', 'MRI'),
   ('PET', 'PET'),
   ('X-Ray', 'X-Ray'),
   ('ECG', 'ECG'),
   ('CT', 'CT'),
   ('Ultrasound', 'Ultrasound'),
   ('Medical Photography', 'Medical Photography'),

)

class ImagingHistory(models.Model):
   id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
   patient = models.ForeignKey(User, on_delete=models.CASCADE)
   date = models.DateField(default=datetime.today, blank=True, null=True)
   scanType =  models.CharField(max_length=100, choices=SCAN_TYPE, default='MRI')
   region = models.CharField(max_length=256)
   indication = models.CharField(max_length=1024)
   report = models.FileField(upload_to='imagingreports/', blank=True, null=True, default=True)
   visitEntry = models.ForeignKey(MedicalHistory, on_delete=models.CASCADE, blank=True, null=True)
   
   class Meta:
       ordering = ('-date',)


class ImagingUpload(models.Model):
  #  id = models.BigAutoField(auto_created=True, serialize=False, verbose_name='ID')
   imagingEntry = models.ForeignKey(ImagingHistory, on_delete=models.CASCADE)
   image = models.FileField(upload_to='imagingattachments/', blank=True, null=True, default=True)
   

class DiaryClass(models.Model):
   id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
   patient = models.ForeignKey(User, on_delete=models.CASCADE)
   contentType = models.CharField(max_length=64)

   def __str__ (self):
      return f"{self.patient.username}: {self.contentType}"


class Diary(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    diaryClass = models.ForeignKey(DiaryClass, on_delete=models.CASCADE, null=True)
    date = models.DateField(default=datetime.today)
    content = models.TextField()
    readByDoctor = models.BooleanField(default=False)
