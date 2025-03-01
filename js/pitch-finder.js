
// HTML List group for search results
const searchResultsList = document.getElementById('pitchSearchResults');

// HTML radio buttons for search radius
const radioButtons = document.querySelectorAll('input[name="radiusOptions"]');
radioButtons

// Conversion value 
const mileToMeterConv = 1600;


// Initial search with current location
document.addEventListener("DOMContentLoaded", refreshSearch);  // trigger at point of loading page


// Get user's current location coordinates
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(searchFromCurrentLocation);
    } else {
        tempDisplayMessage(`! ERROR: Geolocation is not supported by this browser.`)
    }
}

// Search with user's current location coordinates
function searchFromCurrentLocation(position) {
    defaultLocation = position.coords.latitude + ", " + position.coords.longitude;

    searchResultsList.innerHTML = '';
    googleNearbySearch(defaultLocation);
}
// >>>


// Clear Search box
document.getElementById('refreshIcon').addEventListener('click', refreshSearch);


// Function to refresh search
function refreshSearch() {
    // evt.preventDefault();
    
    // searchResultsList.innerHTML = '';
    tempDisplayMessage(`Loading...`);

    document.getElementById('searchBox').placeholder = '';
    document.getElementById('searchBox').value = '';
    getCurrentLocation();
}


// search by using the enter button on search box
document.getElementById('searchBox').addEventListener('keydown', (clicked) => {
    // clicked.preventDefault();
    if (clicked.key === 'Enter') {
        searchResultsList.innerHTML = '';
        
        // Search with address input 
        if (document.getElementById('searchBox').value == "") {
            getCurrentLocation();
        } else {
            tempDisplayMessage(`! Select from dropdown... or click refresh icon`);
        }
    }
})
// >>>




// Autocomplete feature on search box
let autocomplete;
function initAutocomplete() {
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
        tempDisplayMessage(`! Select from dropdown... or click refresh icon`);
    } else {
        document.getElementById('searchBox').placeholder = '';
        document.getElementById('searchBox').value = place.name + ", " + place.formatted_address;
        getCoordinatesForPlaceID(place.place_id);
    }
}
// >>>


// Get coordinates for the place selected 
function getCoordinatesForPlaceID(placeId) {
    const apiURL_places = encodeURI("https://places.googleapis.com/v1/places/" + placeId + "?fields=location" + "&key=" + apiKey);
    
    // Fetch contents from the API response and format contents to display as HTML elements
    fetch(apiURL_places)
        .then(response => response.text())
        .then(result => {
            const resultJson = JSON.parse(result) || [];
            if (!resultJson) {
                // console.warn(`No result found`);
                tempDisplayMessage(`No result found`)
                return;
            }

            let pitchLat = resultJson.location.latitude;
            let pitchLng = resultJson.location.longitude;
            altLocation = pitchLat + ", " + pitchLng;

            searchResultsList.innerHTML = '';
            googleNearbySearch(altLocation);

        })
        .catch(error => {
            // Custom error response
            // console.error("Search Error:", error);
            // console.log("Search Error: ", error);
            tempDisplayMessage(`! ERROR: Invalid Address.`)
        });
}




// Formatting possible errors
function tempDisplayMessage(errorMessage) {
    searchResultsList.innerHTML = '';

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
    tempDisplayMessage(`Loading...`);
    // Get radius in miles and convert to meters
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

    const apiURL_nearbySearch = encodeURI(baseURL + "&location=" + startLocation + "&radius=" + searchRadius);
    // console.log(apiURL_nearbySearch);
    // Fetch contents from the API response and format contents to display as HTML elements
    fetch(apiURL_nearbySearch)
        .then(resp => {
            if (!resp.ok) throw new Error(`Search Error: ${resp.statusText}`);
            return resp.json();
        })
        .then(data => {
            const results = data.results || [];
            if (!results.length) {
                // console.warn(`No results found`);
                tempDisplayMessage(`! ERROR: No results found.`)
                return;
            }

            searchResultsList.innerHTML = '';
            
            results.forEach(result => {
                // Creating HTML elements
                // Building list and list contents
                const pitchLi = createNode('li');
                pitchLi.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start gap-3');

                const contentDiv = createNode('div');
                contentDiv.setAttribute('class', 'ms-2 me-auto fw-bold text-truncate');
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
            // console.log("url: " + apiURL_nearbySearch)
            tempDisplayMessage(`! ERROR: Search Failure.`);
            // tempDisplayMessage(`! ERROR: Search Failure. ${error} - ${apiURL_nearbySearch}`);
        });
}
// >>>