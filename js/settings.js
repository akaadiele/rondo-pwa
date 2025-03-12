// ------------------------------------------------------------------------------------------------------------
// Load profile data on page load
document.addEventListener("DOMContentLoaded", initialSettingsData);


// Getting HTML elements
const themeSelect = document.getElementById("themeSelect");
const languageSelect = document.getElementById("languageSelect");
const fontSizeSelect = document.getElementById("fontSizeSelect");

// Get username from local storage
let storedUsername = localStorage.getItem(localStorageRondoUsername);

// Interval variables
let checkReloading; let intervalSeconds = 0.5; let timerCount = 0; let timerCountMax = 2;

// Trigger function to cache settings from the sw.js
document.getElementById('updateSettings').addEventListener('click', updateSettingsInfo);


// ------------------------------------------------------------------------------------------------------------
// Functions


// Fetch theme info from json file
async function getThemes() {
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



// Fetch languages from json file
async function getLanguages() {
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



// Fetch font sizes from json file
async function getFontSizes() {
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




// Initialize settings data for current football profile
function initialSettingsData() {
    readUserSettings(); // Read user settings from firebase

    // if (storedUsername) {
    //     console.log('userTheme', userTheme);
    //     console.log('userLanguage', userLanguage);
    //     console.log('userFontSize', userFontSize);

    //     if ((userTheme != undefined) && (userLanguage != undefined) && (userFontSize != undefined)) {
    //         themeSelect.innerHTML = `<option class="font-size" value="${userTheme}" id="${userTheme}">${userTheme}</option>`;
    //         themeSelect.innerHTML += `<option class="font-size" value="" id="">----------</option>`;

    //         languageSelect.innerHTML = `<option class="font-size" value="${userLanguage}" id="${userLanguage}">${userLanguage}</option>`;
    //         languageSelect.innerHTML += `<option class="font-size" value="" id="">----------</option>`;

    //         fontSizeSelect.innerHTML = `<option class="font-size" value="${userFontSize}" id="${userFontSize}">${userFontSize}</option>`;
    //         fontSizeSelect.innerHTML += `<option class="font-size" value="" id="">----------</option>`;

    //         getThemes();     // Get list of themes
    //         getLanguages();     // Get list of languages
    //         getFontSizes();     // Get list of font sizes
    //     }
    // }

    if (storedUsername) {
        rondoDb.collection(rondoUserSettingsCollection).doc(storedUsername).get().then((doc) => {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                rondoUserSettings = doc.data();

                if (!rondoUserSettings.theme) { rondoUserSettings.theme = ''; }
                themeSelect.innerHTML = `<option class="font-size" value="${rondoUserSettings.theme}" id="${rondoUserSettings.theme}">${rondoUserSettings.theme}</option>`;
                themeSelect.innerHTML += `<option class="font-size" value="" id="">----------</option>`;
                // getThemes();     // Get list of themes

                if (!rondoUserSettings.language) { rondoUserSettings.language = ''; }
                languageSelect.innerHTML = `<option class="font-size" value="${rondoUserSettings.language}" id="${rondoUserSettings.language}">${rondoUserSettings.language}</option>`;
                languageSelect.innerHTML += `<option class="font-size" value="" id="">----------</option>`;
                // getLanguages();     // Get list of languages

                if (!rondoUserSettings.fontSize) { rondoUserSettings.fontSize = ''; }
                fontSizeSelect.innerHTML = `<option class="font-size" value="${rondoUserSettings.fontSize}" id="${rondoUserSettings.fontSize}">${rondoUserSettings.fontSize}</option>`;
                fontSizeSelect.innerHTML += `<option class="font-size" value="" id="">----------</option>`;
                // getfontSizes();     // Get list of fontSizes

                getThemes();     // Get list of themes
                getLanguages();     // Get list of languages
                getFontSizes();     // Get list of font sizes

            } else {
                // doc.data() will be undefined in this case
                // console.log("No such document!");
                showSnackbar("! Football profile setup required*");
            }
        }).catch((error) => {
            // console.log("Error getting document:", error);
        });
    }
    else {
        // doc.data() will be undefined in this case
        // console.log("No such document!");
        showSnackbar("! Football profile setup required**");
    }
}



// Update setting data for user on firebase
function updateSettingsInfo() {
    const theme_value = themeSelect.value;
    const language_value = languageSelect.value;
    const fontSize_value = fontSizeSelect.value;

    if (storedUsername) {
        // New profile
        rondoDb.collection(rondoUserSettingsCollection).doc(storedUsername).get().then((doc) => {
            if (doc.exists) {
                // let rondoUserSettings = doc.data();

                const userSettings = {
                    theme: theme_value,
                    language: language_value,
                    fontSize: fontSize_value
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

                // location.reload();  // Reload to take effect
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

// ------------------------------------------------------------------------------------------------------------
// Timed event to trigger 'initialSettingsData()' function automatically

function reloadPage() {
    timerCount += 1;

    if (timerCount < timerCountMax) {
        // console.log('reloading');
        location.reload();  // Reload to take effect
    } else {
        timerCount = 0;
        clearInterval(checkReloading);    // Stop timed event
    }
}

// ------------------------------------------------------------------------------------------------------------
