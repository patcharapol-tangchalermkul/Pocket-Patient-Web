var base_url = window.location.origin;


(function() {
  
    const firstName = sessionStorage.getItem("patientFirstName")
    const lastName = sessionStorage.getItem("patientLastName")
    const patientID = sessionStorage.getItem("patientID")
    const dob = sessionStorage.getItem("patientDob")
    const address = sessionStorage.getItem("patientAddress")
    const labHistory = JSON.parse(sessionStorage.getItem("labHistory"))
    const medicalHistory = JSON.parse(sessionStorage.getItem("medicalHistory"))
    const currentMedication = JSON.parse(sessionStorage.getItem("currentMedication"))

    document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
    document.getElementById("patient-id").innerHTML = 'NHS Number: ' + patientID
    // document.getElementById("patient-age").innerHTML 
    //   = "Date of Birth: " + dob
    // document.getElementById("patient-address").innerHTML 
    //   = "Address: " + address

    insertMedHistoryEntries(medicalHistory);
    for(var i = 1; i <= medicalHistory.length; i ++) {
        row_hover(i, medicalHistory[i-1]["visitType"]);
        row_click(i, medicalHistory[i-1]["id"]);
    }

    insertMedication(currentMedication, true);

})();

function insertMedHistoryEntries(medicalHistory) {
  var i = 0
  while (i < medicalHistory.length) {
    console.log(medicalHistory[i])
      addMedHistoryEntry(i+1, 
      medicalHistory[i]["dischargeDate"],
       medicalHistory[i]["summary"],
       medicalHistory[i]["addToMedicalHistory"])
      i++;
  }
}

function addMedHistoryEntry(rowNum, dischargeDate, summary, addToMedicalHistory) {
    // Create a new entry for the table
    var tableBody = document.getElementById("past-medical-history-entries");
    var row = "row-" + rowNum
    if ((addToMedicalHistory === "True" || addToMedicalHistory === true) && summary !== ""){
        const newEntry = document.createElement("li");
        newEntry.classList.add("past-medical-history-entry", "p-1", "d-flex", 
            "flex-row", "w-100", "mb-2", "rounded-3", "border", "text-black-50")
        newEntry.classList.add(row)
        const entryDischargeDate = document.createElement("div");
        entryDischargeDate.classList.add("past-medical-history-discharge-date");
        entryDischargeDate.textContent = dischargeDate;
    
        const entrySummary = document.createElement("div");
        entrySummary.classList.add("past-medical-history-summary", "flex-grow-1");
        entrySummary.textContent = summary;
    
        newEntry.appendChild(entryDischargeDate);
        newEntry.appendChild(entrySummary);
        
        tableBody.appendChild(newEntry);

        console.log(tableBody);
    }
}

function row_hover(rowNum, visitType){
    var rowClass = 'row-' + rowNum 
    var row = document.getElementsByClassName(rowClass);
    var n = row.length;
    function changeColor(color){
        for(var i = 0; i < n; i++) {
            row[i].style.backgroundColor = color; 
        }
    }
    for(var i = 0; i < n; i ++) {
        row[i].onmouseover = function() {
            changeColor("#A1DADE");
        };
        row[i].onmouseout = function() {
            changeColor("");
        };   
    }
}

function row_click(rowNum, id){
    var rowClass = 'row-' + rowNum 
    var row = document.getElementsByClassName(rowClass);
    var n = row.length;
    for(var i = 0; i < n; i ++) {
        row[i].onclick = function() {
            window.location.href = base_url + "/edit-visit/" + id
        };
    }
}

function insertMedication(medication, isCurrent) {
    var i = 0
    while (i < medication.length) {    
        addMedication(isCurrent,
          medication[i]["id"],           
          medication[i]["drug"], 
          medication[i]["dosage"], 
          medication[i]["startDate"], 
          medication[i]["endDate"], 
          medication[i]["duration"], 
          medication[i]["route"],
          medication[i]["comments"],
          medication[i]["byPatient"]
        )
        i++;
    }
  }
  
  function addMedication(isCurrent, id, drug, dosage, startDate, endDate, duration, route, comments, byPatient) {
      // Create a new entry for the table
      let tableBody;
      if (isCurrent) {
        tableBody = document.getElementById("main-current-medication-box-table");
      }
      else {
        tableBody = document.getElementById("main-previous-medication-box-table");    
      }
  
      const medicationDrug = document.createElement("div");
      medicationDrug.classList.add("info-table-item", "drug-info-item");
      medicationDrug.setAttribute("id", id + '-drug');
      medicationDrug.setAttribute("medication-id", id);
      medicationDrug.textContent = drug;
  
      const medicationDosage = document.createElement("div");
      medicationDosage.classList.add("info-table-item", "dosage-info-item");
      medicationDosage.setAttribute("id", id + '-dosage');
      medicationDosage.setAttribute("medication-id", id);
      medicationDosage.textContent = dosage;
  
      const medicationStartDate = document.createElement("div");
      medicationStartDate.classList.add("info-table-item", "start-date-info-item");
      medicationStartDate.setAttribute("id", id + '-start-date');
      medicationStartDate.setAttribute("medication-id", id);
      medicationStartDate.textContent = startDate;
  
      const medicationEndDate = document.createElement("div");
      medicationEndDate.classList.add("info-table-item", "end-date-info-item");
      medicationEndDate.setAttribute("id", id + '-end-date');
      medicationEndDate.setAttribute("medication-id", id);
      medicationEndDate.textContent = endDate;
  
      const medicationDuration = document.createElement("div");
      medicationDuration.classList.add("info-table-item", "duration-info-item");
      medicationDuration.setAttribute("id", id + '-duration');
      medicationDuration.setAttribute("medication-id", id);
      medicationDuration.textContent = duration;
  
  
      const medicationRoute = document.createElement("div");
      medicationRoute.classList.add("info-table-item", "route-info-item");
      medicationRoute.setAttribute("id", id + '-route');
      medicationRoute.setAttribute("medication-id", id);
      medicationRoute.textContent = route;
  
      const medicationComments = document.createElement("div");
      medicationComments.classList.add("info-table-item", "comments-info-item");
      medicationComments.setAttribute("id", id + '-comments');
      medicationComments.setAttribute("medication-id", id);
      medicationComments.textContent = comments;
  
      const medicationByPatient = document.createElement("div");
      medicationByPatient.classList.add("info-table-item", "by-patient-info-item");
      medicationByPatient.setAttribute("id", id + '-owner');
      medicationByPatient.setAttribute("medication-id", id);
      const medicationByPatientChild = document.createElement("div");
      if (byPatient == true) {
        medicationByPatientChild.textContent = "Patient";
        medicationByPatientChild.classList.add("by-patient")
      } else {
        medicationByPatientChild.textContent = "Doctor";
        medicationByPatientChild.classList.add("by-doctor")
      }
      medicationByPatient.appendChild(medicationByPatientChild);
  
      tableBody.appendChild(medicationDrug);
      tableBody.appendChild(medicationDosage);
      tableBody.appendChild(medicationStartDate);
      tableBody.appendChild(medicationEndDate);
      tableBody.appendChild(medicationDuration);
      tableBody.appendChild(medicationRoute);
      tableBody.appendChild(medicationComments);
      tableBody.appendChild(medicationByPatient);
  }
  
function getNextMedicationId(medId, currMedication) {
    let i = 0;
    while (i < currMedication.length) {
      console.log("iterating")
      console.log(currMedication)
      if (currMedication[i]["id"] == medId) {
        console.log(i == currMedication.length - 1 ? null : currMedication[i + 1]["id"])
        return i == currMedication.length - 1 ? null : currMedication[i + 1]["id"]
      }
      i++
    }
    return null
  }
  
  function insertNewMedBeforeMedWithId(nextMedId, isCurrent, id, drug, dosage, startDate, endDate, duration, route, comments, byPatient) {
    console.log("inserting before...");
    let tableBody;
      if (isCurrent) {
        tableBody = document.getElementById("main-current-medication-box-table");
      }
      else {
        tableBody = document.getElementById("main-previous-medication-box-table");    
      }
    
      const medicationDrug = document.createElement("div");
      medicationDrug.classList.add("info-table-item", "drug-info-item");
      medicationDrug.setAttribute("id", id + '-drug');
      medicationDrug.setAttribute("medication-id", id);
      medicationDrug.textContent = drug;
  
      const medicationDosage = document.createElement("div");
      medicationDosage.classList.add("info-table-item", "dosage-info-item");
      medicationDosage.setAttribute("id", id + '-dosage');
      medicationDosage.setAttribute("medication-id", id);
      medicationDosage.textContent = dosage;
  
      const medicationStartDate = document.createElement("div");
      medicationStartDate.classList.add("info-table-item", "start-date-info-item");
      medicationStartDate.setAttribute("id", id + '-start-date');
      medicationStartDate.setAttribute("medication-id", id);
      medicationStartDate.textContent = startDate;
  
      const medicationEndDate = document.createElement("div");
      medicationEndDate.classList.add("info-table-item", "end-date-info-item");
      medicationEndDate.setAttribute("id", id + '-end-date');
      medicationEndDate.setAttribute("medication-id", id);
      medicationEndDate.textContent = endDate;
  
      const medicationDuration = document.createElement("div");
      medicationDuration.classList.add("info-table-item", "duration-info-item");
      medicationDuration.setAttribute("id", id + '-duration');
      medicationDuration.setAttribute("medication-id", id);
      medicationDuration.textContent = duration;
  
  
      const medicationRoute = document.createElement("div");
      medicationRoute.classList.add("info-table-item", "route-info-item");
      medicationRoute.setAttribute("id", id + '-route');
      medicationRoute.setAttribute("medication-id", id);
      medicationRoute.textContent = route;
  
      const medicationComments = document.createElement("div");
      medicationComments.classList.add("info-table-item", "comments-info-item");
      medicationComments.setAttribute("id", id + '-comments');
      medicationComments.setAttribute("medication-id", id);
      medicationComments.textContent = comments;
  
      const medicationByPatient = document.createElement("div");
      medicationByPatient.classList.add("info-table-item", "by-patient-info-item");
      medicationByPatient.setAttribute("id", id + '-owner');
      medicationByPatient.setAttribute("medication-id", id);
      const medicationByPatientChild = document.createElement("div");
      if (byPatient == true) {
        medicationByPatientChild.textContent = "Patient";
        medicationByPatientChild.classList.add("by-patient")
      } else {
        medicationByPatientChild.textContent = "Doctor";
        medicationByPatientChild.classList.add("by-doctor")
      }
      medicationByPatient.appendChild(medicationByPatientChild);
  
      $(".drug-info-item").each(function () {
        if ($(this).attr("medication-id") == nextMedId) {
          $(this).before(medicationDrug);
          $(this).before(medicationDosage);
          $(this).before(medicationStartDate);
          $(this).before(medicationEndDate);
          $(this).before(medicationDuration);
          $(this).before(medicationRoute);
          $(this).before(medicationComments);
          $(this).before(medicationByPatient);
        }
      })
  }