from rest_framework import serializers

from drp39.settings import DEBUG, BASE_URL_2

from .models import (
    PatientUser,
    MedicalHistory,
    LabHistory,
    Medication,
    ImagingHistory,
    ImagingUpload,
    DiaryClass,
    Diary
)

class PatientUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientUser
        fields = ['patientBirthdate', 'patientAddress']

class MedicalHistorySerializer(serializers.ModelSerializer):
    letter = serializers.SerializerMethodField()
    class Meta:
        model = MedicalHistory
        fields = ['id', 'admissionDate', 'dischargeDate', 'consultant', 
                  'summary', 'visitType', 'letter', 'addToMedicalHistory']
    def get_letter(self, medHistory):
        if DEBUG:
            request = self.context.get('request')
            letter_url = medHistory.letter.url
            if request:
                return request.build_absolute_uri(letter_url)
            else:
                return f"{BASE_URL_2}{letter_url}"
        else:
            return medHistory.letter.url

class LabHistorySerializer(serializers.ModelSerializer):
    report = serializers.SerializerMethodField()
    # report = serializers.FileField(max_length=None, allow_empty_file=True, use_url=True)
    visitEntry = serializers.CharField(source='visitEntry.id')
    class Meta:
        model = LabHistory
        fields = ['id', 'date', 'labType', 'report', 'visitEntry']
    def get_report(self, labHistory):
        if DEBUG:
            request = self.context.get('request')
            lab_url = labHistory.report.url
            if request:
                return request.build_absolute_uri(lab_url)
            else:
                return f"{BASE_URL_2}{lab_url}"
        else:
            return labHistory.report.url

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ['id', 'drug', 'dosage', 'startDate', 'endDate', 'duration', 'route', 'status', 'comments', 'byPatient']

class ImagingHistorySerializer(serializers.ModelSerializer):
    report = serializers.SerializerMethodField()
    # report = serializers.FileField(max_length=None, allow_empty_file=True, use_url=True)
    visitEntry = serializers.CharField(source='visitEntry.id')

    class Meta:
        model = ImagingHistory
        fields = ['id','patient','date','scanType','region','indication','report', 'visitEntry']
    def get_report(self, imagingHistory):
        if DEBUG:
            request = self.context.get('request')
            imaging_url = imagingHistory.report.url
            if request:
                return request.build_absolute_uri(imaging_url)
            else:
                return f"{BASE_URL_2}{imaging_url}"
        else:
            return imagingHistory.report.url

class ImagingUploadSerializer(serializers.ModelSerializer):
    image = serializers.FileField(max_length=None, allow_empty_file=True, use_url=True)
    class Meta:
        model = ImagingUpload
        fields = ['imagingEntry','image']

class DiaryClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaryClass
        fields = ['contentType']

class DiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        fields = ['id', 'date', 'content', 'readByDoctor']
