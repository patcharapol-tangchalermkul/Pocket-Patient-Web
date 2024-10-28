// Get the current URL
var currentUrl = window.location.href;

var base_url = window.location.origin;
// Define the URLs that should not trigger data removal
var exemptUrls = [base_url + '/edit-medication/', base_url + '/add-medication/'];

// Check if the current URL matches any exempt URL
var shouldRemoveData = !exemptUrls.includes(currentUrl)

const value = sessionStorage.getItem('medicationDict');


// Remove the data from localStorage if necessary
if (shouldRemoveData) {
  console.log('Removing data from sessionStorage...');
  sessionStorage.setItem('medicationDict', "No data");
}


if (currentUrl.includes(base_url + '/add-medication') && 
    (value === null || value === undefined)) {
    window.location.href = "/main"
}