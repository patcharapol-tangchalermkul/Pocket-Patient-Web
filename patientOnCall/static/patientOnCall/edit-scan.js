(function() {
    const firstName = sessionStorage.getItem("patientFirstName")
    const lastName = sessionStorage.getItem("patientLastName")
    const id = sessionStorage.getItem("patientID")
    
    document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
    document.getElementById("patient-id").innerHTML = 'NHS Number:' + id

    document.getElementById("back-to-scan-type").href = document.referrer
    rowNum = window.location.href.split('/')[5]
    getScanEntry(rowNum-1)
})();

function getScanEntry(entryNum) {
    const imagingHistory = JSON.parse(sessionStorage.getItem("imagingHistory"))
    const imagingUploads = JSON.parse(sessionStorage.getItem("imagingUploads"))
    const date = imagingHistory[entryNum]["date"]
    const scanType = imagingHistory[entryNum]["scanType"]
    const region = imagingHistory[entryNum]["region"]
    const indication = imagingHistory[entryNum]["indication"]
    const report = imagingHistory[entryNum]["report"]

    if (scanType === "Medical Photography") {
        $(".section-header").html(scanType + ": " + date)
    } else {
        $(".section-header").html(scanType + " Scan: " + date)
    }
    // document.getElementById("visit-title").innerHTML = "Visit Entry:" + admissionDate  
    document.getElementById("entry-date").innerHTML = date
    document.getElementById("entry-scan-type").innerHTML = scanType
    document.getElementById("entry-region").innerHTML = region
    document.getElementById("entry-indication").innerHTML = indication
    // document.getElementById("entry-report").innerHTML = report 
    
    const uploadURL = 'upload-report/' + imagingHistory[entryNum]["id"]
    console.log(uploadURL)
    const reportForm = document.getElementById("upload-report-form")
    reportForm.setAttribute('action',uploadURL)
    const entryReport = document.getElementById("entry-report")
    
    console.log(report)
    if  (report === 'False' || report === (base_url + '/media/False')) {
        $("#upload-report-form").submit(function(eventObj) {
            var reportUpload = $('#report-upload').val().replace(/C:\\fakepath\\/, '/media/imagingreports/');
            console.log(reportUpload)
            imagingHistory[entryNum]["report"] = reportUpload
            console.log(imagingHistory[entryNum]["report"])
            sessionStorage.setItem("imagingHistory",JSON.stringify(imagingHistory))
            return true; 
        });       
    } else {
        reportForm.remove()
        const entryReportLink = document.createElement("a");
        entryReportLink.textContent = scanType + " Report"
        entryReportLink.href = report
        entryReport.append(entryReportLink)
    } 

    const entryImages = document.getElementById("entry-images")
    const entryID = imagingHistory[entryNum]["id"]
      // console.log(entryID === undefined)
      var images = []
      if (entryID === undefined) {
          images = imagingHistory[entryNum]['image']
        } else {
            imagesEntries = imagingUploads.filter(function(item){
                return item.imagingEntry == entryID;         
            });
            imagesEntries.forEach(f => images.push(f['image']))
        }
    
    for(var i = 0; i < images.length; i ++) {
        var entryImage = "entryImage-" + i 
        entryImage = document.createElement("a");
        entryImage.classList.add("add-lab-button");
        entryImage.textContent = region + "-img-" + (i+1) + "\n"
        entryImage.href = images[i]
        entryImages.appendChild(entryImage)
    }
    
    console.log(images)
    const uploadImgURL = 'upload-images/' + imagingHistory[entryNum]["id"]
    const imagesForm = document.getElementById("upload-images-form")
    imagesForm.setAttribute('action',uploadImgURL)

    $("#upload-images-form").submit(function(eventObj) {
        // var imagesUpload = $('#image-upload').val().replace(/C:\\fakepath\\/, '/media/imagingattachments/');
        // console.log(imagesUpload)
        // const images = $(this)[0].files
          // console.log($(this)[0].files);
        console.log($('#images-upload')[0].files)
        const arr = Array.from($('#images-upload')[0].files)
        var imageNames = []
        arr.forEach(f => imageNames.push('/media/imagingattachments/' + f.name))
        console.log(imageNames)
        
        for( var i = 0; i < imageNames.length; i ++ ) {
            let newImagingUpload = {}
            newImagingUpload["imagingEntry"] = imagingHistory[entryNum]["id"];
            newImagingUpload["image"] = imageNames[i]
            imagingUploads.push(newImagingUpload)
        }
        
        sessionStorage.setItem("imagingUploads",JSON.stringify(imagingUploads))
        return true; 
    });       
}