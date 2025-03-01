// Getting HTML elements
const themeSelect = document.getElementById("themeSelect");
const languageSelect = document.getElementById("languageSelect");


getThemes();     // Get list of themes
getLanguages();     // Get list of languages

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
            themeSelect.innerHTML += `<option value="">Error loading options</option>`;
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
            languageSelect.innerHTML += `<option value="">Error loading options</option>`;
        });
}


function updateSettingsInfo() {
    const userId_value = '1';  // update to pick from firebase
    const theme_value = themeSelect.value;
    const language_value = languageSelect.value;
    // userId_value, theme_value, language_value

}