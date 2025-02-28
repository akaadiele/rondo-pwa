// Getting HTML elements
const themeSelect = document.getElementById("themeSelect");
const languageSelect = document.getElementById("languageSelect");


getThemes();     // Get list of themes
getLanguages();     // Get list of languages



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




// // Caching
// const settingsCache = 'settings-v1';
// caches.open(settingsCache).then(cache => {
//     cache.put(userId, userId_value);
//     cache.put(language, language_value);
//     cache.put(theme, theme_value);
// });