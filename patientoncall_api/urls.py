from django.urls import path
from .views import (
    PatientApiView,
    PatientMedicalHistoryApiView,
    PatientEditMedicalHistoryApiView
)
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('patient-data/', PatientApiView.as_view()),
    path('patient-data/patient-add-visit/',PatientMedicalHistoryApiView.as_view()),
    path('patient-data/patient-edit-visit/',PatientEditMedicalHistoryApiView.as_view()),
    path('patient-data/medical-history/', PatientMedicalHistoryApiView.as_view()),
    path('doctor/patient-verify/', views.verifyPatientCredentials),
    path('doctor/patient-data/', views.getPatientData),
    path('doctor/patient-data/medical-history/', views.addMedicalHistory),
    # path('doctor/patient-data/medication/', views.addMedication),
    path('doctor/patient-data/medication/update/', views.updateMedication),
    # path('pageDoctor/', views.displayDoctor, name='index'),
    # path('api/getpatient', views.getPatient, name='apiGetPatient')
    path('doctor/patient-data/add-visit/', views.addVisit),
    path('doctor/patient-data/diary/entry/', views.readDiaryEntry),
    path('doctor/patient-data/imaging-history/', views.addImagingHistory),
    path('doctor/patient-data/imaging-uploads/', views.addImagingHistory),
    path('doctor/patient-data/add-imaging/', views.addImaging),
    path('doctor/patient-data/lab-history/', views.addLabHistory),
    path('doctor/patient-data/add-lab/', views.addLab),
]