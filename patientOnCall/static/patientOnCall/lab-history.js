(function() {
  
    const firstName = sessionStorage.getItem("patientFirstName")
    const lastName = sessionStorage.getItem("patientLastName")
    const patientID = sessionStorage.getItem("patientID")

    document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
    document.getElementById("patient-id").innerHTML = 'NHS Number:' + patientID

    goToLabType()
})();

function goToLabType() {
    const labNames = ["fbc", "cancer", "electrolyte", "genetic", "liver", "thyroid"]
    for(var i = 0; i < labNames.length; i ++) {
        const lab = labNames[i]  
        var labBtn = lab + '-btn'
        document.getElementById(labBtn).onclick = function() {
            console.log(base_url + "/lab-type/" + lab)
            window.location.href = base_url + "/lab-type/" + lab
        }
    }
}