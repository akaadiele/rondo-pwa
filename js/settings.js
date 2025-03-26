// ------------------------------------------------------------------------------------------------------------
// // Load profile data on page load
document.addEventListener("DOMContentLoaded", initialSettingsData);

// ------------------------------------------------------------------------------------------------------------
// // Variable declarations

// Getting HTML elements
const themeSelect = document.getElementById("themeSelect");
const languageSelect = document.getElementById("languageSelect");
const fontSizeSelect = document.getElementById("fontSizeSelect");

// Get username from local storage
let storedUsername = localStorage.getItem(localStorageRondoUsername);

// Interval variables
let checkReloading; let intervalSeconds = 0.5; let timerCount = 0; let timerCountMax = 2;

// ------------------------------------------------------------------------------------------------------------

// Trigger function to cache settings from the sw.js
document.getElementById('updateSettings').addEventListener('click', updateSettingsInfo);

// ------------------------------------------------------------------------------------------------------------
// // Functions

async function getThemes() {
    // Fetch theme info from json file
    const themesJson = "../js/json/themes.json";   // Path to file

    fetch(themesJson)
        .then((response) => response.json())
        .then((data) => {
            data.forEach(theme => {
                let themeName = theme.name;
                // let themeCode = theme.code;

                themeSelect.innerHTML += `<option class="font-size" value="${themeName}" id="${themeName}">${themeName}</option>`;
            })
        })
        .catch(function (error) {
            // console.log('error: ', error);
            themeSelect.innerHTML = `<option class="font-size" value="">Error loading options</option>`;
        });
}



async function getLanguages() {
    // Fetch languages from json file
    const languagesJson = "../js/json/languages.json";   // Path to file

    fetch(languagesJson)
        .then((response) => response.json())
        .then((data) => {
            data.forEach(language => {
                let languageName = language.name;
                // let languageCode = language.code;

                languageSelect.innerHTML += `<option class="font-size" value="${languageName}" id="${languageName}">${languageName}</option>`;
            })
        })
        .catch(function (error) {
            // console.log('error: ', error);
            languageSelect.innerHTML = `<option class="font-size" value="">Error loading options</option>`;
        });
}



async function getFontSizes() {
    // Fetch font sizes from json file
    const fontSizesJson = "../js/json/fontSizes.json";   // Path to file

    fetch(fontSizesJson)
        .then((response) => response.json())
        .then((data) => {
            data.forEach(fontSize => {
                let fontSizeName = fontSize.name;
                // let fontSizeCode = fontSize.code;

                fontSizeSelect.innerHTML += `<option class="font-size" value="${fontSizeName}" id="${fontSizeName}">${fontSizeName}</option>`;
            })
        })
        .catch(function (error) {
            // console.log('error: ', error);
            fontSizeSelect.innerHTML = `<option class="font-size" value="">Error loading options</option>`;
        });
}



function initialSettingsData() {
    // Initialize settings data for current football profile
    readUserSettings(); // Read user settings from firebase

    if (storedUsername) {
        rondoDb.collection(rondoUserSettingsCollection).doc(storedUsername).get().then((doc) => {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                rondoUserSettings = doc.data();

                if (!rondoUserSettings.theme) { rondoUserSettings.theme = ''; }
                themeSelect.innerHTML = `<option class="font-size" value="${rondoUserSettings.theme}" id="${rondoUserSettings.theme}">${rondoUserSettings.theme}</option>`;
                themeSelect.innerHTML += `<option class="font-size" value="" id="">----------</option>`;

                if (!rondoUserSettings.language) { rondoUserSettings.language = ''; }
                languageSelect.innerHTML = `<option class="font-size" value="${rondoUserSettings.language}" id="${rondoUserSettings.language}">${rondoUserSettings.language}</option>`;
                languageSelect.innerHTML += `<option class="font-size" value="" id="">----------</option>`;

                if (!rondoUserSettings.fontSize) { rondoUserSettings.fontSize = ''; }
                fontSizeSelect.innerHTML = `<option class="font-size" value="${rondoUserSettings.fontSize}" id="${rondoUserSettings.fontSize}">${rondoUserSettings.fontSize}</option>`;
                fontSizeSelect.innerHTML += `<option class="font-size" value="" id="">----------</option>`;

                getThemes();     // Get list of themes
                getLanguages();     // Get list of languages
                getFontSizes();     // Get list of font sizes

            } else {
                // doc.data() will be undefined in this case
                // console.log("No such document!");
                showSnackbar("! Football profile setup required");
            }
        }).catch((error) => {
            // console.log("Error getting document:", error);
        });
    }
    else {
        // doc.data() will be undefined in this case
        // console.log("No such document!");
        showSnackbar("! Football profile setup required");
    }
}



function updateSettingsInfo() {
    // Update setting data for user on firebase
    const theme_value = themeSelect.value;
    const language_value = languageSelect.value;
    const fontSize_value = fontSizeSelect.value;

    if (storedUsername) {
        // New profile
        rondoDb.collection(rondoUserSettingsCollection).doc(storedUsername).get().then((doc) => {
            if (doc.exists) {
                const userSettings = {
                    theme: theme_value,
                    language: language_value,
                    fontSize: fontSize_value,
                    source: "rondoApp"
                };

                rondoDb.collection(rondoUserSettingsCollection).doc(storedUsername).set(userSettings)
                    .catch(err => {
                        // console.log(err);
                        showSnackbar("Error in updating settings");
                    });

                showSnackbar("Settings updated");
                initialSettingsData();

                localStorage.setItem(localStorageRondoFontSize, fontSize_value);    // Update font size on local storage
                setFontSize();  // Update font size

                checkReloading = setInterval(reloadPage, intervalSeconds * 1000); // Start timed event
            } else {
                showSnackbar("! Football profile setup required");
            }
        }).catch((error) => {
            // console.log("Error getting document:", error);
            showSnackbar("Unable to update while offline");
        });
    } else {
        showSnackbar("! Football profile setup required");
    }
}



function reloadPage() {
    // Timed event to trigger 'initialSettingsData()' function automatically

    timerCount += 1;
    if (timerCount < timerCountMax) {
        location.reload();  // Reload page
    } else {
        timerCount = 0;
        clearInterval(checkReloading);    // Stop timed event
    }
}

// ------------------------------------------------------------------------------------------------------------
