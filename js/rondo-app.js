// <-- Code to initiate Service Worker -->

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
        // .then(reg => console.log('service worker registered'))
        // .catch(err => console.log('service worker not registered', err));
}