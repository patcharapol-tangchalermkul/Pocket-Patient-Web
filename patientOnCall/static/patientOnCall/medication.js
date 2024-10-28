var base_url = window.location.origin;

(function() {  
    const firstName = sessionStorage.getItem("patientFirstName")
    const lastName = sessionStorage.getItem("patientLastName")
    const patientID = sessionStorage.getItem("patientID")
    const currentMedication = JSON.parse(sessionStorage.getItem("currentMedication"))
    const previousMedication = JSON.parse(sessionStorage.getItem("previousMedication"))

    document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
    document.getElementById("patient-id").innerHTML = 'NHS Number:' + patientID

    insertMedication(currentMedication, true);
    insertMedication(previousMedication, false);
})();


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

document.getElementById("edit-medication").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = base_url + "/edit-medication"
  })

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

function udpateMedicationDetails(newMedicationData) {
  $(".info-table-item").each(function () {
    if ($(this).attr("medication-id") == newMedicationData["id"]) {
      if ($(this).hasClass("drug-info-item")) { $(this).text(newMedicationData["drug"]) }
      else if ($(this).hasClass("dosage-info-item")) { $(this).text(newMedicationData["dosage"]) }
      else if ($(this).hasClass("start-date-info-item")) { $(this).text(newMedicationData["startDate"]) }
      else if ($(this).hasClass("end-date-info-item")) { $(this).text(newMedicationData["endDate"]) }
      else if ($(this).hasClass("duration-info-item")) { $(this).text(newMedicationData["duration"]) }
      else if ($(this).hasClass("route-info-item")) { $(this).text(newMedicationData["route"]) }
      else if ($(this).hasClass("comments-info-item")) { $(this).text(newMedicationData["comments"]) };
    }
  })
}