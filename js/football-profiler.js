// Getting HTML elements
const nationalitySelect = document.getElementById("nationalitySelectEdit");
const positionSelect = document.getElementById("positionSelectEdit");


getNationalities();     // Get list of countries / nationality
getPositions();     // Get list of positions



// Fetch country info from API
async function getNationalities() {
    const apiURL_restCountries = encodeURI("https://restcountries.com/v2/all?fields=demonym");     // API URL

    fetch(apiURL_restCountries)
        .then((response) => response.json())
        .then(function (data) {
            let countries = data;

            return countries.map(function (country) {
                // let countryName = country.name
                let countryNationality = country.demonym;
                // let countryShortName = country.alpha2Code;

                nationalitySelect.innerHTML += `<option value="${countryNationality}" id="${countryNationality}">${countryNationality}</option>`;
            })
        })
        .catch(function (error) {
            // console.log('error: ', error);
            positionSelect.innerHTML += `<option value="">Error loading options</option>`;
        });
}



// Fetch positions from json file
async function getPositions() {
    const positionsJson = "../js/json/positions.json";   // Path to file

    fetch(positionsJson)
        .then((response) => response.json())
        .then((data) => {
            data.forEach(position => {
                // let positionName = position.name;
                let positionCode = position.code;
                
                positionSelect.innerHTML += `<option value="${positionCode}" id="${positionCode}">${positionCode}</option>`;
            })
        })
        .catch(function (error) {
            // console.log('error: ', error);
            positionSelect.innerHTML += `<option value="">Error loading options</option>`;
        });
}



// // Caching
// const userCache = 'user-v1';
// caches.open(userCache).then(cache => {
//     cache.put(userId, userId_value);
//     cache.put(name, name_value);
//     cache.put(position, position_value);
//     cache.put(nationality, nationality_value);
//     cache.put(age, age_value);
//     cache.put(height, height_value);
//     cache.put(weight, weight_value);    
// });