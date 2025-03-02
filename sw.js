const staticCache = 'static-v000';
const dynamicCache = 'dynamic-v000';
const googleMapsCache = 'googleMapsCache-v000';


const staticCacheAssets = [
    './',
    './index.html',
    './pages/home.html',
    './pages/fallback.html',
    './css/rondo-style.css',
    './js/rondo-app.js',
    './js/rondo-ui.js',
    './img/Rondo-icon.ico',
    './img/kick-ball.jpg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
];





// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        });
    });
};



// 'install' event
self.addEventListener('install', eventParam => {
    console.log('service worker installed');
    eventParam.waitUntil(
        caches.open(staticCache).then((cache) => {
            console.log('Caching static assets');
            cache.addAll(staticCacheAssets);
        })
    );
});


// 'activate' event
self.addEventListener('activate', eventParam => {
    console.log('service worker activated');
    eventParam.waitUntil(
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



// 'fetch' events
self.addEventListener('fetch', eventParam => {
    // Exclude firestore apis
    if ((eventParam.request.url.indexOf('firestore.googleapis.com') === -1) || (eventParam.request.url.indexOf('-extension') === -1)) {
        eventParam.respondWith(
            caches.match(eventParam.request).then(cacheRes => {
                return cacheRes || fetch(eventParam.request).then(fetchRes => {

                    if ((eventParam.request.url.indexOf('places.googleapis.com') > -1) || (eventParam.request.url.indexOf('maps.googleapis.com') > -1)) {
                        // Cache google maps api requests
                        return caches.open(googleMapsCache).then(cache => {
                            cache.put(eventParam.request.url, fetchRes.clone());
                            // check cached items size
                            limitCacheSize(googleMapsCache, 5);
                            return fetchRes;
                        })
                    } else {
                        // Cache all other dynamic assets
                        return caches.open(dynamicCache).then(cache => {
                            cache.put(eventParam.request.url, fetchRes.clone());
                            // check cached items size
                            limitCacheSize(dynamicCache, 20);
                            return fetchRes;
                        })
                    }


                });
            }).catch(() => {
                if (eventParam.request.url.indexOf('.html') > -1) {
                    return caches.match('./pages/fallback.html');
                }
            })
        );
    }
});
