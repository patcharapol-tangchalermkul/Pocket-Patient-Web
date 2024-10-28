
(function() {
    const firstName = sessionStorage.getItem("patientFirstName")
    const lastName = sessionStorage.getItem("patientLastName")
    const id = sessionStorage.getItem("patientID")
    
    document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
    document.getElementById("patient-id").innerHTML = 'NHS Number:' + id

    document.getElementById("back-to-lab-type").href = document.referrer
    rowNum = window.location.href.split('/')[5]
    getLabEntry(rowNum-1)
})();

function getLabEntry(entryNum) {
    const labHistory = JSON.parse(sessionStorage.getItem("labHistory"))
    const date = labHistory[entryNum]["date"]
    const labType = labHistory[entryNum]["labType"]
    const report = labHistory[entryNum]["report"]

    $(".section-header").html(labType + ": " + date)
 
    document.getElementById("entry-date").innerHTML = date
    document.getElementById("entry-lab-type").innerHTML = labType
    
    const uploadURL = 'upload-lab/' + labHistory[entryNum]["id"]
    console.log(uploadURL)
    const reportForm = document.getElementById("upload-report-form")
    reportForm.setAttribute('action',uploadURL)
    const entryReport = document.getElementById("entry-report")
    
    console.log(report)
    if  (report === 'False' || report === (base_url + '/media/False')) {
        $("#upload-report-form").submit(function(eventObj) {
            var reportUpload = $('#report-upload').val().replace(/C:\\fakepath\\/, '/media/labattachments/');
            // console.log(reportUpload)
            labHistory[entryNum]["report"] = reportUpload
            // console.log(imagingHistory[entryNum]["report"])
            sessionStorage.setItem("labHistory",JSON.stringify(labHistory))
            return true; 
        });       
    } else {
        reportForm.remove()
        const entryReportLink = document.createElement("a");
        entryReportLink.textContent = report.replace(base_url+'/media/labattachments/', ''); 
        entryReportLink.href = report
        entryReport.append(entryReportLink)
    } 
        
    return true;     
}