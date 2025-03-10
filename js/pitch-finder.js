// ------------------------------------------------------------------------------------------------------------
// // Declaring global variables

// Current Geolocation
let currentLat, currentLng;

// place id from autocomplete
let autocomplete_placeId;

// Interval variables
let checkLoading; let intervalSeconds = 10;
let refreshCount = 0; let refreshCountMax = 2;
let timerRunning = false;

// Conversion value 
const mileToMeterConv = 1609.34;

// ------------------------------------------------------------------------------------------------------------
// // Working with HTML elements

// HTML List group for search results
const searchResultsList = document.getElementById('pitchSearchResults');

// HTML radio buttons for search radius
const radioButtons = document.querySelectorAll('input[name="radiusOptions"]');

// Search with current location on initial page load
document.addEventListener("DOMContentLoaded", refreshSearch);

// // Search by using the radio buttons
// document.getElementById('radius1').disabled = false;
// document.getElementById('radius2').disabled = false;
// document.getElementById('radius3').disabled = false;

// Search by using the refresh icon
document.getElementById('refreshIcon').addEventListener('click', refreshSearch);

// Search by using the enter button on search box
// document.getElementById('searchBox').disabled = false;
document.getElementById('searchBox').addEventListener('keydown', (clicked) => {
    if (clicked.key === 'Enter') {
        // Search with address input 
        if (document.getElementById('searchBox').value == "") {
            getCurrentLocation();
        } else {
            tempDisplayMessage(`<small>! Select from dropdown...</small>`);
        }
    }
})

// ------------------------------------------------------------------------------------------------------------
// // Functions

// Function to refresh search
function refreshSearch() {
    loadingScreenShow();

    if ((autocomplete_placeId == '') || (autocomplete_placeId == undefined)) {
        autocomplete_placeId = '';
        document.getElementById('searchBox').placeholder = '';
        document.getElementById('searchBox').value = '';
        getCurrentLocation();
    } else {
        // getCoordinatesForPlaceID(document.getElementById('searchBox').placeholder);
        // getCoordinatesForPlaceID(docUrlPlaceId);
        getCoordinatesForPlaceID(autocomplete_placeId);
    }
}

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

    // searchResultsList.innerHTML = '';
    googleNearbySearch(currentLat, currentLng, "");
}
// >>>



// Formatting possible errors
function tempDisplayMessage(errorMessage) {
    searchResultsList.innerHTML = '';
    // loadingScreenHide();

    const pitchLi = createNode('li');
    pitchLi.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start');

    const contentDiv = createNode('div');
    contentDiv.setAttribute('class', 'ms-2 me-auto fw-bold container justify-content-center');

    // contentDivText = document.createTextNode(errorMessage);
    contentDiv.innerHTML = errorMessage;


    // append(contentDiv, contentDivText);
    append(pitchLi, contentDiv);
    append(searchResultsList, pitchLi);
}
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
        tempDisplayMessage(`<small>! Select from dropdown...</small>`);
    } else {
        document.getElementById('searchBox').placeholder = place.place_id;
        document.getElementById('searchBox').value = place.name + ", " + place.formatted_address;

        // document.URL = document.URL + "?searchPlace=" + place.place_id;
        autocomplete_placeId = place.place_id;

        getCoordinatesForPlaceID(autocomplete_placeId);
    }
}
// >>>



// Get coordinates for the place selected, searching with place_id
function getCoordinatesForPlaceID(placeId) {
    // Using API library
    let map, mapCenter, request, service;

    // mapCenter = new google.maps.LatLng(currentLat, currentLng);
    mapCenter = { lat: currentLat, lng: currentLng }
    map = new google.maps.Map(document.getElementById('mapDummy'), { center: mapCenter, zoom: 15 });

    request = { placeId: placeId, fields: ['geometry'] };

    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, callback);


    function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            if (place) {
                // searchResultsList.innerHTML = '';
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
    loadingScreenShow();

    if (timerRunning != true) {
        // Timer - started
        refreshCount = 0;
        checkLoading = setInterval(checkLoadingDivStatus, intervalSeconds * 1000); // Start timed event
    }

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
    const apiKeyword = "football+field";

    if (location == "") {
        // searchLocation = new google.maps.LatLng(latitude, longitude);
        searchLocation = { lat: latitude, lng: longitude }
    } else {
        searchLocation = location;
    }

    map = new google.maps.Map(document.getElementById('mapDummy'), { center: searchLocation, zoom: 15 });

    request = {
        location: searchLocation,
        radius: searchRadius,
        keyword: apiKeyword
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);


    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            if (results.length > 0) {
                loadingScreenHide();

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


// Show loading screen
function loadingScreenShow() {
    searchResultsList.innerHTML = '';
    tempDisplayMessage(`<small>Searching for nearby pitch(es)...</small><br><em><small>(Ensure you are online)</small></em>`);
    document.getElementById("loadingDiv").hidden = "";
}

// Hide loading screen
function loadingScreenHide() {
    searchResultsList.innerHTML = '';
    document.getElementById("loadingDiv").hidden = true;


    // Timer - stopped
    timerRunning = false;
    refreshCount = 0;
    clearInterval(checkLoading);    // Stop timed event
}


// Timed event to refresh search automatically
function checkLoadingDivStatus() {
    if ((document.getElementById("loadingDiv").hidden == "")) {
        if (refreshCount < refreshCountMax) {
            // Timer - running
            timerRunning = true;
            refreshCount += 1;

            refreshSearch();    // Refresh Search
        } else {
            // Timer - timed out
            loadingScreenHide();

            tempDisplayMessage(`<small>! No nearby pitch(es) found</small><br><em><small>- Check connection,<br>- Try a different location or radius</small></em>`);
        }
    } else {
        // Timer - stopped
        loadingScreenHide();
    }
}

// ------------------------------------------------------------------------------------------------------------
