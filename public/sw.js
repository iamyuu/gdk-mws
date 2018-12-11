var CACHE = 'pwacache';
var precacheFiles = [];

// install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(precacheFiles))
      .then(() => self.skipWaiting()));
});

// allow sw to control of current page
self.addEventListener('activate', event => self.clients.claim());

// this is a event that can be fired from your page to tell the SW to update the offline page
self.addEventListener('refreshOffline', function (response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(offlinePage, response);
  });
});

// if any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener('fetch', function (event) {
  // this is where we call the server to get the newest version of the file to use the next time we show view
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return fetch(event.request).then(function (response) {
        return cache.put(event.request, response);
      });
    })
  );
  
  event.respondWith(
    fetch(event.request)
      .then(response => response)
      .catch(function (error) {
        return caches.open(CACHE).then(function (cache) {
          return cache.match(event.request || 'offline.html').then(function (matching) {
            return matching || Promise.reject('no-match');
          });
        });
      })
  );
});