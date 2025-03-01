// <-- Generic reusable codes, global variables, etc -->

const apiKey = "AIzaSyCbvT_-aAvCZGD1uR70C5CUVHCEh3UK4Yo";


function createNode(element) {
    // Function to create new HTML element
    return document.createElement(element);
}


function append(parent, child) {
    // Function to append HTML elements
    return parent.appendChild(child);
}


function showSnackbar(snackbarMessage) {
    // Create the snackbar DIV and append to 'body' element
    const snackbarDiv = createNode('div');
    snackbarDiv.setAttribute('id', 'snackbar');
    snackbarDiv.innerHTML = snackbarMessage;
    
    let bodyElement = document.getElementById("body");
    append(bodyElement, snackbarDiv);
    snackbarDiv.className = "show";

    // Add the "show" class to DIV
    snackbarDiv.setAttribute('class', 'show');
    
    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { snackbarDiv.className = snackbarDiv.className.replace("show", ""); }, 3000);
}