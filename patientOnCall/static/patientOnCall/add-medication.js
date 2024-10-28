document.getElementById("medication-submit").addEventListener("click", (e) => {
    e.preventDefault();

    let drug = document.getElementById("medication-drug").value;
    let dosage = document.getElementById("medication-dosage").value;
    let startDate = document.getElementById("medication-start-date").value;
    let durationNum = document.getElementById("medication-duration-num").value;
    let durationUnit = document.getElementById("medication-duration-unit").value;
    let endDate = addTime(startDate, parseInt(durationNum), durationUnit);
    let duration = `${durationNum} ${durationUnit}`;
    let route = document.getElementById("medication-route").value;
    let comment = document.getElementById("medication-comment").value;

    const firstName = sessionStorage.getItem("patientFirstName")
    const lastName = sessionStorage.getItem("patientLastName")

    //compare to database
    // $.ajax({
    //   type: "POST",
    //   url: base_url + "/api/doctor/patient-data/medication/",
    //   data: {
    //     'patientID': sessionStorage.getItem("patientID"),
    //     'patientName': firstName + ' ' + lastName,
    //     'medicationDrug': drug, 
    //     'medicationDosage': dosage, 
    //     'medicationStartDate': startDate, 
    //     'medicationEndDate': endDate, 
    //     'medicationDuration': duration, 
    //     'medicationRoute': route,
    //     'medicationComment': comment
    //   },
    //   success: function (returned_value) {
    //     if (returned_value.ok == true) {
    //       const currentMedication = returned_value["medication"];
    //       sessionStorage.setItem("currentMedication", JSON.stringify(currentMedication));
    const currentDict = JSON.parse(sessionStorage.getItem("medicationDict"));
          // console.log(sessionStorage.getItem("medicationDict"))
    addHash(currentDict, Object.keys(currentDict).length, "0", drug, dosage, startDate, endDate, duration, route, "added", comment, false);
    sessionStorage.setItem("medicationDict", JSON.stringify(currentDict));
          // console.log(currentDict);
    window.location.href = "/edit-medication"
    //     }
    //   },
    //   error: function () { }
    // });
  })

  
function addTime(dateStr, num, unit) {
    const dateParts = dateStr.split('-');
    var day = parseInt(dateParts[2], 10);
    var month = parseInt(dateParts[1], 10) - 1;
    var year = parseInt(dateParts[0], 10);

    const date = new Date(year, month, day);

    if (unit === 'Day') {
        date.setDate(date.getDate() + num);
    } else if (unit === 'Week') {
        date.setDate(date.getDate() + (num * 7));
    } else if (unit === 'Month') {
        date.setMonth(date.getMonth() + num);
    } else if (unit === 'Year') {
        date.setFullYear(date.getFullYear() + num);
    }

    day = date.getDate().toString().padStart(2, '0');
    month = (date.getMonth() + 1).toString().padStart(2, '0');
    year = date.getFullYear();

    return `${year}-${month}-${day}`;
}

function addHash(dict, row, id, drug, dosage, startDate, endDate, duration, route, status, comments, byPatient) {
  dict["" + row] = {};
  dict["" + row]["id"] = id;
  dict["" + row]["drug"] = drug;
  dict["" + row]["dosage"] = dosage;
  dict["" + row]["startDate"] = startDate;
  dict["" + row]["endDate"] = endDate;
  dict["" + row]["duration"] = duration;
  dict["" + row]["route"] = route;
  dict["" + row]["status"] = status;
  dict["" + row]["comments"] = comments;
  dict["" + row]["byPatient"] = byPatient;
}

function setDefaultStartDate() {
    const date = new Date().toJSON().slice(0, 10);
    console.log(date);
    $("#medication-start-date").val(date);
}

(function() {  
    setDefaultStartDate();
})();
