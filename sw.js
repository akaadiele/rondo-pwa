const staticCache = 'static-v1';
const staticCacheAssets = [
    '/',
    './',
    './index.html',
    './pages/fallback.html',
    './css/rondo-style.css',
    './js/football-profiler.js',
    './js/pitch-details.js',
    './js/pitch-finder.js',
    './js/rondo-app.js',
    './js/rondo-db.js',
    './js/rondo-ui.js',
    './js/settings.js',
    './img/kick-ball.jpg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
];

const dynamicCache = 'dynamic-v1';

// const userCache = 'user-v1';
// caches.open(userCache).then(cache => {
//     cache.put(userId, userId_value);
//     cache.put(name, name_value);
//     cache.put(position, position_value);
//     cache.put(nationality, nationality_value);
//     cache.put(age, age_value);
//     cache.put(height, height_value);
//     cache.put(weight, weight_value);    
// });

// const settingsCache = 'settings-v1';
// caches.open(settingsCache).then(cache => {
//     cache.put(userId, userId_value);
//     cache.put(language, language_value);
//     cache.put(theme, theme_value);
// });

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

// install event
self.addEventListener('install', evt => {
    //console.log('service worker installed');
    evt.waitUntil(
        caches.open(staticCache).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(staticCacheAssets);
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    //console.log('service worker activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCache && key !== dynamicCache)
                .map(key => caches.delete(key))
            );
        })
    );
});

// fetch events
self.addEventListener('fetch', evt => {
    if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
        evt.respondWith(
            caches.match(evt.request).then(cacheRes => {
                return cacheRes || fetch(evt.request).then(fetchRes => {
                    return caches.open(dynamicCache).then(cache => {
                        cache.put(evt.request.url, fetchRes.clone());
                        // check cached items size
                        limitCacheSize(dynamicCache, 30);
                        return fetchRes;
                    })
                });
            }).catch(() => {
                if (evt.request.url.indexOf('.html') > -1) {
                    return caches.match('/pages/fallback.html');
                }
            })
        );
    }
});