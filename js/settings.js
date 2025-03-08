// ------------------------------------------------------------------------------------------------------------
// Load profile data on page load
document.addEventListener("DOMContentLoaded", initialSettingsData);


// Getting HTML elements
const themeSelect = document.getElementById("themeSelect");
const languageSelect = document.getElementById("languageSelect");

// Get username from local storage
let storedUsername = localStorage.getItem(localStorageRondoUsername);



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

                themeSelect.innerHTML += `<option value="${themeName}" id="${themeName}">${themeName}</option>`;
            })
        })
        .catch(function (error) {
            // console.log('error: ', error);
            themeSelect.innerHTML = `<option value="">Error loading options</option>`;
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

                languageSelect.innerHTML += `<option value="${languageName}" id="${languageName}">${languageName}</option>`;
            })
        })
        .catch(function (error) {
            // console.log('error: ', error);
            languageSelect.innerHTML = `<option value="">Error loading options</option>`;
        });
}



// Initialize settings data for current football profile
function initialSettingsData() {
    if (storedUsername) {
        rondoDb.collection(rondoUserSettingsCollection).doc(storedUsername).get().then((doc) => {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                rondoUserSettings = doc.data();

                themeSelect.innerHTML = `<option value="${rondoUserSettings.theme}" id="${rondoUserSettings.theme}">${rondoUserSettings.theme}</option>`;
                themeSelect.innerHTML += `<option value="" id="">----------</option>`;
                getThemes();     // Get list of themes
                
                languageSelect.innerHTML = `<option value="${rondoUserSettings.language}" id="${rondoUserSettings.language}">${rondoUserSettings.language}</option>`;
                languageSelect.innerHTML += `<option value="" id="">----------</option>`;
                getLanguages();     // Get list of languages

            } else {
                // doc.data() will be undefined in this case
                // console.log("No such document!");

                getThemes();     // Get list of themes
                getLanguages();     // Get list of languages

                showSnackbar("! Football profile setup required");
            }
        }).catch((error) => {
            // console.log("Error getting document:", error);
            getThemes();     // Get list of themes
            getLanguages();     // Get list of languages
        });
    } else {
        // doc.data() will be undefined in this case
        // console.log("No such document!");
        getThemes();     // Get list of themes
        getLanguages();     // Get list of languages

        showSnackbar("! Football profile setup required");
    }
}



// Update setting data for user on firebase
function updateSettingsInfo() {
    const theme_value = themeSelect.value;
    const language_value = languageSelect.value;

    if (storedUsername) {
        // New profile
        rondoDb.collection(rondoUserSettingsCollection).doc(storedUsername).get().then((doc) => {
            if (doc.exists) {
                // let rondoUserSettings = doc.data();

                const userSettings = {
                    theme: theme_value,
                    language: language_value
                };

                rondoDb.collection(rondoUserSettingsCollection).doc(storedUsername).set(userSettings)
                    .catch(err => {
                        // console.log(err);
                        showSnackbar("Error in updating settings");
                    });

                showSnackbar("Settings updated");
                initialSettingsData();
                // location.reload();
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
