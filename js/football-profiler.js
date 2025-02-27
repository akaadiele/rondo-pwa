// Getting HTML elements
const nationalitySelect = document.getElementById("nationalitySelectEdit");
const positionSelect = document.getElementById("positionSelectEdit");


getNationalities();     // Get list of countries / nationality
getPositions();     // Get list of positions



// Fetch country info from API
async function getNationalities() {
    const restCountriesURL = "https://restcountries.com/v2/all?fields=demonym";     // API URL

    fetch(restCountriesURL)
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


