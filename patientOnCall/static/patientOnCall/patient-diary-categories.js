var base_url = window.location.origin;

var categories = new Set();

(function() {
  
  const firstName = sessionStorage.getItem("patientFirstName")
  const lastName = sessionStorage.getItem("patientLastName")
  const patientID = sessionStorage.getItem("patientID")

  document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
  document.getElementById("patient-id").innerHTML = 'NHS Number:' + patientID

  checkIfOnlyOneCategory();
  insertDiaryCategories();
  addCategoriesClickRedirectListener();
})();

function checkIfOnlyOneCategory() {
  let diaryData = JSON.parse(sessionStorage.getItem("patientDiary"));
  if (Object.keys(diaryData).length <= 1) {
    $("#categories-grid-box").addClass("is-single");
  }
}

function checkIfMoreThanOneCategory() {
  let diaryData = JSON.parse(sessionStorage.getItem("patientDiary"));
  if (Object.keys(diaryData).length > 1) {
    $("#categories-grid-box").removeClass("is-single");
  }
}

function insertDiaryCategories() {
  let diaryData = JSON.parse(sessionStorage.getItem("patientDiary"));
  for (category of Object.keys(diaryData)) {
    let categoryElement = createCategoryElement(category);
    insertCategoryElement(categoryElement);
  }
}

function createCategoryElement(category) {
  let categoryElementBox = document.createElement("div");
  categoryElementBox.classList.add("category-item-box");
  let categoryElement = document.createElement("div");
  categoryElement.classList.add("category-item");
  categoryElement.id = category;
  categoryElement.innerText = category;
  categories.add(category);
  categoryElementBox.appendChild(categoryElement);
  return categoryElementBox;
}

function createNewCategoryElement() {
  let categoryElementBox = document.createElement("div");
  categoryElementBox.classList.add("category-item-box");
  let categoryElement = document.createElement("input");
  categoryElement.classList.add("category-item");
  categoryElement.id = "add-new-category";
  categoryElementBox.appendChild(categoryElement);
  insertCategoryElement(categoryElementBox);
  // Add event listener for "keydown" event
  categoryElement.addEventListener('keydown', function(event) {
  // Check if the pressed key is the "Enter" key
  if (event.key === "Enter") {
    console.log(categoryElement.value);
    // Call your function or perform the desired action
    if (categories.has(categoryElement.value)) {
      if (document.getElementById("category-taken") == null) {
        let categoryTaken = document.createElement("div");
        categoryTaken.id = "category-taken";
        categoryTaken.textContent = "This category already exists.";
        categoryElementBox.appendChild(categoryTaken);
        setTimeout(() => {
          deleteWarning(categoryTaken)
        }, 3000);
      }
    }
    else {
      categoryElementBox.remove();
      websocket.send(
        JSON.stringify(
          {
            "patientId": sessionStorage.getItem("patientID"),
            "event": "NEW_DIARY_CLASS",
            "contentType": categoryElement.value
          }
        )
      );
    }
  }
  if (event.key === 'Backspace' && categoryElement.value == "") {
    categoryElementBox.remove();
  }
});
}

function deleteWarning(categoryTaken) {
  console.log("deleting warning");
  categoryTaken.remove();
}

function insertCategoryElement(categoryElement) {
  $("#categories-grid-box").append(categoryElement);
}

function addCategoriesClickRedirectListener() {
  $(".category-item").click(function (e) { 
    e.preventDefault();

    let categorySelected = $(this).text();
    let categoryFormatted = categorySelected.replace(/ /g,'').toLowerCase();
    window.location.href = base_url + `/patient-diary/?category=${categoryFormatted}`;
  });
}

document.getElementById("add-category-button-box").addEventListener('click', function(e) {
  e.preventDefault();
  if (document.getElementById("add-new-category") == null) {
    createNewCategoryElement();
  }
  
});