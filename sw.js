const CACHE_NAME = "makhanani-v2026-05-11-permissions-final";
const urlsToCache = ["index.html","manual.html","founder-manual.html","training-manual.html","agents.html","jobs.html","logo.png","manifest.json"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});
self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
