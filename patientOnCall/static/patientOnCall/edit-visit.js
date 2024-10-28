var base_url = window.location.origin;

(function() {
    const firstName = sessionStorage.getItem("patientFirstName")
    const lastName = sessionStorage.getItem("patientLastName")
    const id = sessionStorage.getItem("patientID")
    
    document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
    document.getElementById("patient-id").innerHTML = 'NHS Number:' + id

    visitID = window.location.href.split('/')[4]
    // console.log(visitID)
    getVisitEntry(visitID)

    updateNewLabInWebsocket(visitID);
})();

function getVisitEntry(id) {
    const medicalHistory = JSON.parse(sessionStorage.getItem("medicalHistory"))
    const labHistory = JSON.parse(sessionStorage.getItem("labHistory"))
    const imagingHistory = JSON.parse(sessionStorage.getItem("imagingHistory"))
    var entryNum = ""
    for(var i = 0; i < medicalHistory.length; i ++) {
        // console.log(medicalHistory[i]["id"]===id)
        if (medicalHistory[i]["id"]===id){
            // console.log("row found")
            entryNum = i 
            break; 
        }
    }

    const admissionDate = medicalHistory[entryNum]["admissionDate"]
    const dischargeDate = medicalHistory[entryNum]["dischargeDate"]
    const consultant = medicalHistory[entryNum]["consultant"]
    const visitType = medicalHistory[entryNum]["visitType"]
    const summary = medicalHistory[entryNum]["summary"]
    const letter = medicalHistory[entryNum]["letter"]
    const addToMedicalHistory = medicalHistory[entryNum]["addToMedicalHistory"]

    // console.log(window.location.href + 'edit-view/' + id)
    document.getElementById("edit-button").href = window.location.href + 'edit-view/'  
    
    $(".section-header").html("Visit Entry: " + admissionDate)
    // document.getElementById("visit-title").innerHTML = "Visit Entry:" + admissionDate  
    document.getElementById("entry-visit-type").innerHTML = visitType
    // document.getElementById("entry-admission-date").innerHTML = admissionDate
    // document.getElementById("entry-discharge-date").innerHTML = dischargeDate
    
    if (visitType == "GP Consultation" || visitType == "Hospital Clinic"){
      document.getElementById("admission-date-label").innerHTML = 'Date:'; 
      document.getElementById("entry-admission-date").innerHTML = admissionDate
      document.getElementById("discharge-date-wrapper").style.display = 'none'; 
    } else { 
        document.getElementById("entry-admission-date").innerHTML = admissionDate
        document.getElementById("discharge-date-wrapper").style.display = 'block'; 
        document.getElementById("entry-discharge-date").innerHTML = dischargeDate
    }
  
    document.getElementById("entry-summary").innerHTML = summary;

    document.getElementById("entry-consultant").innerHTML = consultant;
    
    
    const uploadURL = 'upload-letter/' + id
    // console.log(uploadURL)
    const letterForm = document.getElementById("upload-letter-form")
    letterForm.setAttribute('action',uploadURL)
    const entryLetter = document.getElementById("entry-letter")
    
    console.log(letter)
    if  (letter === "False" || letter === '/media/False' || letter === base_url + '/media/False') {
        $("#upload-letter-form").submit(function(eventObj) {
            var letterUpload = $('#letter-upload').val().replace(/C:\\fakepath\\/, '/media/letterattachments/');
            // console.log(letterUpload)
            medicalHistory[entryNum]["letter"] = letterUpload
            // console.log(medicalHistory[entryNum]["letter"])
            sessionStorage.setItem("medicalHistory",JSON.stringify(medicalHistory))
            return true; 
        });       
    } else {
        letterForm.remove()
        const entryLetterLink = document.createElement("a");
        if (visitType == "GP Consultation") {
            entryLetterLink.textContent = "GP Letter";
        }
        else {
            entryLetterLink.textContent = "Discharge Letter";
        }
        entryLetterLink.href = letter
        entryLetter.append(entryLetterLink)
    } 
    
    console.log(addToMedicalHistory)
    if (addToMedicalHistory === "True" || addToMedicalHistory === true) {
        document.getElementById("entry-add-to-medical-history").checked = true
    } else {
        document.getElementById("entry-add-to-medical-history").checked = false
    }

    const addLabURL = 'add-lab/' + id
    // console.log(addLabURL)
    
    document.getElementById("add-lab").onclick = function() {
            window.location.href = base_url + "/add-lab/" + id
    };

    for(var i = 0; i < labHistory.length; i ++) {
        if (labHistory[i]["visitEntry"] === id) {
            const labType = labHistory[i]["labType"]
            var labEntry = labType + "-" + (i+1)  
            // console.log(labEntry)
            const labName = document.createElement("p");
            labName.innerHTML = labType + ':'
            labEntry = document.createElement("a"); 
            labEntry.href = labHistory[i]["report"]
            const labLink = labHistory[i]["report"].replace(base_url+'/media/labattachments/', '') + '\n'
            labEntry.innerText = labLink.replace('/media/labattachments/', '') + '\n'
            document.getElementById("entry-lab-histories").appendChild(labName)
            document.getElementById("entry-lab-histories").appendChild(labEntry) 
        }
    }

    document.getElementById("add-imaging").onclick = function() {
        window.location.href = base_url + "/add-imaging/" + id
    };

    for(var i = 0; i < imagingHistory.length; i ++) {
        if (imagingHistory[i]["visitEntry"] === id) {
            const scanType = imagingHistory[i]["scanType"]
            const region = imagingHistory[i]["region"]
            var imagingEntry = scanType + "-" + (i+1)  
            const scanName = document.createElement("p");
            scanName.innerHTML = scanType + '(' + region + '):'
            imagingEntry = document.createElement("a"); 
            imagingEntry.href = imagingHistory[i]["report"]
            const scanLink = imagingHistory[i]["report"].replace(base_url+'/media/imagingreports/', '') + '\n'
            imagingEntry.innerText = scanLink.replace('/media/imagingreports/', '') + '\n'
            document.getElementById("entry-imaging-histories").appendChild(scanName)
            document.getElementById("entry-imaging-histories").appendChild(imagingEntry) 
        }
    }
}

function updateNewLabInWebsocket(visitID) {
    console.log(isLabCreated);
    if (isLabCreated && websocket) {
        if (websocket.readyState == websocket.OPEN) {
            const id = sessionStorage.getItem("patientID")
            let newLabHistory = {}
            newLabHistory["id"] = newLabId;
            newLabHistory["date"] = newLabDate;
            newLabHistory["labType"] = newLabType;
            newLabHistory["report"] = newLabReport;
            newLabHistory["visitEntry"] = newLabVisitEntry;
            websocket.send(JSON.stringify({
                "event": "EDIT_HOSP_VISIT_ENTRY",
                "patientId": id,
                // "doctor_update": true,
                "mhId": visitID,
                "new_lab_history": newLabHistory
            }));       
        } else {
            setTimeout(() => {
                updateNewLabInWebsocket(visitID);
            }, 500);
        }
    }
    
    if (isScanCreated && websocket) {
        if (websocket.readyState == websocket.OPEN) {
            const id = sessionStorage.getItem("patientID")
            let newImagingHistory = {}
            newImagingHistory["id"] = newImagingHistoryId;
            newImagingHistory["date"] = newImagingHistoryDate;
            newImagingHistory["scanType"] = newImagingHistoryScanType;
            newImagingHistory["region"] = newImagingHistoryRegion;
            newImagingHistory["indication"] = newImagingHistoryIndication;
            newImagingHistory["report"] = newImagingHistoryReport;
            newImagingHistory["visitEntry"] = newImagingHistoryVisitEntry;
            websocket.send(JSON.stringify({
                "event": "EDIT_HOSP_VISIT_ENTRY",
                "patientId": id,
                // "doctor_update": true,
                "mhId": visitID,
                "new_imaging_history": newImagingHistory
            }));       
        } else {
            setTimeout(() => {
                updateNewLabInWebsocket(visitID);
            }, 500);
        }
    }
}


