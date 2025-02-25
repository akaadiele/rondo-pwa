// Initiate 'viewPlace' function
document.addEventListener("DOMContentLoaded", viewPlace);

// Get place_id from url
const urlSplit = document.URL.split('?pitch='); const place_id = urlSplit[1];


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
                console.log("res - ", resultJson)

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
            contentP1.innerHTML = `<hr><i class="fa-solid fa-map-pin"></i>:&nbsp;&nbsp;` + resultJson.formattedAddress;

            const contentP2 = createNode('p');
            contentP2.setAttribute('class', 'card-text cardP');
            if (resultJson.internationalPhoneNumber) {
                contentP2.innerHTML = `<i class="fa-solid fa-phone"></i>:&nbsp;&nbsp;` + resultJson.internationalPhoneNumber;
            }

            const contentP3 = createNode('p');
            contentP3.setAttribute('class', 'card-text cardP');
            contentP3.innerHTML = `<i class="fa-solid fa-star"></i>:&nbsp;&nbsp;` + resultJson.rating + `<hr>`;


            const contentA = createNode('a');
            contentA.setAttribute('href', resultJson.googleMapsLinks.placeUri);
            contentA.setAttribute('class', 'btn btn-light links');
            contentA.innerHTML = `<i class="fa-brands fa-google"></i>`;


            append(contentDiv, contentH5);
            append(contentDiv, contentP1);
            append(contentDiv, contentP2);
            append(contentDiv, contentP3);
            append(contentDiv, contentA);
            append(pitchInfoDiv, contentDiv);

            let pitchLat = resultJson.location.latitude;
            let pitchLng = resultJson.location.longitude;
            initMap(pitchLat, pitchLng)

            // console.log("result: " + resultJson);
        })
        .catch(error => {
            // Custom error response
            // console.error("Search Error:", error);
            // console.log("Search Error: ", error);
        });
}
// >>>



// Define Map with center and pin at the selected pitch
let map;
async function initMap(pitchLatitude, pitchLongitude) {
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        center: { lat: pitchLatitude, lng: pitchLongitude },
        zoom: 12,
        gestureHandling: "cooperative",
    });

    let currentMarker = new google.maps.Marker({
        position: { lat: pitchLatitude, lng: pitchLongitude }
    })
    currentMarker.setMap(map);
}
// >>>

