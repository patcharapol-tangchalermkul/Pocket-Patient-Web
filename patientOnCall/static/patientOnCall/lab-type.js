var base_url = window.location.origin;

(function() {
    const firstName = sessionStorage.getItem("patientFirstName")
    const lastName = sessionStorage.getItem("patientLastName")
    const id = sessionStorage.getItem("patientID")
    // const medicalHistory = JSON.parse(sessionStorage.getItem("medicalHistory"))
    const labHistory = JSON.parse(sessionStorage.getItem("labHistory"))
    
    document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
    document.getElementById("patient-id").innerHTML = 'NHS Number:' + id
    // console.log(window.location.href.split('/')[4])
    // document.getElementById("back-button").href = document.referrer
    
    var labURL = window.location.href.split('/')[4] 
    var labName = ""
    if (labURL === "fbc") {
        labName = "Full Blood Count Report"
    } else if (labURL === "cancer") {
        labName = "Cancer Blood Test" 
    } else if (labURL === "electrolyte") {
        labName = "Electrolyte Test" 
    } else if (labURL === "genetic") {
        labName = "Genetic Test" 
    } else if (labURL === "liver") {
        labName = "Liver Function Test" 
    } else if (labURL === "thyroid") {
        labName = "Thyroid Function Test" 
    }
    $(".section-header").html(labName)


    // console.log(labHistory);
    insertLabHistoryEntries(labHistory, labName);
    for(var i = 1; i <= labHistory.length; i ++) {
        row_hover(i, labHistory[i-1]["labType"]);
        row_click(i,labURL);
    }

})();


function insertLabHistoryEntries(labHistory, labName) {
  var i = 0
  while (i < labHistory.length) {
    if (labHistory[i]["labType"] === labName) {
        addLabHistoryEntry(i+1, labHistory[i]["date"],
         labHistory[i]["report"])
    }
    i++;
  }
}

function addLabHistoryEntry(rowNum, date, report) {
    // Create a new entry for the table
    var tableBody = document.getElementById("main-current-visit-box-table");
    var row = "row-" + rowNum
    // console.log(row)

    const entryDate = document.createElement("div");
    entryDate.classList.add("info-table-item");
    entryDate.classList.add(row);
    entryDate.textContent = date;
    
    const entryReportBox = document.createElement("div");
    entryReportBox.classList.add("info-table-item");
    entryReportBox.classList.add(row);

    const entryReport = document.createElement("a");
    // entryReport.classList.add("info-table-item");
    // entryReport.classList.add(row);
    // console.log(report)
    if  (report === 'False' || report === (base_url + '/media/False')) {
        console.log("NOOOOO")
    } else {
        entryReport.href = report;
        const reportText = report.replace(base_url+'/media/labattachments/', ''); 
        entryReport.textContent = reportText.replace('/media/labattachments/', '');
    } 
    entryReportBox.appendChild(entryReport)

    tableBody.appendChild(entryDate);
    tableBody.appendChild(entryReportBox);
}

function row_hover(rowNum){
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
        };   
    }
}

function row_click(rowNum, labType){
    var rowClass = 'row-' + rowNum 
    var row = document.getElementsByClassName(rowClass);
    var n = row.length;
    for(var i = 0; i < n; i ++) {
        row[i].onclick = function() {
            window.location.href = base_url + "/edit-lab/" + labType + '/' + rowNum
        };
    }
}

document.getElementById("add-lab").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = base_url + "/add-lab"
  })