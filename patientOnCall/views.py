from django.shortcuts import render
from django.http import HttpResponse
from patientoncall_api.forms import AddVisitForm

def index(request):
    return render(request, 'patientOnCall/index.html')

def displayInfo(request):
    return render(request, 'patientOnCall/info.html')

def displayMedication(request):
    return render(request, 'patientOnCall/medication.html')

def displayVisit(request):
    context = {}
    if ("visit-created" in request.session and request.session["visit-created"] == True):
        context = {'visitCreated': True, 
                    'id': request.session["id"],
                    'admissionDate': request.session["admissionDate"],
                    'dischargeDate': request.session["dischargeDate"],
                    'consultant': request.session["consultant"],
                    'summary': request.session["summary"],
                    'visitType': request.session["visitType"], 
                    'letter': request.session["letter"], 
                    'addToMedicalHistory': request.session["addToMedicalHistory"] }
        request.session["visit-created"] = False
        request.session["id"] = ""
        request.session["admissionDate"] = None
        request.session["dischargeDate"] = None
        request.session["consultant"] = None
        request.session["summary"] = None
        request.session["visitType"] = None
        request.session["letter"] = None
        request.session["addToMedicalHistory"] = None
    return render(request, 'patientOnCall/visit.html', context=context)

def displayAddVisit(request):
    return render(request, 'patientOnCall/add-visit.html')

def displayEditVisit(request, visitID):
    context = {}
    if ("lab-created" in request.session and request.session["lab-created"] == True):
        context = {'labCreated': True, 
                    'id': request.session["id"],
                    'date': request.session["date"],
                    'labType': request.session["labType"],
                    'report': request.session["report"],
                    'visitEntry': request.session["visitEntry"]} 
        print(context)
        request.session["lab-created"] = False
        request.session["id"] = ""
        request.session["date"] = None
        request.session["labType"] = None
        request.session["report"] = None
        request.session["visitEntry"] = None
    elif ("scan-created" in request.session and request.session["scan-created"] == True):
        context = {'scanCreated': True, 
                    'id': request.session["id"],
                    'date': request.session["date"],
                    'scanType': request.session["scanType"],
                    'region': request.session["region"],
                    'indication': request.session["indication"], 
                    'report': request.session["report"],
                    'image': request.session["image"],
                    'visitEntry': request.session["visitEntry"]} 
        print(context)
        request.session["scan-created"] = False
        request.session["id"] = ""
        request.session["date"] = None
        request.session["scanType"] = None
        request.session["region"] = None
        request.session["indication"] = None
        request.session["report"] = None
        request.session["image"] = None
        request.session["visitEntry"] = None
    elif ("visit-edited" in request.session and request.session["visit-edited"] == True):
        context = {'visitEdited': True, 
                    'id': request.session["id"],
                    'admissionDate': request.session["admissionDate"],
                    'dischargeDate': request.session["dischargeDate"],
                    'summary': request.session["summary"],
                    'visitType': request.session["visitType"], 
                    'letter': request.session["letter"], 
                    'addToMedicalHistory': request.session["addToMedicalHistory"] }
        request.session["visit-edited"] = False
        request.session["id"] = ""
        request.session["admissionDate"] = None
        request.session["dischargeDate"] = None
        request.session["summary"] = None
        request.session["visitType"] = None
        request.session["letter"] = None
        request.session["addToMedicalHistory"] = None
    return render(request, 'patientOnCall/edit-visit.html', context=context)

def newMedication(request):
    return render(request, 'patientOnCall/edit-medication.html')

def addMedication(request):
    return render(request, 'patientOnCall/add-medication.html')

def displayLabHistory(request):
    return render(request, 'patientOnCall/lab-history.html')

def patientDiary(request):
    return render(request, 'patientOnCall/patient-diary.html')

def patientDiaryCategories(request):
    return render(request, 'patientOnCall/patient-diary-categories.html')

def readDiaryEntry(request):
    return render(request, 'patientOnCall/patient-diary-entry.html')

def displayImaging(request):
    return render(request, 'patientOnCall/imaging.html')

def displayScanType(request, id):
    context = {}
    # print(request.session)
    if ("scan-created" in request.session and request.session["scan-created"] == True):
        context = {'scanCreated': True, 
                    'id': request.session["id"],
                    'date': request.session["date"],
                    'scanType': request.session["scanType"],
                    'region': request.session["region"],
                    'indication': request.session["indication"], 
                    'report': request.session["report"],
                    'image': request.session["image"]} 
        print(context)
        request.session["scan-created"] = False
        request.session["id"] = ""
        request.session["date"] = None
        request.session["scanType"] = None
        request.session["region"] = None
        request.session["indication"] = None
        request.session["report"] = None
        request.session["image"] = None
    return render(request, 'patientOnCall/scan-type.html', context=context)

def displayEditScan(request, scanType, id):
    return render(request, 'patientOnCall/edit-scan.html')

def displayLabType(request, id):
    context = {}
    print(request.session)
    if ("lab-created" in request.session and request.session["lab-created"] == True):
        context = {'labCreated': True, 
                    'id': request.session["id"],
                    'date': request.session["date"],
                    'labType': request.session["labType"],
                    'report': request.session["report"]} 
        print(context)
        request.session["lab-created"] = False
        request.session["id"] = ""
        request.session["date"] = None
        request.session["labType"] = None
        request.session["report"] = None
    return render(request, 'patientOnCall/lab-type.html', context=context)

def displayEditLab(request, labType, id):
    return render(request, 'patientOnCall/edit-lab.html')
