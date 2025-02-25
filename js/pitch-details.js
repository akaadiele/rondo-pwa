document.addEventListener("DOMContentLoaded", viewPlace);

const urlSplit = document.URL.split('?place='); const place_id = urlSplit[1];

// const apiURL = "https://maps.googleapis.com/maps/api/place/details/json";
// const apiKey = "AIzaSyCbvT_-aAvCZGD1uR70C5CUVHCEh3UK4Yo";
// const fullURL = apiURL + "?key=" + apiKey + "&place_id=" + place_id;


const apiURL = "https://places.googleapis.com/v1/places/";
const apiKey = "AIzaSyCbvT_-aAvCZGD1uR70C5CUVHCEh3UK4Yo";
const apiFields = "id,displayName,formattedAddress,internationalPhoneNumber,nationalPhoneNumber,location,googleMapsLinks,googleMapsUri,websiteUri";
const fullURL = apiURL + place_id + "?fields=" + apiFields + "&key=" + apiKey;

// ChIJw1WnzEhchkgReBxirHIzT0k
// ?fields=
// id,displayName,formattedAddress,internationalPhoneNumber,nationalPhoneNumber,location,googleMapsLinks,googleMapsUri,websiteUri
// &key=
// AIzaSyCbvT_-aAvCZGD1uR70C5CUVHCEh3UK4Yo

const pitchInfoCard = document.getElementById("pitchInfo");


function viewPlace() {
    // // Fetch contents from the API response and format contents to display as HTML elements
    console.log("url: " + fullURL)

    // fetch(fullURL)
    //     .then(x => x.text())
    //     .then(y => console.log(y));

    fetch(fullURL)
        .then(response => response.text())
        .then(result => {

            // console.log("result: " + result);

            const resultJson = JSON.parse(result) || [];
            if (!resultJson) {
                console.log("res - ", resultJson)

                console.warn(`No result found`);
                return;
            }


            // Creating HTML elements


            let pitchLat = resultJson.location.latitude;
            let pitchLng = resultJson.location.longitude;

            // Building list and list contents
            const contentDiv = createNode('div');
            contentDiv.setAttribute('class', 'card-body');

            const contentH5 = createNode('h5');
            contentH5.setAttribute('class', 'card-title');
            contentH5.innerHTML = resultJson.displayName.text;

            const contentP = createNode('p');
            contentP.setAttribute('class', 'card-text cardP');
            
            if (resultJson.internationalPhoneNumber) {
            contentP.innerHTML = `<hr><i class="fa-solid fa-map-pin"></i>: ` + resultJson.formattedAddress + `<br><br><i class="fa-solid fa-phone"></i>: ` + resultJson.internationalPhoneNumber;
        } else {
            contentP.innerHTML = `<hr><i class="fa-solid fa-map-pin"></i>: ` + resultJson.formattedAddress + `<br>`
        }

            const contentA = createNode('a');
            contentA.setAttribute('href', resultJson.googleMapsLinks.placeUri);
            contentA.setAttribute('class', 'btn links');
            contentA.innerHTML = `<i class="fa-solid fa-map-location"></i>`;


            append(contentDiv, contentH5);
            append(contentDiv, contentP);
            append(contentDiv, contentA);
            append(pitchInfoCard, contentDiv);

        })
        .catch(error => {
            // Custom error response
            // console.error("Search Error:", error);
            console.log("ISearch Error: ", error);
            console.log("url: " + fullURL)
        });
}


