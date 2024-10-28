var base_url = window.location.origin;

(function() {
  
    const firstName = sessionStorage.getItem("patientFirstName")
    const lastName = sessionStorage.getItem("patientLastName")
    const id = sessionStorage.getItem("patientID")
    // const medicalHistory = JSON.parse(sessionStorage.getItem("medicalHistory"))

    document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
    document.getElementById("patient-id").innerHTML = 'NHS Number:' + id

    goToScanType()
})();

function goToScanType() {
    const scanNames = ["MRI", "PET", "X-Ray", "ECG", "CT", "Ultrasound", "Medical-Photography"]
    for(var i = 0; i < scanNames.length; i ++) {
        const scan = scanNames[i]  
        var scanBtn = scan + '-btn'
        // console.log(scanBtn)
        document.getElementById(scanBtn).onclick = function() {
            window.location.href = base_url + "/scan-type/" + scan
        }
    }
}