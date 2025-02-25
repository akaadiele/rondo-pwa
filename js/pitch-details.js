document.addEventListener("DOMContentLoaded", viewPlace);

const urlSplit = document.URL.split('?place='); const place_id = urlSplit[1];

const apiURL = "https://maps.googleapis.com/maps/api/place/details/json";
const apiKey = "AIzaSyCbvT_-aAvCZGD1uR70C5CUVHCEh3UK4Yo";
const fullURL = apiURL + "?key=" + apiKey + "&place_id=" + place_id;

const pitchInfoCard = document.getElementById("pitchInfo")


function viewPlace() {
    // // Fetch contents from the API response and format contents to display as HTML elements
    // console.log("url: " + fullURL)    

    fetch(fullURL)
        .then(response => response.json())
        .then(result => {

            console.log("result: "+result)
            const results = data.result || [];
            if (!result.length) {
                console.log("checking")
            
                console.warn(`No result found`);
                return;
            }

            
            // console.log(result);

            // Creating HTML elements
            // <img src="..." class="card-img-top" alt="...">
            // <div class="card-body">
            //     <h5 class="card-title">Card title</h5>
            //     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the
            //         card's content.</p>
            //     <a href="#" class="btn btn-primary">Go somewhere</a>
            // </div>

            let pitchLat = result.geometry.location.lat;
            let pitchLng = result.geometry.location.lng;

            // Building list and list contents
            const contentDiv = createNode('div');
            contentDiv.setAttribute('class', 'card-body');

            const contentH5 = createNode('h5');
            contentH5.setAttribute('class', 'card-title');
            contentH5.innerHTML = result.name;

            const contentP = createNode('p');
            contentP.setAttribute('class', 'card-text');
            contentP.innerHTML = `<i class="fa-solid fa-map-pin"></i>` + result.formatted_address + `<br><i class="fa-solid fa-phone"></i>: ` + formatted_phone_number;

            const contentA = createNode('a');
            contentA.setAttribute('href', result.url);
            contentA.setAttribute('class', 'btn btn-primary');
            contentA.innerHTML = `<i class="fa-solid fa-map-location"></i>`;


            append(contentDiv, contentH5);
            append(contentDiv, contentP);
            append(contentDiv, contentA);
            append(pitchInfoCard, contentDiv);


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
            // console.error("Search Error:", error);
            console.log("ISearch Error: ", error);
            console.log("url: " + fullURL)
        });
}


