// // Initiate 'viewPlace' function
// document.addEventListener("DOMContentLoaded", viewPlace);

// Get place_id from url
const urlSplit = document.URL.split('?pitch='); const place_id = urlSplit[1];

// HTML element for pitch info
const pitchInfoDiv = document.getElementById("pitchInfo");


// Google Maps API to get place details
function viewPlace() {
    const apiURL = "https://places.googleapis.com/v1/places/";
    const apiFields = "id,displayName,formattedAddress,internationalPhoneNumber,location,googleMapsLinks,rating";
    const fullURL = apiURL + place_id + "?fields=" + apiFields + "&key=" + apiKey;

    // Fetch contents from the API response and format contents to display as HTML elements
    fetch(fullURL)
        .then(response => response.text())
        .then(result => {

            const resultJson = JSON.parse(result) || [];
            if (!resultJson) {
                // console.log("res - ", resultJson)
                console.warn(`No result found`);
                return;
            }


            // Creating HTML elements

            // Building card and card contents
            const contentDiv = createNode('div');
            contentDiv.setAttribute('class', 'card-body p-3 darkBg fontColor1');

            const contentH5 = createNode('h5');
            contentH5.setAttribute('class', 'card-title');
            contentH5.innerHTML = resultJson.displayName.text;

            const contentP1 = createNode('p');
            contentP1.setAttribute('class', 'card-text cardP');
            contentP1.innerHTML = `<hr><i class="fa-solid fa-location-crosshairs"></i>: &nbsp;&nbsp;` + resultJson.formattedAddress;

            const contentP2 = createNode('p');
            contentP2.setAttribute('class', 'card-text cardP');
            if (resultJson.internationalPhoneNumber) {
                contentP2.innerHTML = `<i class="fa-solid fa-phone"></i>: &nbsp;&nbsp;` + resultJson.internationalPhoneNumber + `&nbsp;&nbsp&nbsp;&nbsp <i class="fa-solid fa-grip-lines-vertical"></i> &nbsp;&nbsp&nbsp;&nbsp` + `<i class="fa-solid fa-star"></i>: &nbsp;&nbsp;` + resultJson.rating + `<hr>`;
            } else {
                contentP2.innerHTML = `<i class="fa-solid fa-phone"></i>: &nbsp;&nbsp;` + resultJson.internationalPhoneNumber + `<hr>`;
            }

            const contentA = createNode('a');
            contentA.setAttribute('href', resultJson.googleMapsLinks.placeUri);
            contentA.setAttribute('class', 'btn btn-light links');
            contentA.innerHTML = `<i class="fa-brands fa-google"></i>`;


            append(contentDiv, contentH5);
            append(contentDiv, contentP1);
            append(contentDiv, contentP2);
            append(contentDiv, contentA);
            append(pitchInfoDiv, contentDiv);

            let pitchLat = resultJson.location.latitude;
            let pitchLng = resultJson.location.longitude;
            initMap(pitchLat, pitchLng)

        })
        .catch(error => {
            // Custom error response
            // console.error("Search Error:", error);
            // console.log("Search Error: ", error);

            pitchInfoDiv.innerHTML = `! ERROR: Unable to load info.`;
        });
}
// >>>



// Define Map with center and pin at the selected pitch
async function initMap(pitchLatitude, pitchLongitude) {
    // The location of selected pitch
    const position = { lat: pitchLatitude, lng: pitchLongitude };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
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


