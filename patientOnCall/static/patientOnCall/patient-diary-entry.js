(function() {
  
  const firstName = sessionStorage.getItem("patientFirstName")
  const lastName = sessionStorage.getItem("patientLastName")
  const patientID = sessionStorage.getItem("patientID")

  document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
  document.getElementById("patient-id").innerHTML = 'NHS Number:' + patientID

  getDiaryData();
  addBackButtonRedirectListener();
})();


function getDiaryIDFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const diaryId = urlParams.get('diaryId');
  return diaryId;
}

function getDiaryData() {
  let diaryId = getDiaryIDFromUrl();
  $.ajax({
    method: "POST",
    url: base_url + "/api/doctor/patient-data/diary/entry/",
    data: {
      "diaryId": diaryId
    },
    success: function(returned_value) {
      if (returned_value.ok == true) {
        console.log(returned_value["diary-data"]);
        loadDiaryData(returned_value["diary-data"]);
      }
    },
    error: function (xhr) {
      console.log(xhr);
    }
  })
}

function loadDiaryData(diary) {
  setDiaryDate(diary["date"]);
  setDiaryContent(diary["content"]);
}

function setDiaryDate(date) {
  $("#diary-entry-date").text(date);
}

function setDiaryContent(content) {
  $("#diary-entry-content").text(content);
}

function addBackButtonRedirectListener() {
  $("#back-to-category-btn").click(function (e) { 
    e.preventDefault();
    
    let category = getCategoryFromUrl();
    window.location.href = base_url + `/patient-diary/?category=${category}`;
  });
}

function getCategoryFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const category = urlParams.get('category');

  return category != null && category != undefined ? category : undefined;    
}