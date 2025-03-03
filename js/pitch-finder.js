// Current Geolocation
let currentLat, currentLng;


// HTML List group for search results
const searchResultsList = document.getElementById('pitchSearchResults');

// HTML radio buttons for search radius
const radioButtons = document.querySelectorAll('input[name="radiusOptions"]');

// Conversion value 
const mileToMeterConv = 1609.34;

// Search keyword
const apiKeyword = "football+field";

// Initial search with current location
document.addEventListener("DOMContentLoaded", refreshSearch);  // trigger at point of loading page



// Get user's current location coordinates
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(searchFromCurrentLocation);
    } else {
        tempDisplayMessage(`! ERROR: Geolocation is not supported by this device.`)
    }
}

// Search with user's current location coordinates
function searchFromCurrentLocation(position) {
    // defaultLocation = position.coords.latitude + ", " + position.coords.longitude;
    currentLat = position.coords.latitude;
    currentLng = position.coords.longitude;

    searchResultsList.innerHTML = '';
    googleNearbySearch(currentLat, currentLng, "");
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
    let place = autocomplete.getPlace();

    if (!place.formatted_address) {
        tempDisplayMessage(`! Select from dropdown... or click refresh icon`);
    } else {
        document.getElementById('searchBox').placeholder = '';
        document.getElementById('searchBox').value = place.name + ", " + place.formatted_address;
        getCoordinatesForPlaceID(place.place_id);
    }
}
// >>>



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



// Get coordinates for the place selected, searching with place_id
function getCoordinatesForPlaceID(placeId) {
    // Using API library
    let map, mapCenter, request, service;

    mapCenter = new google.maps.LatLng(currentLat, currentLng);
    map = new google.maps.Map(document.getElementById('mapDummy'), { center: mapCenter, zoom: 15 });

    request = { placeId: placeId, fields: ['geometry'] };

    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, callback);


    function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            if (place) {
                searchResultsList.innerHTML = '';
                googleNearbySearch("", "", place.geometry.location);
            } else {
                tempDisplayMessage(`! ERROR: Invalid Address.`)
            }
        }
    }
    // >>>
}



// Nearby search for pitch with Google API
function googleNearbySearch(latitude, longitude, location) {
    tempDisplayMessage(`Loading...`);

    // Get radius in miles and convert to meters
    let searchRadius;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            let milesRadius = radioButton.value;
            searchRadius = milesRadius * mileToMeterConv;  // Converting to meters
            break;
        }
    }



    // Using API library
    let map, searchLocation, request, service;
    
    if (location == "") {
        searchLocation = new google.maps.LatLng(latitude, longitude);
    } else {
        searchLocation = location;
    }

    map = new google.maps.Map(document.getElementById('mapDummy'), {
        center: searchLocation,
        zoom: 15
    });

    request = {
        location: searchLocation,
        radius: searchRadius,
        keyword: apiKeyword
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);


    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            searchResultsList.innerHTML = '';
            if (results.length > 0) {
                for (let i = 0; i < results.length; i++) {
                    // Creating HTML elements - building list and list contents
                    const pitchLi = createNode('li');
                    pitchLi.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start gap-3');

                    const contentDiv = createNode('div');
                    contentDiv.setAttribute('class', 'ms-2 me-auto fw-bold text-truncate');
                    contentDiv.innerHTML = `<i class="fa-solid fa-map-pin"></i> ${results[i].name}`;

                    const viewSpan = createNode('span');
                    viewSpan.setAttribute('class', 'badge text-bg-dark rounded-pill');
                    viewSpan.innerHTML = `<a href="pitch-details.html?pitch=${results[i].place_id}"><i class="fa-solid fa-eye"></i></a>`;


                    append(pitchLi, contentDiv);
                    append(pitchLi, viewSpan);
                    append(searchResultsList, pitchLi);
                }
            } else {
                tempDisplayMessage(`! ERROR: No results found.`)
            }
        }
    }
    // >>>
}
// >>>