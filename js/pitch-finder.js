
// Initial search with current location
document.addEventListener("DOMContentLoaded", getCurrentLocation);  // trigger at point of loading page

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        throwFormattedError(`! ERROR: Geolocation is not supported by this browser.`)
    }
}
function showPosition(position) {
    defaultLocation = position.coords.latitude + ", " + position.coords.longitude;
    defaultRadius = 1500;
    document.getElementById('searchBox').placeholder = "Your Location";
    googleNearbySearch(defaultLocation, defaultRadius);
}
// >>>


// List group for search results
const searchResultsList = document.getElementById('pitchSearchResults');

// Function to call when searching with search box
document.getElementById('searchButton').addEventListener('click', searchPitch)

// search by using the enter button on search box
document.getElementById('searchBox').addEventListener('keydown', (clicked) => {
    if (clicked.key === 'Enter') {
        searchPitch();
    }
})



// Search with address input 
function searchPitch() {
    console.log('value- ' + document.getElementById('searchBox').placeholder);

    // Content of search box
    searchText = document.getElementById('searchBox').placeholder;

    if ( (searchText != "Enter location") && (searchText != "Your Location") ) {
        getCurrentLocation();
    } else {
        geocodeAddress(searchText);
    }
}
// >>>




// Autocomplete feature on search box
let autocomplete;
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('searchBox'),
        {
            types: ['establishment'],
            // componentRestrictions: { 'country': ['AU'] },
            fields: ['place_id', 'geometry', 'name']

        });
    autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
    var place = autocomplete.getPlace();

    if (!place.geometry) {
        document.getElementById('searchBox').placeholder = 'Enter location';
    } else {
        // document.getElementById('details').innerHTML = place.name;
        geocodeAddress(place.name);
    }
}
// >>>


// Geocoding: address to get latitud and longitude
function geocodeAddress(altAddress) {

    let geocodeURL = "https://maps.googleapis.com/maps/api/geocode/json?key=" + apiKey + "&address=" + altAddress;

    // Fetch contents from the API response and format contents to display as HTML elements
    fetch(geocodeURL)
        .then(response => response.json())
        .then(results => {

            console.log("result: " + result);

            if (!results) {
                console.log("res - ", results);
                console.warn(`No result found`);
                return;
            } else {
                altLocation = results.geometry.location.lat + ", " + results.geometry.location.lng;
                altRadius = 1500;

                console.log("altLocation: " + altLocation);
                document.getElementById('searchBox').placeholder = place.name;
                googleNearbySearch(altLocation, altRadius);
            }
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
function googleNearbySearch(startLocation, searchRadius) {
    // Declaring variables
    const apiURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    const apiKeyword = "football+field";
    const baseURL = apiURL + "?key=" + apiKey + "&keyword=" + apiKeyword;

    let fullURL = baseURL + "&location=" + startLocation + "&radius=" + searchRadius;

    console.log('search url: ', fullURL);
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