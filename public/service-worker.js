const filesToCache = [
    "/",
    "/index.js",
    "/db.js",
    "/manifest.json",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
];

const CACHE_NAME = "cache-v1";
const DATA_CACHE_NAME = "data=cache-v1";

self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Files cached")
            return cache.addAll(filesToCache);
        })
    )
});



self.addEventListener("fetch", function(e) {
    if (e.request.url.includes("/api")) {
        e.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(e.request)
                .then(response => {
                    if (response.status === 200) {
                        cache.put(e.request.url, response.clone());
                    }

                    return response;
                })
                .catch(err => {
                    return cache.match(e.request);
                });
            }).catch (err => console.log(err))
        );
        return;
    }

    e.respondWith(
        fetch(e.request).catch(function() {
            return caches.match(e.request).then(function(response) {
                if (response) {
                    return response;
                } else if (e.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/");
                }
            });
        })
    )
});
