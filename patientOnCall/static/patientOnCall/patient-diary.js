var base_url = window.location.origin;
var _category;

(function() {  
  const firstName = sessionStorage.getItem("patientFirstName")
  const lastName = sessionStorage.getItem("patientLastName")
  const id = sessionStorage.getItem("patientID")

  document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
  document.getElementById("patient-id").innerHTML = 'NHS Number:' + id

  insertRelatedDiaryEntries();
})();

function insertRelatedDiaryEntries() {
  let entries = getRelatedDiaryEntries();
  if (entries != undefined) {
    let i = 0;
    for (entry of entries) {
      addDiaryEntry(
        i,
        entry["id"],
        entry["date"],
        entry["content"],
        entry["readByDoctor"],
        i == 0
      )
      i++;
    }
  } else {
    console.error("No such category found!");
    return;
  }
}

function getRelatedDiaryEntries() {
  let category = getCategoryFromUrl();
  console.log(`category: ${category}`);
  if (category === undefined) { 
    console.error("No category provided!");
    return;
  }

  // Has category passed as parameter in url
  let diary = JSON.parse(sessionStorage.getItem("patientDiary"));
  for (key of Object.keys(diary)) {
    if (key.replace(/ /g,'').toLowerCase() == category) {
      // Set header category label
      $("#category-label").text(`Category: ${key}`);

      // Set global category variable
      _category = key;

      return diary[key];
    }
  }
  return undefined;
}

function getCategoryFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const category = urlParams.get('category');

  return category != null && category != undefined ? category : undefined;    
}

function addDiaryEntry(rowNum, id, date, content, readByDoctor, isLastRow) {
  var table = document.getElementById("main-patient-diary-box-table");

  let isReadByDoctorElem = document.createElement("div");
  isReadByDoctorElem.classList.add("read-by-doctor-indicator-col");
  isReadByDoctorElem.setAttribute("diary-id", id);
  isReadByDoctorElem.innerHTML = "*";
  if (readByDoctor) { isReadByDoctorElem.classList.add("invisible"); }

  let dateElem = document.createElement("div");
  dateElem.classList.add("info-table-item", "diary-date", "diary-info",`row-${rowNum}`);
  if (isLastRow) { dateElem.classList.add("last-row"); }
  if (!readByDoctor) { dateElem.classList.add("not-read-by-doctor-info"); }
  dateElem.setAttribute("id", `diary-date-${rowNum}`);
  dateElem.setAttribute("diary-id", id);
  dateElem.innerHTML = date;

  let contentElem = document.createElement("div");
  contentElem.classList.add("info-table-item", "diary-content", "diary-info", `row-${rowNum}`);
  if (isLastRow) { contentElem.classList.add("last-row"); }
  if (!readByDoctor) { contentElem.classList.add("not-read-by-doctor-info"); }
  contentElem.setAttribute("id", `diary-content-${rowNum}`);
  contentElem.setAttribute("diary-id", id);
  let contentTextElem = document.createElement("div");
  contentTextElem.classList.add("diary-content-text");
  contentTextElem.innerHTML = content;
  contentElem.appendChild(contentTextElem);

  let columnTitleElem = document.getElementById("info-table-content-title");

  table.insertBefore(contentElem, columnTitleElem.nextSibling);
  table.insertBefore(dateElem, columnTitleElem.nextSibling);
  table.insertBefore(isReadByDoctorElem, columnTitleElem.nextSibling);

  row_hover(rowNum);
  row_click_redirect(rowNum);
}

function row_hover(rowNum) {
  var rowClass = 'row-' + rowNum 
  var row = document.getElementsByClassName(rowClass);
  for(var i = 0; i <  row.length; i ++) {
      row[i].onmouseover = function() {
        for (var j = 0; j < row.length; j++) {
          row[j].classList.add("hovered-row");
        }
      };
      row[i].onmouseout = function() {
        for (var j = 0; j < row.length; j++) {
          row[j].classList.remove("hovered-row");
        }
      };   
  }
}

function row_click_redirect(rowNum) {
  var rowClass = 'row-' + rowNum 
  var row = document.getElementsByClassName(rowClass);
  if (row.length <= 0) { return; }
  for(var i = 0; i < row.length; i ++) {
      row[i].onclick = function(event) {
        let diaryId = event.target.getAttribute("diary-id");
        setDiaryEntryToRead(diaryId);
        window.location.href = base_url + "/patient-diary/entry?diaryId=" 
          + diaryId + `&category=${_category.replace(/ /g,'').toLowerCase()}`;
      };
  }
}

function setDiaryEntryToRead(diaryId) {
  let diary = JSON.parse(sessionStorage.getItem("patientDiary"));
  for (key of Object.keys(diary)) {
    if (key === _category) {
      let entries = diary[key];
      var i = 0;
      for (entry of entries) {
        if (entry["id"] == diaryId) {
          entry["readByDoctor"] = true;
          entries[i] = entry;
          diary[key] = entries;
          sessionStorage.setItem("patientDiary", JSON.stringify(diary));
          return;
        }
        i++;
      }
    }
  }
}

function getNumOfExistingRows() {
  return ($(".info-table-item").length / 2) - 1;
}