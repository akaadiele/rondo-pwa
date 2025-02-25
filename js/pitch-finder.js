document.addEventListener("DOMContentLoaded", getLocation);

const apiURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const apiKey = "AIzaSyCbvT_-aAvCZGD1uR70C5CUVHCEh3UK4Yo";
const apiKeyword = "football+field";
const baseURL = apiURL + "?key=" + apiKey + "&keyword=" + apiKeyword;

const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', getLocation);

const searchResultsList = document.getElementById('pitchSearchResults');


const x = document.getElementById("demo");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
    defaultLocation = position.coords.latitude + ", " + position.coords.longitude;
    defaultRadius = 1500;
    googleNearbySearch(defaultLocation, defaultRadius);
    // let testURL = baseURL + "&location=" + defaultLocation + "&radius=" + defaultRadius
    // console.log("url: "+testURL)
}




function googleNearbySearch(startLocation, searchRadius) {
    let fullURL = baseURL + "&location=" + startLocation + "&radius=" + searchRadius
    // Fetch contents from the API response and format contents to display as HTML elements
    console.log("url: "+fullURL)
fetch(fullURL)

    // const proxyurl = "https://cors-anywhere.herokuapp.com/";
    // fetch(proxyurl + fullURL)

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
                console.log(result);

                // Creating HTML elements
                // <li class="list-group-item d-flex justify-content-between align-items-start">
                //     <div class="ms-2 me-auto">
                //         <div class="fw-bold">Subheading</div>
                //         Content for list item
                //     </div>
                //     <span class="badge text-bg-dark rounded-pill"><i class="fa-solid fa-eye"></i></span>
                // </li>

                const pitchLi = createNode('li');
                pitchLi.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start');

                const contentDiv = createNode('div');
                contentDiv.setAttribute('class', 'ms-2 me-auto');

                const subHeadingDiv = createNode('div');
                subHeadingDiv.setAttribute('class', 'fw-bold');

                const viewSpan = createNode('span');
                viewSpan.setAttribute('class', 'badge text-bg-dark rounded-pill');


                subHeadingDiv.innerHTML = result.vicinity;
                append(contentDiv, subHeadingDiv);

                contentDivText = result.name;
                append(contentDiv, contentDivText);


                // Building list and list contents
                append(pitchLi, contentDiv);
                append(pitchLi, viewSpan);

                append(searchResultsList, pitchLi);
            });

            // // Display total values after fetching all ingredient data
            // const totalContainer = document.getElementById('total-nutrition');
            // totalContainer.innerHTML = `

            //     <h4>Cocktail Nutritional Values:</h4>
            //     <ul class="list-group list-group-flush bg-transparent">
            //         <li class="list-group-item bg-transparent">Calories: ${total_caloriesValue.toFixed(2)}</li>
            //         <li class="list-group-item bg-transparent">Total Fat: ${total_fatValue.toFixed(2)}g</li>
            //         <li class="list-group-item bg-transparent">Sodium: ${total_sodiumValue.toFixed(2)}g</li>
            //         <li class="list-group-item bg-transparent">Total Carbohydrates: ${total_carbsValue.toFixed(2)}g</li>
            //         <li class="list-group-item bg-transparent">Sugars: ${total_sugarsValue.toFixed(2)}g</li>
            //         <li class="list-group-item bg-transparent">Protein: ${total_proteinValue.toFixed(2)}g</li>
            //     </ul>
            //     <br>
            //     <h6><em><strong>Per 1 oz of each ingredient measured</strong></em></h6>

            // `;
        })
        .catch(error => {
            // Custom error response
            console.error("Search Error:", error);
            console.log("ISearch Error: ", error);
            console.log("url: "+fullURL)
        });
}


function createNode(element) {
    // Function to create new HTML element
    return document.createElement(element);
}

function append(parent, child) {
    // Function to append HTML elements
    return parent.appendChild(child);
}