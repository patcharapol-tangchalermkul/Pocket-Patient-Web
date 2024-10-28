var base_url = window.location.origin;

(function() {
  
  const firstName = sessionStorage.getItem("patientFirstName")
  const lastName = sessionStorage.getItem("patientLastName")
  const id = sessionStorage.getItem("patientID")
  let medicalHistory = JSON.parse(sessionStorage.getItem("medicalHistory"))

  document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
  document.getElementById("patient-id").innerHTML = 'NHS Number:' + id
  
  visitID = window.location.href.split('/')[4]
  document.getElementById("back-button").href = base_url + '/edit-visit/' + visitID
  getVisitEntry(visitID)

  // let inputs = $("p input, p textarea, p select")
  
  $("#patient-medical-history-add-entry").submit(function(eventObj) {
    let patientId = sessionStorage.getItem("patientID");
    let patientName = sessionStorage.getItem("patientName");
    $(this).append(`<input type="hidden" name="patientId" value=${patientId} /> `);
    $(this).append(`<input type="hidden" name="patientName" value=${patientName} /> `);
    // console.log(newMedicalHistory.addToMedicalHistory)
    // medicalHistory.push(newMedicalHistory)
    // medicalHistory.unshift(newMedicalHistory)
    // // console.log(medicalHistory)
    medicalHistory.sort((a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime())
    // // console.log(medicalHistory)
    sessionStorage.setItem("medicalHistory",JSON.stringify(medicalHistory))
    return true;
});
})();

function getVisitEntry(id) {
    const medicalHistory = JSON.parse(sessionStorage.getItem("medicalHistory"))
    const labHistory = JSON.parse(sessionStorage.getItem("labHistory"))
    const imagingHistory = JSON.parse(sessionStorage.getItem("imagingHistory"))
    var entryNum = ""
    for(var i = 0; i < medicalHistory.length; i ++) {
        console.log(medicalHistory[i]["id"]===id)
        if (medicalHistory[i]["id"]===id){
            console.log("row found")
            entryNum = i 
            break; 
        }
    }
    const admissionDate = medicalHistory[entryNum]["admissionDate"]
    const dischargeDate = medicalHistory[entryNum]["dischargeDate"]
    const visitType = medicalHistory[entryNum]["visitType"]
    const summary = medicalHistory[entryNum]["summary"]
    const letter = medicalHistory[entryNum]["letter"]
    const addToMedicalHistory = medicalHistory[entryNum]["addToMedicalHistory"]

    $(".section-header").html("Visit Entry: " + admissionDate)
    
    $("#id_visitType").val(visitType) 
    const visitDropDown = document.getElementById("id_visitType")
    // console.log(visitDropDown)
    date_toggle(visitType)
    visitDropDown.addEventListener("change", e => {
    var visitChosen = e.target.value;
    date_toggle(visitChosen)
    })
    $("#id_admissionDate").val(admissionDate)
    $("#id_dischargeDate").val(dischargeDate)

    $(document).ready(function() {
        $('#id_admissionDate').datepicker({dateFormat: "yy-mm-dd", onSelect: function(dateText, inst){
          $('#id_dischargeDate').datepicker('option', 'minDate', new Date(dateText))}});
      });
    $(document).ready(function() {
        $('#id_dischargeDate').datepicker({dateFormat: "yy-mm-dd", onSelect: function(dateText, inst){
        $('#id_admissionDate').datepicker('option', 'maxDate', new Date(dateText))}});
      });
    
    $("#id_summary").val(summary)

    if  (letter === "False" || letter === '/media/False') {  
      document.getElementById("entry-letter-link").remove()     
    } else {
      const entryLetter = document.getElementById("entry-letter-link")  
      if (visitType == "GP Consultation") {
          entryLetter.textContent = "GP Letter";
      }
      else {
          entryLetter.textContent = "Discharge Letter";
      }
      entryLetter.href = base_url + letter
    } 

    // document.getElementById("entry-add-to-medical-history").checked = addToMedicalHistory
    if (addToMedicalHistory === "True" || addToMedicalHistory === true)
      $("#id_addToMedicalHistory").attr('checked', true)
    else {
      $("#id_addToMedicalHistory").attr('checked', false)
    } 
}

function date_toggle(visitChosen) {
  if (visitChosen == "GP Consultation" || visitChosen == "Hospital Clinic"){
    document.getElementById("admission-date-label").innerHTML = 'Date:'; 
    document.getElementById("discharge-date-wrapper").style.display = 'none'; 
  } else {
    document.getElementById("admission-date-label").innerHTML = 'Admission Date:'; 
    document.getElementById("discharge-date-wrapper").style.display = 'block'; 
  }
}