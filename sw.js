// MAKHANANI SERVICE WORKER - V5.0 PRODUCTION - NEW PROJECT 93e52 - ✅ CONNECTED - REAL-TIME DB LIVE + OFFLINE + APP PWA
// Project: makhanani-library-93e52 - Firestore: makhanani/main Exists:true - ✅ CONNECTED confirmed in V4.0 DEBUG
// By XINTIMANI GROUP - V5.0 PRODUCTION - NEW PROJECT 93e52 - ✅ CONNECTED + REAL-TIME DB LIVE + OFFLINE + APP PWA

const CACHE_NAME = 'makhanani-v5-production-93e52-connected-v1';
const urlsToCache = [
  'index.html',
  'agents.html',
  'jobs.html',
  'manual.html',
  'founder-manual.html',
  'training-manual.html',
  'manifest.json',
  'logo.png',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js',
  'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js',
  'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

self.addEventListener('install', event => {
  console.log('✅ MAKHANANI SW V5.0 PRODUCTION - NEW PROJECT 93e52 - Installing - ✅ CONNECTED - Cache:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ MAKHANANI SW V5.0 - Caching files - NEW PROJECT 93e52 - ✅ CONNECTED - REAL-TIME DB LIVE + OFFLINE + APP PWA');
        return cache.addAll(urlsToCache.map(url => new Request(url, {cache: 'no-cache'}))).catch(err => {
          console.log('⚠️ MAKHANANI SW V5.0 - Some cache failed - NEW PROJECT 93e52 - Still works offline -', err.message);
          // Try cache at least main files
          return cache.addAll(['index.html', 'logo.png', 'manifest.json']).catch(()=>{});
        });
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('✅ MAKHANANI SW V5.0 PRODUCTION - NEW PROJECT 93e52 - Activating - ✅ CONNECTED - REAL-TIME DB LIVE + OFFLINE');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('makhanani-')) {
            console.log('🗑️ MAKHANANI SW V5.0 - Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Skip Firebase Firestore requests - Let them go to network for REAL-TIME DB LIVE + OFFLINE persistence handles offline
  if (event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('firebase') ||
      event.request.url.includes('googleapis.com')) {
    // Network first for Firebase - REAL-TIME DB LIVE + OFFLINE - enablePersistence handles offline caching
    event.respondWith(
      fetch(event.request).catch(() => {
        console.log('⚠️ MAKHANANI SW V5.0 - Firebase offline - Using enablePersistence cache - NEW PROJECT 93e52 - ✅ CONNECTED + OFFLINE');
        return new Response(JSON.stringify({offline: true, project: 'makhanani-library-93e52', version: 'V5.0 PRODUCTION - OFFLINE MODE - REAL-TIME DB LIVE + OFFLINE'}), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // For all other requests: Cache first, then network - APP PWA OFFLINE
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // Return cached version - APP WORKS OFFLINE - V5.0 PRODUCTION
          return response;
        }
        // Not in cache, fetch from network
        return fetch(event.request).then(networkResponse => {
          // Check if valid response
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          // Clone and cache new resource for OFFLINE
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }).catch(() => {
          // Offline and not in cache - Return offline page
          if (event.request.destination === 'document') {
            return caches.match('index.html');
          }
          return new Response('Offline - MAKHANANI V5.0 PRODUCTION - NEW PROJECT 93e52 - ✅ CONNECTED + REAL-TIME DB LIVE + OFFLINE + APP PWA - Works offline! Sync when online! - Project: makhanani-library-93e52', {
            status: 503,
            statusText: 'Offline - MAKHANANI V5.0 PRODUCTION',
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({version: 'V5.0 PRODUCTION - NEW PROJECT 93e52 - ✅ CONNECTED - REAL-TIME DB LIVE + OFFLINE + APP PWA - makhanani-library-93e52 - Exists:true'});
  }
});

console.log('✅ MAKHANANI SW V5.0 PRODUCTION - NEW PROJECT 93e52 - Loaded - ✅ CONNECTED - REAL-TIME DB LIVE + OFFLINE + APP PWA - Cache:', CACHE_NAME, '- Project: makhanani-library-93e52 - Firestore: makhanani/main Exists:true - By XINTIMANI GROUP');
