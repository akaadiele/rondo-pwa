// ------------------------------------------------------------------------------------------------------------
// Current Geolocation
let currentLat, currentLng;

// // Initiate 'viewPlace' function
// document.addEventListener("DOMContentLoaded", viewPlace);

// Get place_id from url
const urlSplit = document.URL.split('?pitch='); const place_id = urlSplit[1];

// HTML element for pitch info
const pitchInfoDiv = document.getElementById("pitchInfo");

// ------------------------------------------------------------------------------------------------------------

// Google Maps API to get place details
function viewPlace() {
    setFontSize();  // Update font size
    
    // Using API library
    let map, mapCenter, request, service;

    mapCenter = new google.maps.LatLng(0, 0);
    map = new google.maps.Map(document.getElementById('mapDummy'), { center: mapCenter, zoom: 15 });

    request = {
        placeId: place_id,
        fields: ['id', 'name', 'formatted_address', 'international_phone_number', 'geometry', 'url', 'rating']
    };

    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, callback);

    function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            if (place) {
                // Creating HTML elements - Building card and card contents
                const contentDiv = createNode('div');
                contentDiv.setAttribute('class', 'card-body p-3 darkBg fontColor1');

                const contentH5 = createNode('h5');
                contentH5.setAttribute('class', 'card-title');
                contentH5.innerHTML = place.name;

                const contentP1 = createNode('p');
                contentP1.setAttribute('class', 'card-text cardP');
                contentP1.innerHTML = `<hr><i class="fa-solid fa-location-crosshairs"></i>: &nbsp;&nbsp;` + place.formatted_address;

                const contentP2 = createNode('p');
                contentP2.setAttribute('class', 'card-text cardP');

                contentP2.innerHTML = '';
                if (place.international_phone_number) {
                    // Include phone number if available
                    // <a class="btn btn-light links" href="tel:${place.international_phone_number}"></a>
                    contentP2.innerHTML += `<i class="fa-solid fa-phone"></i>: &nbsp;&nbsp; <a href="tel:${place.international_phone_number}">` + place.international_phone_number +`</a>`;
                }
                if ((place.international_phone_number) && (place.rating)) {
                    // Include demarcation bar if both phone number and rating exist
                    contentP2.innerHTML += `&nbsp;&nbsp&nbsp;&nbsp <i class="fa-solid fa-grip-lines-vertical"></i> &nbsp;&nbsp&nbsp;&nbsp`
                }
                if (place.rating) {
                    // Include rating if available
                    contentP2.innerHTML += `<i class="fa-solid fa-star"></i>: &nbsp;&nbsp;` + place.rating + `<hr>`;
                }

                const contentA = createNode('a');
                contentA.setAttribute('class', 'btn btn-light links');
                contentA.setAttribute('href', place.url);
                contentA.setAttribute('target', '_blank');
                contentA.innerHTML = `<i class="fa-brands fa-google"></i> &nbsp <small>Map</small>`;


                append(contentDiv, contentH5);
                append(contentDiv, contentP1);
                append(contentDiv, contentP2);
                append(contentDiv, contentA);
                append(pitchInfoDiv, contentDiv);

                initMap("", "", place.geometry.location)
            } else {
                pitchInfoDiv.innerHTML = `! ERROR: Unable to load info.`;
            }
        }
    }
    // >>>
}
// >>>

// ------------------------------------------------------------------------------------------------------------

// Define Map with center and pin at the selected pitch
async function initMap(pitchLatitude, pitchLongitude, location) {
    let position;

    // The location of selected pitch
    if (location == "") {
        position = { lat: pitchLatitude, lng: pitchLongitude };
    } else {
        position = location;
    }

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: position,
        mapId: "PITCH_ID", // Map ID is required for advanced markers.
        gestureHandling: "cooperative",
    });

    // The advanced marker, positioned at selected pitch
    const currentMarker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: position,
        title: 'Selected Pitch',
    });
}
// >>>

// ------------------------------------------------------------------------------------------------------------
