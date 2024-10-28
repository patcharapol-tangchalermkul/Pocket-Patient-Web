var base_url = window.location.origin;

(function() {  
    const firstName = sessionStorage.getItem("patientFirstName")
    const lastName = sessionStorage.getItem("patientLastName")
    const id = sessionStorage.getItem("patientID")
    const medicalHistory = JSON.parse(sessionStorage.getItem("medicalHistory"))
    medicalHistory.sort((a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime())
    
    document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
    document.getElementById("patient-id").innerHTML = 'NHS Number:' + id

    console.log(medicalHistory);
    console.log("runs page")
    insertMedHistoryEntries(medicalHistory);
    for(var i = 1; i <= medicalHistory.length; i ++) {
        row_hover(i, medicalHistory[i-1]["visitType"]);
        console.log(medicalHistory[i-1]["id"])
        row_click(i, medicalHistory[i-1]["id"]);
    }

    updateNewVisitInWebsocket();
})();

function insertMedHistoryEntries(medicalHistory) {
  var i = 0
  console.log("prints in insert medical history entries");
  while (i < medicalHistory.length) {
      addMedHistoryEntry(i+1, 
       medicalHistory[i]["id"],
       medicalHistory[i]["admissionDate"],
       medicalHistory[i]["dischargeDate"],
       medicalHistory[i]["summary"],
       medicalHistory[i]["visitType"],
       medicalHistory[i]["letter"],
       medicalHistory[i]["consultant"])
      i++;
  }
}
function addMedHistoryEntry(rowNum, id, admissionDate, dischargeDate, summary, visitType, letter, consultant) {
    // Create a new entry for the table
    const labHistory = JSON.parse(sessionStorage.getItem("labHistory"))
    const imagingHistory = JSON.parse(sessionStorage.getItem("imagingHistory"))
    var tableBody = document.getElementById("main-current-visit-box-table");
    var row = "row-" + rowNum
    console.log(row)

    const entryDate = document.createElement("div");
    entryDate.classList.add("info-table-item");
    entryDate.classList.add("visit-info-item");
    entryDate.classList.add("entry-date");
    entryDate.classList.add(row);
    entryDate.setAttribute("visit-id", id);
    if ((admissionDate === dischargeDate) || visitType === "GP Consultation" || visitType === "Hospital Clinic") {
        console.log("same date")
        entryDate.textContent = admissionDate;
    } else {
        entryDate.textContent = admissionDate + "\n" + "-\n" + dischargeDate;
    }

    // const entryAdmissionDate = document.createElement("div");
    // entryAdmissionDate.classList.add("info-table-item");
    // entryAdmissionDate.classList.add(row);
    // entryAdmissionDate.textContent = admissionDate;

    // const entryDischargeDate = document.createElement("div");
    // entryDischargeDate.classList.add("info-table-item");
    // entryDischargeDate.classList.add(row);
    // entryDischargeDate.textContent = dischargeDate;

    const entrySummary = document.createElement("div");
    entrySummary.classList.add("info-table-item");
    entrySummary.classList.add(row);
    entrySummary.classList.add("summary");
    entrySummary.textContent = summary;
    entrySummary.setAttribute("visit-id", id);

    // const entryConsultant = document.createElement("div");
    // entryConsultant.classList.add("info-table-item");
    // entryConsultant.textContent = consultant;

    const entryVisitType = document.createElement("div");
    entryVisitType.classList.add("info-table-item");
    entryVisitType.classList.add(row);
    entryVisitType.classList.add("visit-type");
    entryVisitType.setAttribute("visit-id", id);
    entryVisitType.textContent = visitType;
    if (visitType == "GP Consultation") {
        entryVisitType.style.backgroundColor = "#C55252";
    } else if (visitType== "Hospital Clinic"){
        entryVisitType.style.backgroundColor = "#6BC4EB";
    } else {
        entryVisitType.style.backgroundColor = "#FFDA29"
    }

    
    const entryConsultant = document.createElement("div");
    entryConsultant.classList.add("info-table-item");
    entryConsultant.classList.add("consultant");
    entryConsultant.classList.add(row);
    entryConsultant.setAttribute("visit-id", id);
    entryConsultant.textContent = consultant;
    
    const entryLetterBox = document.createElement("div");
    entryLetterBox.classList.add("info-table-item");
    entryLetterBox.classList.add("letter");
    entryLetterBox.classList.add(row);
    entryLetterBox.setAttribute("visit-id", id);

    const entryLetter = document.createElement("a");
    // entryLetter.classList.add("info-table-item");
    // entryLetter.classList.add(row);
    console.log(letter)
    if  (letter === "False" || letter === "/media/False" || letter === base_url + '/media/False') {
        console.log("NOOOOO")
    } else {
        entryLetter.href = letter;
        if (visitType == "GP Consultation") {
            entryLetter.textContent = "GP Letter";
        }
        else {
            entryLetter.textContent = "Discharge Letter";
        }
    } 
    entryLetterBox.appendChild(entryLetter)

    const entryLabAndImaging = document.createElement("div");
    entryLabAndImaging.classList.add("info-table-item");
    entryLabAndImaging.classList.add(row);
    entryLabAndImaging.classList.add("add-lab-button");
    entryLabAndImaging.setAttribute("visit-id", id);

    // entryImaging.href = base_url + '/add-imaging'

    for(var i = 0; i < labHistory.length; i ++) {
        if (labHistory[i]["visitEntry"] === id) {
            labEntry = document.createElement("a"); 
            labEntry.href = labHistory[i]["report"]
            labEntry.innerText = labHistory[i]["labType"] + '\n'
            entryLabAndImaging.appendChild(labEntry)
        }
    }
    for(var i = 0; i < imagingHistory.length; i ++) {
        console.log("Print lab link");
        if (imagingHistory[i]["visitEntry"] === id) {
            imagingEntry = document.createElement("a"); 
            imagingEntry.href = imagingHistory[i]["report"]
            imagingEntry.innerText = imagingHistory[i]["scanType"] + '(' + imagingHistory[i]["region"] + ')\n'
            entryLabAndImaging.appendChild(imagingEntry)
        }
    }

    tableBody.appendChild(entryDate);
    tableBody.appendChild(entrySummary);
    tableBody.appendChild(entryVisitType);
    tableBody.appendChild(entryConsultant);
    tableBody.appendChild(entryLetterBox);
    tableBody.appendChild(entryLabAndImaging);

}

function row_hover(rowNum, visitType){
    var rowClass = 'row-' + rowNum 
    var row = document.getElementsByClassName(rowClass);
    var n = row.length;
    function changeColor(bgcolor, fontWeight){
        for(var i = 0; i < n; i++) {
            row[i].style.backgroundColor = bgcolor; 
            // row[i].style.fontWeight = fontWeight; 
        }
    }
    for(var i = 0; i < n; i ++) {
        row[i].onmouseover = function() {
            changeColor("#73C1D2", "bold");

        };
        row[i].onmouseout = function() {
            changeColor("", "normal");
            if (visitType== "GP Consultation"){
                row[2].style.backgroundColor = "#C55252";
            } else if (visitType== "Hospital Clinic"){
                row[2].style.backgroundColor = "#6BC4EB";
            } else {
                row[2].style.backgroundColor = "#FFDA29"
            }
        };   
    }
}

function row_click(rowNum, visitID){
    var rowClass = 'row-' + rowNum 
    var row = document.getElementsByClassName(rowClass);
    var n = row.length;
    for(var i = 0; i < n; i ++) {
        row[i].onclick = function() {
            window.location.href = base_url + "/edit-visit/" + visitID
        };
    }
}

document.getElementById("add-visit").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = base_url + "/add-visit"
  })


document.getElementsByClassName("add-lab-button").onclick = function() {
    window.location.href = base_url + "/add-imaging"
};

function editHospVisitEntry(id, admissionDate, dischargeDate, summary, consultant, visitType, letter) {

    console.log('editing')

    var entryDateText;
    if (admissionDate === dischargeDate) {
        console.log("same date")
        entryDateText = admissionDate;
    } else {
        entryDateText = admissionDate + "\n" + "-\n" + dischargeDate;
    }

    $(".visit-info-item").each(function () {
        var classList = $(this).attr("class");
        var classArr = classList.split(/\s+/);
        var rowNumRegex = /row-[0-9]/;
        let rowClass;   

        if ($(this).attr("visit-id") == id) {
            $.each(classArr, function(index, value){
                console.log(value)
                if (rowNumRegex.test(value)) {
                    rowClass = value;
                }
            });

          $("." + rowClass).each(function () {
            var rowClassList = $(this).attr("class");
            var rowClassArr = rowClassList.split(/\s+/);
            console.log(rowClassArr)
            console.log($.inArray('summary', rowClassArr))
            if ($.inArray('entry-date', rowClassArr) > 0) {
                $(this).text(entryDateText);
            } else if ($.inArray('visit-type', rowClassArr) > 0) {
                $(this).text(visitType);
                if (visitType == "GP Consultation") {
                    $(this).css("background-color", "#C55252");
                } else if (visitType== "Hospital Clinic"){
                    $(this).css("background-color", "#6BC4EB");
                } else {
                    $(this).css("background-color", "#FFDA29");
                }
            } else if ($.inArray('consultant', rowClassArr) > 0) {
                $(this).text(consultant);
            } else if ($.inArray('summary', rowClassArr) > 0) {
                console.log($(this));
                $(this).text(summary);
            } else if ($.inArray('letter', rowClassArr) > 0) {
                $(this).empty();
                const entryLetter = document.createElement("a");
                // entryLetter.classList.add("info-table-item");
                // entryLetter.classList.add(row);
                console.log(letter)
                if  (letter === "False" || letter === "/media/False") {
                    console.log("NOOOOO")
                } else {
                    entryLetter.href = base_url + letter;
                    if (visitType == "GP Consultation") {
                        entryLetter.textContent = "GP Letter";
                    }
                    else {
                        entryLetter.textContent = "Discharge Letter";
                    }
                } 
                $(this).append(entryLetter)
            }
          })
        }
      })
}

function updateNewVisitInWebsocket() {
    console.log(isCreated);
    if (isCreated && websocket) {
        if (websocket.readyState == websocket.OPEN) {
            const id = sessionStorage.getItem("patientID")
            const medicalHistory = JSON.parse(sessionStorage.getItem("medicalHistory"))
            websocket.send(JSON.stringify({
                "event": "NEW_HOSP_VISIT_ENTRY",
                "patientId": id,
                "hospital_visit_history": medicalHistory,
                "doctor_update": true
            }));       
        } else {
            setTimeout(updateNewVisitInWebsocket, 500);
        }
    }
}