// ------------------------------------------------------------------------------------------------------------
// Handling install prompt
let installPrompt = null;
const installButton = document.querySelector("#install");


// Listening for beforeinstallprompt
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
    console.log(`Install prompt was: ${result.outcome}`);
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
