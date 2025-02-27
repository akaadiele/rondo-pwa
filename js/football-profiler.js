

const nationalitySelect = document.getElementById("nationalitySelect");
const positionSelect = document.getElementById("positionSelect");

const currentURL = document.URL
// const currentBaseURL = currentURL.split('football-profiler.html')[0];

// const restCountriesURL = "https://restcountries.com/v2/all?fields=name,demonym,alpha2Code";
const restCountriesURL = "https://restcountries.com/v2/all?fields=demonym";
const positionsJson = "./positions.json";

// Get list of countries / nationality:
getNationalities();

// Get list of countries / nationality:
getPositions();




// Fetch country info from API
async function getNationalities() {
    fetch(restCountriesURL)
        .then((response) => response.json())
        .then(function (data) {
            let countries = data;

            return countries.map(function (country) {
                // let countryName = country.name
                let countryNationality = country.demonym;
                // let countryShortName = country.alpha2Code;

                nationalitySelect.innerHTML += `<option value="${countryNationality}">${countryNationality}</option>`;
            })
        })
        .catch(function (error) {
            console.log('error- ', error);
        });
}


// Fetch positions from json file
function getPositions() {
    fetch(positionsJson)
        .then((response) => response.json())
        .then((data) => {
            // console.log('data', data)
            data.forEach(position => {
                let positionName = position.name;
                // let positionCode = position.code;
                // console.log('positionName', positionName)
                positionSelect.innerHTML += `<option value="${positionName}">${positionName}</option>`;
            })
        })
        .catch(function (error) {
            console.log('error- ', error);
        });
}