// <-- Generic reusable codes, global variables, etc -->

// ------------------------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", loadFunctions);
function loadFunctions() {
    readUserSettings(); // Read user settings from firebase
    setFontSize();  // Update font size
}

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
const localStorageRondoFontSize = "rondoFontSize";

// User settings variables
let loggedInUsername, userTheme, userLanguage, userFontSize;
let sysFontSizeClass, storedFontSize;

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
// Read user settings from firebase


function readUserSettings() {
    loggedInUsername = localStorage.getItem(localStorageRondoUsername);   // Get username from local storage

    if (loggedInUsername) {
        rondoDb.collection(rondoUserSettingsCollection).doc(loggedInUsername).get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                rondoUserSettings = doc.data();

                userTheme = rondoUserSettings.theme;
                userLanguage = rondoUserSettings.language;
                userFontSize = rondoUserSettings.fontSize;

                if ( (!userTheme) || ( userTheme == undefined) ) { userTheme = '' ;}
                if ( (!userLanguage) || ( userLanguage == undefined) ) { userLanguage = '' ;}
                if ( (!userFontSize) || ( userFontSize == undefined) ) { userFontSize = '' ;}
                
                localStorage.setItem(localStorageRondoFontSize, userFontSize);    // Update font size on local storage        


            } else {
                userTheme = ''; userLanguage = ''; userFontSize = '';
            }
        }).catch((error) => {
            // console.log("Error getting document:", error);
            userTheme = ''; userLanguage = ''; userFontSize = '';
        });
    } else {
        userTheme = ''; userLanguage = ''; userFontSize = '';
    }
}

// ------------------------------------------------------------------------------------------------------------
// Setting font size

function setFontSize() {
    storedFontSize = localStorage.getItem(localStorageRondoFontSize);   // Get username from local storage

    if (storedFontSize) {
        console.log('storedFontSize', storedFontSize);

        switch (storedFontSize) {
            case "Normal":
                sysFontSizeClass = "fs-6";
                break;
            case "Large":
                sysFontSizeClass = "fs-3";
                break;
            case "Extra-Large":
                sysFontSizeClass = "fs-1";
                break;
            default:
                sysFontSizeClass = "";
        }

        // Selecting all html elements with 'font-size' class
        fontSizeElements = document.querySelectorAll(".font-size");
        fontSizeElements.forEach(element => {
            // Replace with class for font size
            element.classList.replace("font-size", sysFontSizeClass);
            // element.classList.replace("font-size", "fs-1");
        });

        console.log('font size updated');

    }
}

// ------------------------------------------------------------------------------------------------------------

