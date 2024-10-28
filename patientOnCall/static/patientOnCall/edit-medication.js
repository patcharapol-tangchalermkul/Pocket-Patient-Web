var base_url = window.location.origin;

var dict = {};

(function() {
    const value = sessionStorage.getItem('medicationDict');
    console.log(dict)
    if (value !== "No data") {
        dict = JSON.parse(sessionStorage.getItem("medicationDict"))
        var i = 0
        while (i < Object.keys(dict).length) {
            const status = dict["" + i]["status"];
            if (status != "delete") {
                insertFromDict(i, dict["" + i]["drug"], 
                                dict["" + i]["dosage"], 
                                dict["" + i]["startDate"], 
                                dict["" + i]["endDate"], 
                                dict["" + i]["duration"], 
                                dict["" + i]["route"],
                                dict["" + i]["comments"],
                                dict["" + i]["byPatient"])
            }
            i++;
        }
        assignEvent();
    }
    else {
        console.log("not stored")
        const firstName = sessionStorage.getItem("patientFirstName")
        const lastName = sessionStorage.getItem("patientLastName")
        const patientID = sessionStorage.getItem("patientID")
        const medication = JSON.parse(sessionStorage.getItem("currentMedication"))

        document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
        document.getElementById("patient-id").innerHTML = "NHS Number:" + patientID

        insertMedication(medication);

        assignEvent();
    }
})();


/**
 * Inserts all medications into current medication table
 * @param {Dictionary} medication list of medications
 */
function insertMedication(medication) {
  var i = 0
  while (i < medication.length) {
      addMedication(i, medication[i]["id"],
                        medication[i]["drug"], 
                        medication[i]["dosage"], 
                        medication[i]["startDate"], 
                        medication[i]["endDate"], 
                        medication[i]["duration"], 
                        medication[i]["route"],
                        medication[i]["status"],
                        medication[i]["comments"],
                        medication[i]["byPatient"])
      i++;
  }
}

/**
 * Adds a single medication entry into current medication table
 * @param {int} row row index of medication
 * @param {string} drug name of drug
 * @param {string} dosage drug dosage
 * @param {string} startDate medication start date
 * @param {string} endDate medication end date
 * @param {string} duration medication duration
 * @param {string} route medication route
 */
function addMedication(row, id, drug, dosage, startDate, endDate, duration, route, status, comments, byPatient) {
    // Create a new entry for the table
    var tableBody = document.getElementById("main-current-medication-box-table");

    // Insert all information in medication
    createAndInsertMedicationInfo(tableBody, row, "action", null, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "drug", drug, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "dosage", dosage, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "start-date", startDate, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "end-date", endDate, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "duration", duration, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "route", route, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "comments", comments, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "by-patient", byPatient, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "confirmation", null, byPatient);

    // save value to dict
    saveToDict(row, id, drug, dosage, startDate, endDate, duration, route, status, comments, byPatient);
}

function insertFromDict(row, drug, dosage, startDate, endDate, duration, route, comments, byPatient) {
    var tableBody = document.getElementById("main-current-medication-box-table");

    console.log("attempt insert")
    // Insert all information in medication
    createAndInsertMedicationInfo(tableBody, row, "action", null, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "drug", drug, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "dosage", dosage, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "start-date", startDate, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "end-date", endDate, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "duration", duration, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "route", route, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "comments", comments, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "by-patient", byPatient, byPatient);
    createAndInsertMedicationInfo(tableBody, row, "confirmation", null, byPatient);
}

function assignEvent() {
    const elements = document.getElementsByClassName("selection");

    // Iterate over the elements and attach the event listener
    for (let i = 0; i < elements.length; i++) {
        const elem = elements[i];
        elem.addEventListener('change', (e) => {
            e.preventDefault();
            // Check the ID of the clicked element
            // Get the selected option
            const selectedOption = elem.options[elem.selectedIndex];

            // Get the ID of the selected option
            const selectedOptionId = selectedOption.id;
            const name = selectedOptionId.match(/[a-zA-Z]+/)[0];
            const row = selectedOptionId.match(/\d+/)[0];

            // Perform specific actions based on the element's ID
            if (name === 'edit') {
                changeEditable(row);
                document.getElementById("medication-confirm-button-" + row).addEventListener("click", (e) => {
                    e.preventDefault();

                    let drug = document.getElementById("input-drug-" + row).value;
                    let dosage = document.getElementById("input-dosage-" + row).value;
                    let startDate = document.getElementById("input-start-date-" + row).value;
                    let endDate = document.getElementById("medication-end-date-" + row).innerHTML;
                    let durationDict = getDurationInfo(row);
                    let duration = durationDict["number"] + " " + durationDict["time"];
                    let route = document.getElementById("input-route-" + row).value;
                    let comments = document.getElementById("input-comments-" + row).value;

                    savedEdit(row, drug, dosage, startDate, endDate, duration, route, comments);

                })
            } 
            else if (name === 'del') {
                reloadUnEditedContent(row);
                showDeleteButton(row);
            }
            else {
                reloadUnEditedContent(row)
            }
        });
    }
}

function reloadUnEditedContent(row) {
    reloadMedicationInfo(row, "drug");
    reloadMedicationInfo(row, "dosage");
    reloadMedicationInfo(row, "start-date");
    reloadMedicationInfo(row, "end-date");
    reloadMedicationInfo(row, "duration");
    reloadMedicationInfo(row, "route");
    reloadMedicationInfo(row, "comments");
    reloadMedicationInfo(row, "confirm");
}

function saveToDict(row, id, drug, dosage, startDate, endDate, duration, route, status, comments, byPatient) {
    if (!dict.hasOwnProperty("" + row)) {
        dict["" + row] = {};
    }
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
    sessionStorage.setItem("medicationDict", JSON.stringify(dict));
}

function savedEdit(row, drug, dosage, startDate, endDate, duration, route, comments) {
    document.getElementById("medication-drug-" + row).innerHTML = drug;
    document.getElementById("medication-dosage-" + row).innerHTML = dosage;
    document.getElementById("medication-start-date-" + row).innerHTML = startDate;
    document.getElementById("medication-end-date-" + row).innerHTML = endDate;
    document.getElementById("medication-duration-" + row).innerHTML = duration;
    document.getElementById("medication-route-" + row).innerHTML = route;
    document.getElementById("medication-comments-" + row).innerHTML = comments;

    if (dict["" + row]["status"] == "added") {
        updateDict(row, drug, dosage, startDate, endDate, duration, route, "added", comments)
    }
    else {
        updateDict(row, drug, dosage, startDate, endDate, duration, route, "edited", comments)
    }

    document.getElementById("select-" + row).selectedIndex = 0;
    document.getElementById("medication-confirm-" + row).innerHTML = "Confirmed";
}

function updateDict(row, drug, dosage, startDate, endDate, duration, route, status, comments) {
    dict["" + row]["drug"] =  drug;
    dict["" + row]["dosage"] =  dosage;
    dict["" + row]["startDate"] =  startDate;
    dict["" + row]["endDate"] =  endDate;
    dict["" + row]["duration"] =  duration;
    dict["" + row]["route"] =  route;
    dict["" + row]["status"] =  status
    dict["" + row]["comments"] =  comments;
    sessionStorage.setItem("medicationDict", JSON.stringify(dict));
}

function changeEditable(row) {
    // Create input elements
    changeMedicationInfoToEditable(row, "drug");
    changeMedicationInfoToEditable(row, "dosage");
    changeMedicationInfoToEditable(row, "start-date");
    changeMedicationInfoToEditable(row, "duration");
    changeMedicationInfoToEditable(row, "route");
    changeMedicationInfoToEditable(row, "comments");
    changeMedicationInfoToEditable(row, "confirm");

    addDurationInputsEventListener(row);
}

function getToday() {
    // Get today's date
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, "0");
    var day = String(today.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}

function createAndInsertMedicationInfo(tableBody, row, type, data, byPatient) {
    let medicationInfo = document.createElement("div");
    medicationInfo.classList.add("info-table-item");
    medicationInfo.classList.add(`medication-${row}`);
    if (type == "action") {
        if (byPatient == false) {
            let selectElem = createActionMedicationElement(row);
            medicationInfo.appendChild(selectElem);
        } else {
            medicationInfo.id = `medication-${type}-${row}`;
            medicationInfo.textContent = "No action";
        }
    } else if (type == "confirmation") {
        let confirmBtnElem = createConfirmButtonElement(row);
        medicationInfo.appendChild(confirmBtnElem);
    } else if (type == "by-patient") {
        let byPatientElem = createByPatientElement(row, data);
        medicationInfo.appendChild(byPatientElem);
    } else {
        medicationInfo.id = `medication-${type}-${row}`;
        medicationInfo.textContent = data;    
    }
    tableBody.appendChild(medicationInfo);
}

function createActionMedicationElement(row) {
    // Create the <select> element for medication action
    const selectElement = document.createElement('select');
    selectElement.classList.add("selection")
    selectElement.id = "select-" + row;

    // Create the "Saved" option
    const savedOption = document.createElement('option');
    savedOption.classList.add("selection-option");
    savedOption.id = 'saved-option-' + row;
    savedOption.value = 'option1';
    savedOption.selected = true;
    savedOption.textContent = 'Saved';

    // Create the "Edit" option
    const editOption = document.createElement('option');
    editOption.classList.add("selection-option");
    editOption.id = 'edit-option-' + row;
    editOption.value = 'option2';
    editOption.textContent = 'Edit';

    // Create the "Delete" option
    const deleteOption = document.createElement('option');
    deleteOption.classList.add("selection-option");
    deleteOption.id = 'del-option-' + row;
    deleteOption.value = 'option3';
    deleteOption.textContent = 'Delete';

    // Append the options to the <select> element
    selectElement.appendChild(savedOption);
    selectElement.appendChild(editOption);
    selectElement.appendChild(deleteOption);

    return selectElement;
}

function createConfirmButtonElement(row) {
    const confirmButton = document.createElement('div');
    confirmButton.textContent = 'Confirmed';
    confirmButton.id = 'medication-confirm-' + row;
    return confirmButton;
}

function createByPatientElement(row, data) {
    let byPatientElem = document.createElement("div");
    byPatientElem.id = `medication-by-patient-${row}`;
    if (data == true) {
        byPatientElem.classList.add("by-patient");
        byPatientElem.textContent = "Patient";
    } else {
        byPatientElem.classList.add("by-doctor");
        byPatientElem.textContent = "Doctor";
    }
    return byPatientElem;
}

function changeMedicationInfoToEditable(row, type) {
    const elem = document.getElementById(`medication-${type}-${row}`);
    let newChild = null;

    if (type == "confirm") {
        newChild = document.createElement("button");
        newChild.textContent = "Save";
        newChild.id = "medication-confirm-button-" + row;
    } else if (type == "duration") {
        newChild = createDurationEditablesElement(elem, row);
    } else if (type == "route") {
        let routeStore = elem.textContent
        newChild = document.createElement("select");
        newChild.id = `input-route-${row}`;
        let routes = ["Oral", "Injection", "Nasal", "Transdermal", "Otic"]
        let optionIndex = routes.indexOf(routeStore);
        for (i in routes) {
            let newOption = document.createElement("option");
            newOption.value = routes[i];
            newOption.innerHTML = routes[i];
            newChild.appendChild(newOption);
        }
        newChild.selectedIndex = optionIndex;
    } else {
        newChild = document.createElement("input");
        newChild.type = (type == "start-date" || type == "end-date") ? "date": "text";
        newChild.name = `input-${type}-${row}`;
        newChild.id = `input-${type}-${row}`;
        if (type == "start-date" || type == "end-date") {
            newChild.value = getToday();
        } else {
            newChild.value = elem.textContent;
        }
    
    }
    elem.innerHTML = "";
    elem.appendChild(newChild);
}

function createDurationEditablesElement(elem, row) {
    let durationStr = elem.textContent
    let durationNum = durationStr.split(" ")[0];
    let durationTime = durationStr.split(" ")[1];

    let editablesElem = document.createElement("div");
    editablesElem.classList.add("input-duration-editables");
    editablesElem.id =`input-duration-editables-${row}`;

    let editNumber = document.createElement("div");
    editNumber.classList.add("input-duration-number-wrapper");
    let numberInput = document.createElement("input");
    numberInput.type = "text";
    numberInput.name = `input-duration-number-${row}`;
    numberInput.id = `input-duration-number-${row}`;
    numberInput.value = durationNum;
    editNumber.appendChild(numberInput);

    let editTime = document.createElement("div");
    editTime.classList.add("input-duration-time-wrapper");
    let timeSelect = document.createElement("select");
    timeSelect.class = `input-duration-time`;
    timeSelect.id = `input-duration-time-${row}`;
    let times = ["Day", "Week", "Month", "Year"]
    let optionIndex = times.indexOf(durationTime);
    for (i in times) {
        let newOption = document.createElement("option");
        newOption.value = times[i];
        newOption.innerHTML = `${times[i]}(s)`;
        timeSelect.appendChild(newOption);
    }
    timeSelect.selectedIndex = optionIndex;
    editTime.appendChild(timeSelect);

    
    editablesElem.appendChild(editNumber);
    editablesElem.appendChild(editTime);
    return editablesElem;
}

function addDurationInputsEventListener(row) {
    $(`.input-duration-number-wrapper > input, .input-duration-time-wrapper > select, #input-start-date-${row}`)
        .on("change", function () {
            let durationInfo = getDurationInfo(row);
            let startDateStr = document.getElementById(`input-start-date-${row}`).value;
            $(`#medication-end-date-${row}`).html(addTime(startDateStr, parseInt(durationInfo["number"]), durationInfo["time"]));
        });
}

function getDurationInfo(row) {
    let number = document.getElementById(`input-duration-number-${row}`).value;
    let time = document.getElementById(`input-duration-time-${row}`).value;

    return {
        "number": number,
        "time": time
    }
}

function addTime(dateStr, num, unit) {
    const dateParts = dateStr.split('-');
    var day = parseInt(dateParts[2], 10);
    var month = parseInt(dateParts[1], 10) - 1;
    var year = parseInt(dateParts[0], 10);

    const date = new Date(year, month, day);

    if (unit === 'Day') {
        date.setDate(date.getDate() + num);
        console.log("change in day")
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

function reloadMedicationInfo(row, type) {
    if (dict["" + row]["id"] == 0) {
        const medication = dict["" + row];
        if (type == "confirm") {
            document.getElementById(`medication-${type}-${row}`).innerHTML = "Confirmed"
        } else if (type == "start-date") {
            document.getElementById(`medication-${type}-${row}`).innerHTML = medication["startDate"];
        } else if (type == "end-date") {
            document.getElementById(`medication-${type}-${row}`).innerHTML = medication["endDate"];
        } else {
            document.getElementById(`medication-${type}-${row}`).innerHTML = medication[`${type}`];
        }
    }
    else {
        const medication = JSON.parse(sessionStorage.getItem("currentMedication"));
        if (type == "confirm") {
            document.getElementById(`medication-${type}-${row}`).innerHTML = "Confirmed"
        } else if (type == "start-date") {
            document.getElementById(`medication-${type}-${row}`).innerHTML = medication[row]["startDate"];
        } else if (type == "end-date") {
            document.getElementById(`medication-${type}-${row}`).innerHTML = medication[row]["endDate"];
        } else {
            document.getElementById(`medication-${type}-${row}`).innerHTML = medication[row][`${type}`];
        }
    }
}

function getRowFromId(id) {
    let ws = id.split("-");
    return parseInt(ws[ws.length - 1]);
}

function updateMedication() {
    let medication = JSON.parse(sessionStorage.getItem("currentMedication"));
    const firstName = sessionStorage.getItem("patientFirstName");
    const lastName = sessionStorage.getItem("patientLastName");

    let updates = {
        "patientId": sessionStorage.getItem("patientID"),
        "patientName": firstName + ' ' + lastName,
        "deleteIds": [],
        "editItems": [],
        "addedItems": []
    }

    for (i=0; i < Object.keys(dict).length; i++) {
        
        let currDict = dict["" + i]
        // console.log(currDict["status"])
        // console.log(currDict)
        if (currDict["status"] == "delete") {
            updates["deleteIds"].push({'medicationID': currDict["id"],
                                        'medicationComments': currDict["comments"]});
        } else {
            if (currDict["status"] == "edited") {
                let drug = document.getElementById(`medication-drug-${i}`).innerHTML;
                let dosage = document.getElementById(`medication-dosage-${i}`).innerHTML;
                let startDate = document.getElementById(`medication-start-date-${i}`).innerHTML;
                let endDate = document.getElementById(`medication-end-date-${i}`).innerHTML;
                let duration = document.getElementById(`medication-duration-${i}`).innerHTML;
                let route = document.getElementById(`medication-route-${i}`).innerHTML;
                let comments = document.getElementById(`medication-comments-${i}`).innerHTML;

                updates["editItems"].push({
                    'patientID': sessionStorage.getItem("patientID"),
                    'patientName': firstName + ' ' + lastName,
                    'medicationID': currDict["id"],
                    'medicationDrug': drug, 
                    'medicationDosage': dosage,
                    'medicationStartDate': startDate, 
                    'medicationEndDate': endDate, 
                    'medicationDuration': duration, 
                    'medicationRoute': route,
                    'medicationComments': comments,
                });
            }
            else if (currDict["status"] == "added") {
                let drug = document.getElementById(`medication-drug-${i}`).innerHTML;
                console.log(drug)
                let dosage = document.getElementById(`medication-dosage-${i}`).innerHTML;
                let startDate = document.getElementById(`medication-start-date-${i}`).innerHTML;
                let endDate = document.getElementById(`medication-end-date-${i}`).innerHTML;
                let duration = document.getElementById(`medication-duration-${i}`).innerHTML;
                let route = document.getElementById(`medication-route-${i}`).innerHTML;
                let comments = document.getElementById(`medication-comments-${i}`).innerHTML;

                updates["addedItems"].push({
                    'patientID': sessionStorage.getItem("patientID"),
                    'patientName': firstName + ' ' + lastName,
                    'medicationDrug': drug, 
                    'medicationDosage': dosage,
                    'medicationStartDate': startDate, 
                    'medicationEndDate': endDate, 
                    'medicationDuration': duration, 
                    'medicationRoute': route,
                    'medicationComments': comments,
                });
            }
        }
    }

    $.ajax({
      type: "POST",
      url: base_url + "/api/doctor/patient-data/medication/update/",
      data: JSON.stringify(updates),
      success: function (returned_value) {
        if (returned_value.ok == true) { 
            sessionStorage.setItem("currentMedication", JSON.stringify(returned_value["current-medication"]))
            sessionStorage.setItem("previousMedication", JSON.stringify(returned_value["previous-medication"]))
            websocket.send(JSON.stringify({
                "event": "CHANGE-IN-MEDICATION",
                "currentMedication": sessionStorage.getItem("currentMedication")
              //   "pastMedication": sessionStorage.getItem("pastMedication")
            }));
        }
      },
      error: function () { }
    });

}

document.getElementById("save-medication").addEventListener("click", (e) => {
    updateMedication();
})

document.getElementById("add-medication-button").addEventListener("click", (e) => {
    sessionStorage.setItem("medicationDict", JSON.stringify(dict));
    window.location.href = "/add-medication"
    // console.log(dict)
    // console.log(sessionStorage.getItem("medicationDict"))
    // console.log(JSON.parse(sessionStorage.getItem("medicationDict")))

})

// DELETE PRESCRIPTION
function showDeleteButton(row) {
    let deleteButton = document.createElement("button");
    deleteButton.id = `medication-delete-button-${row}`;
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener("click", (e) => { 
        e.preventDefault();
        if (dict[`${row}`]["id"] == "0") {
            console.log("delete newly added");
            delete dict["" + row];
            sessionStorage.setItem("medicationDict", JSON.stringify(dict));
            deleteMedication(row);
        }
        else {
            showCommentSection(row);
        }
    });
    $(`#medication-confirm-${row}`).html(deleteButton);
}

function deleteMedication(row) { 
    $(`.medication-${row}`).remove();
}

function showCommentSection(row) {
    const elem = document.getElementById(`medication-comments-${row}`);

    let popUpMask = document.createElement("div");
    popUpMask.classList.add("white-fade-mask");
    popUpMask.id = "pop-up-mask";

    let confirmComment = document.createElement("div");
    
    confirmComment.id = "confirm-comment";
    let commentPopUp = document.createElement("textarea");
    commentPopUp.type = "text";
    commentPopUp.name = `comment-pop-up`;
    commentPopUp.id = `comment-pop-up`;
    commentPopUp.placeholder = 'Please state the reason why this medication is to be deleted.';
    commentPopUp.value = elem.textContent

    confirmComment.appendChild(commentPopUp);

    popUpMask.addEventListener("click", (e) => { 
        e.preventDefault();
        // Remove the element
        if (e.target.id == "pop-up-mask" || e.target.id == "delete-cancel-button") {
            popUpMask.remove();
        }
        else if (e.target.id == "delete-confirm-button") {
            deleteMedication(row);

            popUpMask.remove();
        
            const key = "" + row
            dict["" + row]["status"] = "delete";
            dict["" + row]["comments"] = commentPopUp.value;
        }
    })

    let buttonsContainer = document.createElement("div");
    buttonsContainer.id = "delete-buttons-container"

    confirmButton = document.createElement("button");
    confirmButton.textContent = "Save Comment";
    confirmButton.id = "delete-confirm-button";

    cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.id = "delete-cancel-button";

    
    buttonsContainer.appendChild(confirmButton);
    buttonsContainer.appendChild(cancelButton);

    confirmComment.appendChild(buttonsContainer);

    document.getElementsByTagName("body")[0].appendChild(popUpMask);

    document.getElementById("pop-up-mask").appendChild(confirmComment);
}