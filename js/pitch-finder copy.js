// Initial search with current location
// document.addEventListener("DOMContentLoaded", getCurrentLocation);  // trigger at point of loading page

const mileToMeterConv = 1600;


function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(searchFromCurrentLocation);
    } else {
        throwFormattedError(`! ERROR: Geolocation is not supported by this browser.`)
    }
}
function searchFromCurrentLocation(position) {
    defaultLocation = position.coords.latitude + ", " + position.coords.longitude;
    searchResultsList.innerHTML = '';
    googleNearbySearch(defaultLocation);
}
// >>>


// List group for search results
const searchResultsList = document.getElementById('pitchSearchResults');

// Function to call when searching with search box
// document.getElementById('searchButton').addEventListener('click', searchPitch)
document.getElementById('searchButton').addEventListener('click', evt => {
    evt.preventDefault();
    searchPitch();
})

// search by using the enter button on search box
document.getElementById('searchBox').addEventListener('keydown', (clicked) => {
    if (clicked.key === 'Enter') {
        searchPitch();
    }
})



// Search with address input 
function searchPitch() {
    // Content of search box
    searchText = document.getElementById('searchBox').value;
    console.log(searchText);
    if (searchText == "") {
        getCurrentLocation();
    } else {
        geocodeAddress(searchText);
    }
}
// >>>




// Autocomplete feature on search box
let autocomplete;
async function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('searchBox'),
        {
            types: ['establishment'],
            // componentRestrictions: { 'country': ['AU'] },
            fields: ['place_id', 'geometry', 'name', 'formatted_address', 'geometry.location']
        });
    autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
    var place = autocomplete.getPlace();

    if (!place.formatted_address) {
        document.getElementById('searchBox').placeholder = '';
        document.getElementById('searchBox').value = '';
    } else {
        document.getElementById('searchBox').placeholder = '';
        document.getElementById('searchBox').value = place.name + ", " + place.formatted_address;
        geocodeAddress(place.formatted_address);
    }
}
// >>>


// Geocoding: address to get latitud and longitude
function geocodeAddress(altAddress) {
    searchResultsList.innerHTML = '';
    altAddress = encodeURI(altAddress);

    let geocodeURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + altAddress + "&key=" + apiKey;
    // console.log("geocodeURL: " + geocodeURL);

    // Fetch contents from the API response and format contents to display as HTML elements
    fetch(geocodeURL)
        .then(response => response.text())
        .then(results => {
            const obj = JSON.parse(results);
            const resultJson = JSON.parse(result) || [];

            console.log("results - " + results);
            console.log("results.geo: " + results.geometry.location.lng);


            altLocation = resultJson.geometry.location.lat + ", " + resultJson.geometry.location.lng;

            console.log("altLocation: " + altLocation);

            googleNearbySearch(altLocation);

        })
        .catch(error => {
            // Custom error response
            // console.error("Search Error:", error);
            // console.log("Search Error: ", error);
            throwFormattedError(`! ERROR: Invalid Address.`)
        });

}
// >>>




// formatting possible errors
function throwFormattedError(errorMessage) {
    const pitchLi = createNode('li');
    pitchLi.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start');

    const contentDiv = createNode('div');
    contentDiv.setAttribute('class', 'ms-2 me-auto fw-bold container justify-content-center');

    contentDivText = document.createTextNode(errorMessage);

    append(contentDiv, contentDivText);
    append(pitchLi, contentDiv);
    append(searchResultsList, pitchLi);
}
// >>>



// Nearby search for pitch with Google API
function googleNearbySearch(startLocation) {

    // Get radius in miles and convert to meters
    const radioButtons = document.querySelectorAll('input[name="radiusOptions"]');
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            let milesRadius = radioButton.value;
            searchRadius = milesRadius * mileToMeterConv;  // Converting to meters
            break;
        }
    }

    // Declaring variables
    const apiURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    const apiKeyword = "football+field";
    const baseURL = apiURL + "?key=" + apiKey + "&keyword=" + apiKeyword;

    let fullURL = baseURL + "&location=" + startLocation + "&radius=" + searchRadius;

    console.log('url- ', fullURL)

    // Fetch contents from the API response and format contents to display as HTML elements
    fetch(fullURL)
        .then(resp => {
            if (!resp.ok) throw new Error(`Search Error: ${resp.statusText}`);
            return resp.json();
        })
        .then(data => {
            const results = data.results || [];
            if (!results.length) {
                // console.warn(`No results found`);
                throwFormattedError(`! ERROR: No results found.`)
                return;
            }

            results.forEach(result => {
                // Creating HTML elements
                // Building list and list contents
                const pitchLi = createNode('li');
                pitchLi.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start');

                const contentDiv = createNode('div');
                contentDiv.setAttribute('class', 'ms-2 me-auto fw-bold');
                contentDiv.innerHTML = `<i class="fa-solid fa-map-pin"></i> ${result.name}`;

                const viewSpan = createNode('span');
                viewSpan.setAttribute('class', 'badge text-bg-dark rounded-pill');
                viewSpan.innerHTML = `<a href="pitch-details.html?pitch=${result.place_id}"><i class="fa-solid fa-eye"></i></a>`;


                append(pitchLi, contentDiv);
                append(pitchLi, viewSpan);
                append(searchResultsList, pitchLi);
            });
        })
        .catch(error => {
            // Custom error response
            // console.error("Search Error:", error);
            // console.log("url: " + fullURL)
            throwFormattedError(`! ERROR: Search Failure.`);
        });
}
// >>>