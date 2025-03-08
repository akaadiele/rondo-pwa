// <-- Generic reusable codes, global variables, etc -->

// ------------------------------------------------------------------------------------------------------------
// Variables

// Firestore DB Collection
const rondoUserInfoCollection = 'rondo-user-info';  // User Info
const rondoUserSettingsCollection = 'rondo-user-settings';  // User Settings

// Google Maps API
const googleMapApiKey = "AIzaSyCbvT_-aAvCZGD1uR70C5CUVHCEh3UK4Yo";

// Local Storage Items
const localStorageRondoUsername = "rondoUsername";
const localStorageRondoProfilePic = "rondoProfilePicUrl";
const localStorageRondoProfilePicName = "rondoProfilePicName";
const localStorageRondoShortName = "rondoShortName";


// ------------------------------------------------------------------------------------------------------------
// Functions

function createNode(element) {
    // Function to create new HTML element
    return document.createElement(element);
}


function append(parent, child) {
    // Function to append HTML elements
    return parent.appendChild(child);
}


function showSnackbar(snackbarMessage) {
    // Create the snackbar DIV and append to 'body' element
    const snackbarDiv = createNode('div');
    snackbarDiv.setAttribute('id', 'snackbar');
    snackbarDiv.innerHTML = snackbarMessage;

    let bodyElement = document.getElementById("body");
    append(bodyElement, snackbarDiv);
    
    // Add the "show" class to DIV
    snackbarDiv.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { snackbarDiv.className = snackbarDiv.className.replace("show", ""); }, 3000);
}

// ------------------------------------------------------------------------------------------------------------
// For 'home.html'

const urlPageSplit = document.URL.split('pages/'); const pageName = urlPageSplit[1];
// if (pageName == "home.html") {
if (document.getElementById("recognizeUser")) {
    // Get items from local storage
    let storedShortName = localStorage.getItem(localStorageRondoShortName);

    // Modify the text
    if ((storedShortName != "") && (storedShortName != undefined)) {
        document.getElementById("recognizeUser").innerHTML += " " + storedShortName;
    }
}

// ------------------------------------------------------------------------------------------------------------