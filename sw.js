// ------------------------------------------------------------------------------------------------------------
// Variable declarations

// // Live caches
// const staticCache = 'static-cache-v001';
// const dynamicCache = 'dynamic-cache-v001';
// const googleApiCache = 'googleApi-cache-v001';

// Test caches
const staticCache = 'static-v000002';
const dynamicCache = 'dynamic-v000002';
const googleApiCache = 'googleApi-v000002';


const staticCacheAssets = [
    './index.html',
    './pages/home.html',
    './pages/pitch-finder.html',
    './pages/fallback.html',
    './css/rondo-style.css',
    './js/rondo-app.js',
    './js/rondo-ui.js',
    './js/home.js',
    './js/pitch-finder.js',
    './js/football-profiler.js',
    './js/settings.js',
    './js/json/countries.json',
    './js/json/fontSizes.json',
    './js/json/languages.json',
    './js/json/positions.json',
    './js/json/themes.json',
    './img/Rondo-icon.ico',
    './img/kick-ball.jpg',
    './img/gif/loading.gif',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    'https://fonts.googleapis.com/css2?family=Delius+Swash+Caps&display=swap'
];

// ------------------------------------------------------------------------------------------------------------

// cache size limit function
function limitCacheSize(name, size) {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        });
    });
}

// ------------------------------------------------------------------------------------------------------------

// 'install' event
self.addEventListener('install', eventResp => {
    // console.log('service worker installed');
    eventResp.waitUntil(
        caches.open(staticCache).then((cache) => {
            // console.log('Caching static assets');
            cache.addAll(staticCacheAssets);
        })
    );
});

// ------------------------------------------------------------------------------------------------------------

// 'activate' event
self.addEventListener('activate', eventResp => {
    // console.log('service worker activated');
    eventResp.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => (key !== staticCache) && (key !== dynamicCache) && (key !== googleApiCache))
                // exclude needed caches from deleting
                .map(key => caches.delete(key))
            );
        })
    );
});

// ------------------------------------------------------------------------------------------------------------

// 'fetch' events
self.addEventListener('fetch', eventResp => {
    if ((eventResp.request.url.indexOf('fire') === -1)) {
        // Exclude firestore and google APIs
        eventResp.respondWith(
            caches.match(eventResp.request).then(cacheRes => {
                return cacheRes || fetch(eventResp.request).then(fetchRes => {
                    // Cache unmatched requests
                    if (eventResp.request.url.indexOf('maps') > -1) {
                        // Cache google api assets
                        return caches.open(googleApiCache).then(cache => {
                            cache.put(eventResp.request.url, fetchRes.clone());
                            // check cached items size
                            limitCacheSize(googleApiCache, 20);
                            return fetchRes;
                        })
                    } else {
                        // Cache all other dynamic assets
                        return caches.open(dynamicCache).then(cache => {
                            cache.put(eventResp.request.url, fetchRes.clone());
                            // check cached items size
                            limitCacheSize(dynamicCache, 20);
                            return fetchRes;
                        })
                    }
                });
            }).catch(() => {
                // Offline functionality with fallback page
                if (eventResp.request.url.indexOf('.html') > -1) {
                    return caches.match('./pages/fallback.html');
                }
            })
        );
    }
});

// ------------------------------------------------------------------------------------------------------------