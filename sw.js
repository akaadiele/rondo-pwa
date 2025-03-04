// Live caches
const staticCache = 'static-v001';
const dynamicCache = 'dynamic-v001';

// // Test caches
// const staticCache = 'static-v01-02';
// const dynamicCache = 'dynamic-v01-02';

const staticCacheAssets = [
    './',
    './index.html',
    './pages/home.html',
    './pages/pitch-finder.html',
    './pages/settings.html',
    './pages/fallback.html',
    './css/rondo-style.css',
    './js/rondo-app.js',
    './js/rondo-ui.js',
    './js/rondo-db.js',
    './js/settings.js',
    './js/json/countries.json',
    './js/json/languages.json',
    './js/json/positions.json',
    './js/json/themes.json',
    './img/Rondo-icon.ico',
    './img/kick-ball.jpg',
    './img/gif/loading.gif',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
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
                .filter(key => (key !== staticCache) && (key !== dynamicCache))
                // exclude needed caches from deleting
                .map(key => caches.delete(key))
            );
        })
    );
});

// ------------------------------------------------------------------------------------------------------------

// 'fetch' events
self.addEventListener('fetch', eventResp => {
    // Exclude firestore and google APIs
    if ( (eventResp.request.url.indexOf('fire') === -1) ) {
        // if ((eventResp.request.url.indexOf('firestore.googleapis.com') === -1) || (eventResp.request.url.indexOf('firestore') === -1) || (eventResp.request.url.indexOf('firebase') === -1) || (eventResp.request.url.indexOf('extension') === -1) || (eventResp.request.url.indexOf('google') === -1)) {
        eventResp.respondWith(
            caches.match(eventResp.request).then(cacheRes => {
                return cacheRes || fetch(eventResp.request).then(fetchRes => {
                    // Cache all other dynamic assets
                    return caches.open(dynamicCache).then(cache => {
                        cache.put(eventResp.request.url, fetchRes.clone());
                        // check cached items size
                        limitCacheSize(dynamicCache, 20);
                        return fetchRes;
                    })
                });
            }).catch(() => {
                if (eventResp.request.url.indexOf('.html') > -1) {
                    return caches.match('./pages/fallback.html');
                }
            })
        );
    }
});

// ------------------------------------------------------------------------------------------------------------
