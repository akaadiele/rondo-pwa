// Load profile data on page load
document.addEventListener("DOMContentLoaded", initialSettingsData);


// Getting HTML elements
const themeSelect = document.getElementById("themeSelect");
const languageSelect = document.getElementById("languageSelect");

// Get username from local storage
let storedUsername = localStorage.getItem(localStorageRondoUsername);



// Trigger function to cache settings from the sw.js
document.getElementById('updateSettings').addEventListener('click', updateSettingsInfo);



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





function initialSettingsData() {
    if (storedUsername) {
        rondoDb.collection(rondoUserInfoCollection).doc(storedUsername).get().then((doc) => {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                rondoUserData = doc.data();

                themeSelect.innerHTML = `<option value="${rondoUserData.theme}" id="${rondoUserData.theme}">${rondoUserData.theme}</option>`;
                themeSelect.innerHTML += `<option value="" id="">----------</option>`;
                getThemes();     // Get list of themes
                
                languageSelect.innerHTML = `<option value="${rondoUserData.language}" id="${rondoUserData.language}">${rondoUserData.language}</option>`;
                languageSelect.innerHTML += `<option value="" id="">----------</option>`;
                getLanguages();     // Get list of languages

            } else {
                // doc.data() will be undefined in this case
                // console.log("No such document!");

                getThemes();     // Get list of themes
                getLanguages();     // Get list of languages

                showSnackbar("Football profile setup required");
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

        showSnackbar("Football profile setup required");
    }
}




function updateSettingsInfo() {
    const theme_value = themeSelect.value;
    const language_value = languageSelect.value;

    if (storedUsername) {
        // New profile
        rondoDb.collection(rondoUserInfoCollection).doc(storedUsername).get().then((doc) => {
            if (doc.exists) {
                let rondoUserData = doc.data();
                const userInfo = {
                    name: rondoUserData.name,
                    position: rondoUserData.position,
                    nationality: rondoUserData.nationality,
                    age: rondoUserData.age,
                    height: rondoUserData.height,
                    weight: rondoUserData.weight,
                    theme: theme_value,
                    language: language_value,
                    password: rondoUserData.password
                };

                rondoDb.collection(rondoUserInfoCollection).doc(storedUsername).set(userInfo)
                    .catch(err => {
                        // console.log(err);
                        showSnackbar("Error in updating settings");
                    });

                showSnackbar("Settings updated");
                initialSettingsData();
                // location.reload();
            } else {
                showSnackbar("Football profile setup required");
            }
        }).catch((error) => {
            // console.log("Error getting document:", error);
            showSnackbar("Unable to update while offline");
        });
    } else {
        showSnackbar("Football profile setup required");
    }
}