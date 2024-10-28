from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.core.files.base import ContentFile
from urllib.parse import unquote, urlparse
from pathlib import PurePosixPath

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser 
from rest_framework.parsers import MultiPartParser, FormParser
from django.views.generic.edit import FormView

from drp39.settings import BASE_URL

from datetime import datetime, date

import json
import base64

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

from .serializers import (
    PatientUserSerializer,
    MedicalHistorySerializer,
    LabHistorySerializer,
    MedicationSerializer,
    ImagingHistorySerializer,
    ImagingUploadSerializer,
    DiaryClassSerializer,
    DiarySerializer
)

from .forms import AddVisitForm, AddImagingForm, ImagesUploadForm, AddLabForm

@permission_classes([IsAuthenticated])
class PatientApiView(APIView):
    # add permission to check if user is authenticated
    # permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        '''
        List all data for given requested patient user
        '''
        user = request.user
        result = getAllPatientDataById(request, user)
        return Response(result, status=status.HTTP_200_OK)
    

@permission_classes([IsAuthenticated])
class PatientMedicalHistoryApiView(APIView):
    # add permission to check if user is authenticated
    parser_classes = (MultiPartParser, FormParser, )

    @csrf_exempt    
    def post(self, request, *args, **kwargs):
        '''
        List all data for given requested patient user
        '''

        user = get_user_by_patientId(request.POST.get('patient-id'))
        
        discharge_date = request.POST.get("dischargeDate").split(' ')[0]
        admissionDate = request.POST.get("admissionDate").split(' ')[0]

        newMedHistory = MedicalHistory.objects.create(
                patient=user,
                admissionDate=admissionDate,
                dischargeDate=discharge_date,
                summary = request.POST.get("summary"),
                consultant = request.POST.get("consultant"),
                visitType = request.POST.get("visitType"),
                letter= request.FILES["letter"] if 'letter' in request.FILES else False,
                addToMedicalHistory=True if (request.POST.get("addToMedicalHistory")=="on") else False
            )
        
        newLabHistory = None
        newImagingHistory = None
        
        if 'lab' in request.FILES and request.FILES['lab'] != None:
            newLabHistory = LabHistory.objects.create(
                patient=user,
                date=discharge_date,
                report=request.FILES['lab'],
                visitEntry=newMedHistory
            )
        if 'imaging' in request.FILES and request.FILES['imaging'] != None:
            newImagingHistory = ImagingHistory.objects.create(
                patient=user,
                date=discharge_date,
                report=request.FILES['imaging'],
                visitEntry=newMedHistory
            )

        return Response({'ok': True, 
                         'id': newMedHistory.id,
                         'labId': newLabHistory.id if newLabHistory else '',
                         'imagingId': newImagingHistory.id if newImagingHistory else '',
                        }, status=status.HTTP_201_CREATED)
    

@permission_classes([IsAuthenticated])
class PatientEditMedicalHistoryApiView(APIView):
    # add permission to check if user is authenticated
    parser_classes = (MultiPartParser, FormParser, )

    @csrf_exempt    
    def post(self, request, *args, **kwargs):
        '''
        List all data for given requested patient user
        '''

        user = get_user_by_patientId(request.POST.get('patient-id'))
        
        mhId = request.POST.get("mhId")
        discharge_date = request.POST.get("dischargeDate").split(' ')[0]
        admission_date = request.POST.get("admissionDate").split(' ')[0]
        print(admission_date)

        obj = MedicalHistory.objects.get(id=mhId)
        # obj.admissionDate= admission_date,
        obj.updateAdmissionDate(admission_date)
        obj.updateDischargeDate(discharge_date)
        # obj.dischargeDate= discharge_date,
        # obj.summary = request.POST.get("summary"),
        obj.updateSummary(request.POST.get("summary"))
        print(obj.summary)
        obj.updateConsultant(request.POST.get("consultant"))
        obj.updateVisitType(request.POST.get("visitType"))

        if 'letter' in request.FILES:
            obj.replace_file(request.FILES["letter"])

        obj.addToMedicalHistory= True if (request.POST.get("addToMedicalHistory")=="on") else False
        obj.save()

        newLabHistory = None
        newImagingHistory = None

        if 'lab' in request.FILES:
            oldLabHistory = LabHistory.objects.get(visitEntry=obj)
            if oldLabHistory:
                oldLabHistory.delete()
                newLabHistory = LabHistory.objects.create(
                    patient=user,
                    date=discharge_date,
                    report=request.FILES['lab'],
                    visitEntry=obj
                )
        if 'imaging' in request.FILES:
            oldImagingHistory = ImagingHistory.objects.get(visitEntry=obj)
            if oldImagingHistory:
                oldImagingHistory.delete()
                newImagingHistory = ImagingHistory.objects.create(
                    patient=user,
                    date=discharge_date,
                    report=request.FILES['imaging'],
                    visitEntry=obj
                )

        return Response({'ok': True, 'id': obj.id,
                         'labId': newLabHistory.id if newLabHistory else '',
                         'imagingId': newImagingHistory.id if newImagingHistory else ''
                         }, status=status.HTTP_200_OK)

@csrf_exempt
def verifyPatientCredentials(request):
    if request.method == "POST":
        user = matchPatientUser(request.POST['patientId'], request.POST['patientName'])
        if not user:
            return JsonResponse({'ok': False}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return JsonResponse({'ok': True, 'username': user.username}, status=status.HTTP_200_OK)

@csrf_exempt
def getPatientData(request):
    if request.method == "POST":
        user = matchPatientUser(request.POST['patientId'], request.POST['patientName'])
        if not user:
            return JsonResponse({'ok': False}, status=status.HTTP_400_BAD_REQUEST)
        if user:
            toHideIds = request.POST.getlist('toHideIds[]')
            data = getAllPatientDataById(request, user, toHideIds)
            return JsonResponse(data, status=status.HTTP_200_OK)


def matchPatientUser(patientId, patientName):
    try:
        patientUser = PatientUser.objects.get(patientId=patientId)
        if patientUser != None:
            user = patientUser.patient
            fullname = user.first_name + ' ' + user.last_name
            if patientName.lower().replace(" ", "") == fullname.lower().replace(" ", ""):
                return user
    except:
        return None

def getAllPatientDataById(request, user, toHideIds=[]):
    patientUser = PatientUser.objects.get(patient=user.id)
    medicalHistories = MedicalHistory.objects.filter(patient=user.id).exclude(id__in=toHideIds)
    labHistories = LabHistory.objects.filter(patient=user.id)
    imagingHistories = ImagingHistory.objects.filter(patient=user.id)
    imagingUploads = ImagingUpload.objects
    currentMedication = Medication.objects.filter(patient=user.id, status="current")
    previousMedication = Medication.objects.filter(patient=user.id, status="past")
    patientUserSerializer = PatientUserSerializer(patientUser, many=False)
    medicalHistorySerializer = MedicalHistorySerializer(medicalHistories,
                                                        context={"request": request},
                                                        many=True)
    labHistorySerializer = LabHistorySerializer(labHistories, 
                        context={"request": request}, many=True)
    imagingHistorySerializer = ImagingHistorySerializer(imagingHistories, 
                        context={"request": request}, many=True)
    imagingUploadSerializer = ImagingUploadSerializer(imagingUploads, 
                        context={"request": request}, many=True)
    currentMedicationSerializer = MedicationSerializer(currentMedication, many=True)
    previousMedicationSerializer = MedicationSerializer(previousMedication, many=True)

    sessionID = request.session.session_key
    return {
        'ok': True,
        'sessionId': sessionID,
        'patient-id': patientUser.patientId,
        'patient-name-small': user.first_name.lower().replace(" ", "") + user.last_name.lower().replace(" ", ""),
        'patient-first-name': user.first_name,
        'patient-last-name': user.last_name,
        'patient-dob': patientUserSerializer.data["patientBirthdate"],
        'patient-address': patientUserSerializer.data["patientAddress"],
        'medical-history': medicalHistorySerializer.data,
        'lab-history': labHistorySerializer.data,
        'imaging-history': imagingHistorySerializer.data,
        'imaging-uploads': imagingUploadSerializer.data,
        'current-medication': currentMedicationSerializer.data,
        'previous-medication': previousMedicationSerializer.data,
        'diary-info': getDiaryData(user)
    }

def getDiaryData(user):
    diaryClass = DiaryClass.objects.filter(patient=user.id)
    dict = {}
    for className in diaryClass:
        entries = Diary.objects.filter(diaryClass=className)
        dict[className.contentType] = DiarySerializer(entries, many=True).data
    return dict

@csrf_exempt
def addMedicalHistory(request):
    if request.method == "POST":
        user = matchPatientUser(request.POST['patientID'], request.POST['patientName']) 
        MedicalHistory.objects.create(patient=user, 
                                      admissionDate=request.POST['entryAdmissionDate'], 
                                      dischargeDate=request.POST['entryDischargeDate'], 
                                      summary=request.POST['entrySummary'],
                                      consultant=request.POST['entryConsultant'],
                                      visitType=request.POST['entryVisitType'],
                                      letter=request.POST['entryLetter'])
        medicalHistories = MedicalHistory.objects.filter(patient=user.id)
        medicalHistorySerializer = MedicalHistorySerializer(medicalHistories,
                                                        context={"request": request}, 
                                                        many=True)
        return JsonResponse({'ok': True,
                             'medical-history': medicalHistorySerializer.data},
                               status=status.HTTP_201_CREATED)
    
@csrf_exempt
def addMedication(request):
    if request.method == "POST":
        user = matchPatientUser(request.POST['patientID'], request.POST['patientName'])
        # obj = Medication.objects.create(patient=user, 
        #                             drug=request.POST['medicationDrug'], 
        #                             dosage=request.POST['medicationDosage'], 
        #                             startDate=request.POST['medicationStartDate'], 
        #                             endDate=request.POST['medicationEndDate'], 
        #                             duration=request.POST['medicationDuration'], 
        #                             route=request.POST['medicationRoute'],
        #                             comments=request.POST['medicationComment'])
        currentMedication = Medication.objects.filter(patient=user.id, status="current")
        currentMedicationSerializer = MedicationSerializer(currentMedication, 
                                                        many=True)
        return JsonResponse({'ok': True,
                            #  'objID': obj.id,
                             'medication': currentMedicationSerializer.data},
                               status=status.HTTP_201_CREATED)


@csrf_exempt
def updateMedication(request):
    if request.method == "POST":
        json_data = json.loads(request.body)
        user = matchPatientUser(json_data['patientId'], json_data['patientName'])
        for deleted_medication in json_data["deleteIds"]:
            my_object = Medication.objects.get(id=deleted_medication['medicationID'])
            my_object.status = "past"
            my_object.endDate = date.today()
            my_object.comments = deleted_medication['medicationComments']
            my_object.save()

        for added_medication in json_data["addedItems"]:
            obj = Medication.objects.create(patient=user, 
                            drug=added_medication['medicationDrug'], 
                            dosage=added_medication['medicationDosage'], 
                            startDate=added_medication['medicationStartDate'], 
                            endDate=added_medication['medicationEndDate'], 
                            duration=added_medication['medicationDuration'], 
                            route=added_medication['medicationRoute'],
                            comments=added_medication['medicationComments'])

        
        for new_medication in json_data["editItems"]:
            my_object = Medication.objects.get(id=new_medication['medicationID'])
            my_object.status = "past"
            my_object.endDate = date.today()
            my_object.save()
            Medication.objects.create(patient=user, 
                                        drug=new_medication['medicationDrug'], 
                                        dosage=new_medication['medicationDosage'], 
                                        startDate=new_medication['medicationStartDate'], 
                                        endDate=new_medication['medicationEndDate'], 
                                        duration=new_medication['medicationDuration'], 
                                        route=new_medication['medicationRoute'],
                                        comments=new_medication['medicationComments'])
        currentMedication = Medication.objects.filter(patient=user.id, status="current")
        currentMedicationSerializer = MedicationSerializer(currentMedication, 
                                                        many=True)
        previousMedication = Medication.objects.filter(patient=user.id, status="past")
        previousMedicationSerializer = MedicationSerializer(previousMedication, 
                                                        many=True)
        return JsonResponse({'ok': True,
                             'current-medication': currentMedicationSerializer.data,
                             'previous-medication': previousMedicationSerializer.data},
                               status=status.HTTP_201_CREATED)

def calculate_age(birthdate):
    # Get the current date
    current_date = date.today()

    # Calculate the age
    age = current_date.year - birthdate.year

    # Adjust the age if the birthday hasn't occurred yet this year
    if (current_date.month, current_date.day) < (birthdate.month, birthdate.day):
        age -= 1

    return age

@csrf_exempt
def addVisit(request):
    if request.method == "POST":
        form = AddVisitForm(request.POST, request.FILES or None)
        if form.is_valid():
            patientId = request.POST.get("patientId");
            patientName = request.POST.get("patientName");
            user = matchPatientUser(patientId, patientName)
            print(request.POST)
            print(user)
            visit = MedicalHistory.objects.create(
                patient=user,
                admissionDate=request.POST.get("admissionDate"),
                dischargeDate=request.POST.get("dischargeDate"),
                summary = request.POST.get("summary"),
                consultant = "John Lee",
                visitType = request.POST.get("visitType"),
                letter=request.FILES["letter"] if 'letter' in request.FILES else False,
                addToMedicalHistory= request.POST.get("addToMedicalHistory")=="on"
            )

            request.session["visit-created"] = True
            request.session["id"] = str(visit.id)
            request.session["admissionDate"] = visit.admissionDate
            request.session["dischargeDate"] = visit.dischargeDate
            request.session["consultant"] = visit.consultant
            request.session["summary"] = visit.summary
            request.session["visitType"] = visit.visitType
            request.session["letter"] = visit.letter.url if 'letter' in request.FILES else False
            request.session["addToMedicalHistory"] = visit.addToMedicalHistory

            return redirect(f"{BASE_URL}visit/")
    else:
        form = AddVisitForm()
        # print("add visit")
        return render(request, "patientOnCall/add-visit.html", {'form': form})


@csrf_exempt
def readDiaryEntry(request):
    if request.method == "POST":
        diary_entry = Diary.objects.get(id=request.POST['diaryId'])
        if diary_entry.readByDoctor == False:
            diary_entry.readByDoctor = True
            diary_entry.save()
        diarySerializer = DiarySerializer(diary_entry, many=False)
        return JsonResponse({'ok': True, 'diary-data': diarySerializer.data}, status=status.HTTP_200_OK)

@csrf_exempt
def addImaging(request):
    if request.method == "POST":
        # form = AddImagingForm(request.POST, request.FILES or None)
        form = ImagesUploadForm(request.POST, request.FILES or None)
        images = request.FILES.getlist('image')
        scanName = request.POST.get("scanType")
        if form.is_valid():
            patientId = request.POST.get("patientId");
            patientName = request.POST.get("patientName");
            user = matchPatientUser(patientId, patientName)
            imagingEntry = ImagingHistory.objects.create(
                patient=user,
                date=request.POST.get("date"),
                scanType=scanName,
                region = request.POST.get("region"),
                indication = request.POST.get("indication"),
                # visitType = request.POST.get("visitType"),
                report=request.FILES["report"] if 'report' in request.FILES else False,
                # visitEntry=request.POST.get("visitEntry")
            ) 
            currImages = []
            for i in images:
                imageUploads = ImagingUpload.objects.create(
                    imagingEntry=imagingEntry,
                    image=i
                )
                currImages.append(imageUploads.image.url)
            print(currImages)
            # print("is valid")
            request.session["scan-created"] = True
            request.session["id"] = str(imagingEntry.id)
            request.session["date"] = imagingEntry.date
            request.session["scanType"] = imagingEntry.scanType
            request.session["region"] = imagingEntry.region
            request.session["indication"] = imagingEntry.indication
            request.session["report"] = imagingEntry.report.url if 'report' in request.FILES else False
            request.session["image"] = currImages  
            # print(request.session)
            # tableURL = request.META.get('HTTP_ORIGIN') + '/scan-type/' + scanName
            # return HttpResponseRedirect(tableURL)
        if (scanName == "Medical Photography"):
            scanName = "Medical-Photography"
        
        return redirect(f"{BASE_URL}scan-type/"f"{scanName}")
            # return render_template(f"{BASE_URL}scan-type/{scanName}")
            # return render(request, "patientOnCall/scan-type/mri.html",{'scanType': scanName})
    else:
        # print("add visit")
        form = ImagesUploadForm()
        return render(request, "patientOnCall/add-imaging.html", {'form': form})

@csrf_exempt
def addImagingHistory(request):
    if request.method == "POST":
        user = matchPatientUser(request.POST['patientID'], request.POST['patientName']) 
        entry = ImagingHistory.objects.create(patient=user, 
                                      date=request.POST.get("date"),
                                      scanType=request.POST.get("scanType"),
                                      region = request.POST.get("region"),
                                      indication = request.POST.get("indication"),
                                      # visitType = request.POST.get("visitType"),
                                      report=request.FILES["report"] if 'report' in request.FILES else False)
                                      # visitEntry=request.POST.get("visitEntry"))
        imageList = addImagingUploads(request, entry)
        imagingHistories = ImagingHistory.objects.filter(patient=user.id)
        imagingHistorySerializer = ImagingHistorySerializer(imagingHistories,
                                                        context={"request": request},
                                                        many=True)
        return JsonResponse({'ok': True,
                             'imaging-history': imagingHistorySerializer.data,
                             'imaging-uploads': imageList},
                               status=status.HTTP_201_CREATED)
    
@csrf_exempt
def addImagingUploads(request, entry):
    if request.method == "POST":
        images = request.FILES.getlist('image')
        imageList = []
        for i in images:
            ImagingUpload.objects.create(
                                        image=i,
                                        imagingEntry=entry
                                        )
                                        # visitEntry=request.POST.get("visitEntry"))
            imagingUploads = ImagingUpload.objects.filter(imagingEntry=entry)
            imagingUploadSerializer = ImagingUploadSerializer(imagingUploads, 
                                                            many=True)
            imageList.append(imagingUploadSerializer.data)
        return imageList

def get_user_by_patientId(patientId):
            patientUser = PatientUser.objects.get(patientId=patientId)
            user = patientUser.patient
            return user

    
@csrf_exempt
def uploadLetter(request, id, visitID):
    visitEntry = MedicalHistory.objects.get(id=visitID)
    letterUpload = request.FILES["letter"] if 'letter' in request.FILES else False
    visitEntry.letter = letterUpload
    visitEntry.save()
    return render(request, 'patientOnCall/visit.html', {'visit':visitEntry})
    
@csrf_exempt
def uploadReport(request, scanType, id, imagingID):
    imagingEntry = ImagingHistory.objects.get(id=imagingID)
    reportUpload = request.FILES["report"] if 'report' in request.FILES else False
    imagingEntry.report = reportUpload
    imagingEntry.save()
    # return render(request, 'patientOnCall/imaging.html', {'imaging':imagingEntry})
    if (scanType == "Medical Photography"):
        scanType = "Medical-Photography"
    return redirect(f"{BASE_URL}scan-type/"f"{scanType}")

@csrf_exempt
def uploadImages(request, scanType, id, imagingID):
    # print("HIIII")
    # images = request.FILES.getlist('image')
    # print(request.FILES)
    imagingEntry = ImagingHistory.objects.get(id=imagingID)
    addImagingUploads(request, imagingEntry)
    # return render(request, 'patientOnCall/imaging.html', {'imaging':imagingEntry})
    return redirect(f"{BASE_URL}scan-type/"f"{scanType}")


@csrf_exempt
def addLab(request):
    if request.method == "POST":
        form = AddLabForm(request.POST, request.FILES or None)
        labName = request.POST.get("labType")
        if form.is_valid():
            patientId = request.POST.get("patientId")
            patientName = request.POST.get("patientName")
            user = matchPatientUser(patientId, patientName)
            labEntry = LabHistory.objects.create(
                patient=user,
                date=request.POST.get("date"),
                labType=labName,
                report=request.FILES["report"] if 'report' in request.FILES else False,
            )
            request.session["lab-created"] = True
            request.session["id"] = str(labEntry.id)
            request.session["date"] = labEntry.date
            request.session["labType"] = labEntry.labType
            request.session["report"] = labEntry.report.url if 'report' in request.FILES else False
        
        labName = convertLabName(labName)
        return redirect(f"{BASE_URL}lab-type/"f"{labName}")
        # return redirect(prevURL)
    else:
        form = AddLabForm()
        return render(request, "patientOnCall/add-lab.html", {'form': form})

@csrf_exempt
def addLabHistory(request):
    if request.method == "POST":
        user = matchPatientUser(request.POST['patientID'], request.POST['patientName']) 
        LabHistory.objects.create(patient=user, 
                                date=request.POST.get("date"),
                                scanType=request.POST.get("scanType"),
                                report=request.FILES["report"] if 'report' in request.FILES else False)
        labHistories = LabHistory.objects.filter(patient=user.id)
        labHistorySerializer = LabHistorySerializer(labHistories,
                                                        context={"request": request}, 
                                                        many=True)
        return JsonResponse({'ok': True,
                             'lab-history': labHistorySerializer.data},
                               status=status.HTTP_201_CREATED)

@csrf_exempt
def uploadLab(request, labType, id, labID):
    labEntry = LabHistory.objects.get(id=labID)
    reportUpload = request.FILES["report"] if 'report' in request.FILES else False
    labEntry.report = reportUpload
    labEntry.save()
    return redirect(f"{BASE_URL}lab-type/"f"{labType}")

def convertLabName(labName):
    if (labName == "Full Blood Count Report"):
        return "fbc"
    elif (labName == "Cancer Blood Test"): 
        return "cancer"
    elif (labName == "Electrolyte Test"): 
        return "electrolyte"
    elif (labName == "Genetic Test" ): 
        return "genetic"
    elif (labName == "Liver Function Test"): 
        return "liver" 
    elif (labName == "Thyroid Function Test"): 
        return "thyroid"

prevURL = ""

@csrf_exempt
def addVisitLab(request, visitID):
    global prevURL 
    if request.method == "POST":
        form = AddLabForm(request.POST, request.FILES or None)
        labName = request.POST.get("labType")
        if form.is_valid():
            patientId = request.POST.get("patientId");
            patientName = request.POST.get("patientName");
            user = matchPatientUser(patientId, patientName)
            labEntry = LabHistory.objects.create(
                patient=user,
                date=request.POST.get("date"),
                labType=labName,
                report=request.FILES["report"] if 'report' in request.FILES else False,
                visitEntry=MedicalHistory.objects.get(id=visitID)
            ) 
            request.session["lab-created"] = True
            request.session["id"] = str(labEntry.id)
            request.session["date"] = labEntry.date
            request.session["labType"] = labEntry.labType
            request.session["report"] = labEntry.report.url if 'report' in request.FILES else False
            request.session["visitEntry"] = visitID
        labName = convertLabName(labName)
        # print("prev" + prevURL)
        # prevPage = PurePosixPath(unquote(urlparse(prevURL).path)).parts[1]
        # print(prevPage)
        # if (prevPage == "edit-visit"):
        return redirect(prevURL)
        # return redirect(prevURL)
    else:

        form = AddLabForm()
        # print (request.META.get("HTTP_REFERER"))
        prevURL = request.META.get("HTTP_REFERER")
        # print("add visit")
        return render(request, "patientOnCall/add-lab.html", {'form': form})
    
@csrf_exempt
def addVisitImaging(request, visitID):
    global prevURL 
    if request.method == "POST":
        # form = AddImagingForm(request.POST, request.FILES or None)
        form = ImagesUploadForm(request.POST, request.FILES or None)
        images = request.FILES.getlist('image')
        scanName = request.POST.get("scanType")
        if form.is_valid():
            patientId = request.POST.get("patientId");
            patientName = request.POST.get("patientName");
            user = matchPatientUser(patientId, patientName)
            imagingEntry = ImagingHistory.objects.create(
                patient=user,
                date=request.POST.get("date"),
                scanType=scanName,
                region = request.POST.get("region"),
                indication = request.POST.get("indication"),
                # visitType = request.POST.get("visitType"),
                report=request.FILES["report"] if 'report' in request.FILES else False,
                visitEntry=MedicalHistory.objects.get(id=visitID)
            ) 
            currImages = []
            for i in images:
                imageUploads = ImagingUpload.objects.create(
                    imagingEntry=imagingEntry,
                    image=i
                )
                currImages.append(imageUploads.image.url)
            print(currImages)
            # print("is valid")
            request.session["scan-created"] = True
            request.session["id"] = str(imagingEntry.id)
            request.session["date"] = imagingEntry.date
            request.session["scanType"] = imagingEntry.scanType
            request.session["region"] = imagingEntry.region
            request.session["indication"] = imagingEntry.indication
            request.session["report"] = imagingEntry.report.url if 'report' in request.FILES else False
            request.session["image"] = currImages 
            request.session["visitEntry"] = visitID 
            # print(request.session)
            # tableURL = request.META.get('HTTP_ORIGIN') + '/scan-type/' + scanName
            # return HttpResponseRedirect(tableURL)
        if (scanName == "Medical Photography"):
            scanName = "Medical-Photography"
        
        # print(prevURL)
        # prevPage = PurePosixPath(unquote(urlparse(prevURL).path)).parts[1]
        # print(prevPage)
        # if (prevPage == "add-visit" or prevPage == "edit-visit"):
        return redirect(prevURL)
            # return render_template(f"{BASE_URL}scan-type/{scanName}")
            # return render(request, "patientOnCall/scan-type/mri.html",{'scanType': scanName})
    else:
        # form = AddImagingForm()
        form = ImagesUploadForm()
        print (request.META.get("HTTP_REFERER"))
        prevURL = request.META.get("HTTP_REFERER")
        # print("add visit")
        return render(request, "patientOnCall/add-imaging.html", {'form': form})
    
@csrf_exempt
def editVisit(request, visitID):
    if request.method == "POST":
        form = AddVisitForm(request.POST, request.FILES or None)
        if form.is_valid():
            visit = MedicalHistory.objects.get(id=visitID)
            print(visit)
            visit.admissionDate=request.POST.get("admissionDate")
            visit.dischargeDate=request.POST.get("dischargeDate")
            visit.summary = request.POST.get("summary")
            visit.consultant = "John Lee"
            visit.visitType = request.POST.get("visitType")
            visit.letter=request.FILES["letter"] if 'letter' in request.FILES else False
            visit.addToMedicalHistory= request.POST.get("addToMedicalHistory")=="on"
            visit.save()

            request.session["visit-edited"] = True
            request.session["id"] = str(visit.id)
            request.session["admissionDate"] = visit.admissionDate
            request.session["dischargeDate"] = visit.dischargeDate
            request.session["summary"] = visit.summary
            request.session["visitType"] = visit.visitType
            request.session["letter"] = visit.letter.url if 'letter' in request.FILES else False
            request.session["addToMedicalHistory"] = visit.addToMedicalHistory

            return redirect(f"{BASE_URL}edit-visit/"f"{visitID}")
    else:
        form = AddVisitForm()
        # print("add visit")
        return render(request, "patientOnCall/edit-visit-view.html", {'form': form})