var base_url = window.location.origin;
(function() {
  
  const firstName = sessionStorage.getItem("patientFirstName")
  const lastName = sessionStorage.getItem("patientLastName")
  const id = sessionStorage.getItem("patientID")
  let imagingHistory = JSON.parse(sessionStorage.getItem("imagingHistory"))
  // console.log(imagingHistory)
  document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
  document.getElementById("patient-id").innerHTML = 'NHS Number:' + id
  
  // scanType = window.location.href.split('/')[4]
  console.log(document.referrer)
  document.getElementById("back-to-scan-type").href = document.referrer
  // const admissionDate = document.getElementById('#id_admissionDate')
  // const dischargeDate = document.getElementById('#id_dischargeDate')

  $(document).ready(function() {
    $('#id_date').datepicker({dateFormat: "yy-mm-dd"});
  });

  console.log(document.referrer.split('/'))
  if (document.referrer.split('/')[3] === "scan-type") {
    labName = document.referrer.split('/')[4]
    console.log(labName)
    if (labName === "Medical-Photography") {
      labName = "Medical Photography"
    }
    console.log(labName)
    $(document).ready(function(){
      $('#id_scanType').val(labName);
    });
  }

  $(document).ready(function(){
    $('#id_image').attr("multiple","true");
  });

  let inputs = $("p input, p textarea, p select")

  $("#patient-imaging-history-add-entry").submit(function(eventObj) {
    // let newImagingHistory = {}
    // // console.log(inputs)
    // inputs.each(function () {
    //   // console.log($(this))
    //   let attr = $(this).attr("name");
    //   console.log(attr)
    //   let value = $(this).val();
    //   let valid_attrs = ["date", "scanType", "region", "indication", "report", "image"]
    //   // console.log(valid_attrs.includes(attr))
    //   if (valid_attrs.includes(attr)) {
    //     if (attr === "report") {
    //       newImagingHistory[attr] = value.replace(/C:\\fakepath\\/, '/media/imagingreports/');
    //       // console.log(base_url)
    //       // console.log(newMedicalHistory[attr])
    //     } else if (attr === "image"){
    //       // const images = $(this)[0].files
    //       // console.log($(this)[0].files);
    //       const arr = Array.from($(this)[0].files)
    //       var imageNames = []
    //       arr.forEach(f => imageNames.push('/media/imagingattachments/' + f.name))
    //       // console.log(imageNames)
    //       newImagingHistory[attr] = imageNames;
    //     } else {
    //       newImagingHistory[attr] = value;
    //     }
    //   }
      
    // })
    // console.log(newImagingHistory)
    // console.log(newImagingHistory["image"])
    // valid_attrs.forEach
    let patientId = sessionStorage.getItem("patientID");
    let patientName = sessionStorage.getItem("patientName");
    $(this).append(`<input type="hidden" name="patientId" value=${patientId} /> `);
    $(this).append(`<input type="hidden" name="patientName" value=${patientName} /> `);
    // console.log(newMedicalHistory.addToMedicalHistory)
    // medicalHistory.push(newMedicalHistory)
    // imagingHistory.unshift(newImagingHistory)
    // console.log(medicalHistory)
    imagingHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    // console.log(medicalHistory)
    sessionStorage.setItem("imagingHistory",JSON.stringify(imagingHistory))
    return true;
});
})();