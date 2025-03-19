// ------------------------------------------------------------------------------------------------------------
// // Recognizing loaded profile

const urlPageSplit = document.URL.split('pages/'); const pageName = urlPageSplit[1];

if (document.getElementById("recognizeUser")) {
    // Get items from local storage
    let storedShortName = localStorage.getItem(localStorageRondoShortName);

    // Modify the text
    if ((storedShortName != "") && (storedShortName != undefined)) {
        document.getElementById("recognizeUser").innerHTML += " " + storedShortName;
    }
}

// ------------------------------------------------------------------------------------------------------------
// // Handling install prompt

let installPrompt = null;
const installButton = document.querySelector("#install");

// Listening for beforeinstallprompt event
window.addEventListener("beforeinstallprompt", (event) => {
    // event.preventDefault();
    installPrompt = event;
    installButton.removeAttribute("hidden");
});


// Triggering the install prompt
installButton.addEventListener("click", async () => {
    if (!installPrompt) {
        return;
    }
    const result = await installPrompt.prompt();
    // console.log(`Install prompt was: ${result.outcome}`);
    disableInAppInstallPrompt();
});


// Disable install prompt
function disableInAppInstallPrompt() {
    installPrompt = null;
    installButton.setAttribute("hidden", "");
}


// Responding to app install
window.addEventListener("appinstalled", () => {
    disableInAppInstallPrompt();
});

// ------------------------------------------------------------------------------------------------------------
