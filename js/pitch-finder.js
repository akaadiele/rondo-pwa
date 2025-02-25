document.addEventListener("DOMContentLoaded", getLocation);

const apiURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const apiKey = "AIzaSyCbvT_-aAvCZGD1uR70C5CUVHCEh3UK4Yo";
const apiKeyword = "football+field";
const baseURL = apiURL + "?key=" + apiKey + "&keyword=" + apiKeyword;

// const searchButton = document.getElementById('searchButton');
// searchButton.addEventListener('click', getLocation);
document.getElementById('searchButton').addEventListener('click', getLocation)
// search by using the enter button
document.getElementById('searchBox').addEventListener('keydown', (clicked) => {
    if (clicked.key === 'Enter') {
        searchCocktails();
    }
})


const searchResultsList = document.getElementById('pitchSearchResults');



function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        const pitchLi = createNode('li');
        pitchLi.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start');
        pitchLi.innerHTML = `<i class="fa-sharp fa-solid fa-exclamation"></i>`

        const contentDiv = createNode('div');
        contentDiv.setAttribute('class', 'ms-2 me-auto fw-bold');

        contentDivText = document.createTextNode("Error: Geolocation is not supported by this browser.");
        append(contentDiv, contentDivText);

        append(pitchLi, contentDiv);

        append(searchResultsList, pitchLi);
    }
}
function showPosition(position) {
    // demoP.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
    defaultLocation = position.coords.latitude + ", " + position.coords.longitude;
    defaultRadius = 1500;
    googleNearbySearch(defaultLocation, defaultRadius);
    // let testURL = baseURL + "&location=" + defaultLocation + "&radius=" + defaultRadius
    // console.log("url: "+testURL)
}




function googleNearbySearch(startLocation, searchRadius) {
    let fullURL = baseURL + "&location=" + startLocation + "&radius=" + searchRadius
    // Fetch contents from the API response and format contents to display as HTML elements
    // console.log("url: "+fullURL)
    fetch(fullURL)
        .then(resp => {
            if (!resp.ok) throw new Error(`Search Error: ${resp.statusText}`);
            return resp.json();
        })
        .then(data => {
            const results = data.results || [];
            if (!results.length) {
                console.warn(`No results found`);
                return;
            }

            results.forEach(result => {
                // console.log(result);

                // Creating HTML elements

{/* <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="me-auto fw-bold">
        <i class="fa-solid fa-map-pin"></i> Claypotts Park
    </div>

    <span class="badge text-bg-dark rounded-pill"><a href="pitch-details.html?place=ChIJSzlcmi5chkgRM4JhwBB2U_M"><i class="fa-solid fa-eye"></i></a></span>

</li> */}

                // Building list and list contents
                const pitchLi = createNode('li');
                pitchLi.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start');
                
                const contentDiv = createNode('div');
                contentDiv.setAttribute('class', 'ms-2 me-auto fw-bold');
                contentDiv.innerHTML = `<i class="fa-solid fa-map-pin"></i> ${result.name}`

                const viewSpan = createNode('span');
                viewSpan.setAttribute('class', 'badge text-bg-dark rounded-pill');
                viewSpan.innerHTML = `<a href="pitch-details.html?place=${result.place_id}"><i class="fa-solid fa-eye"></i></a>`
                
                
                append(pitchLi, contentDiv);
                append(pitchLi, viewSpan);
                append(searchResultsList, pitchLi);
            });
        })
        .catch(error => {
            // Custom error response
            // console.error("Search Error:", error);
            console.log("ISearch Error: ", error);
            console.log("url: " + fullURL)
        });
}
