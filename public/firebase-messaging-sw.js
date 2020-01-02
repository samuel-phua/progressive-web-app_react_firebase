importScripts("https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js");
var window = {};
importScripts("secrets.js");
firebase.initializeApp({
  apiKey: window.apiKey,
  authDomain: window.projectId + ".firebaseapp.com",
  databaseURL: "https://" + window.projectId + ".firebaseio.com",
  projectId: window.projectId,
  storageBucket: window.projectId + ".appspot.com",
  messagingSenderId: window.messagingSenderId,
  appId: window.appId,
  measurementId: window.measurementId,
});
const CACHE_NAME = "v1";
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      fetch("asset-manifest.json").then(function(response) {
        if (response.ok) {
          response.json().then(function(manifest) {
            const urls = Object.keys(manifest).map(function(key) {
              return manifest[key];
            });
            urls.push("/");
            urls.push("/assets/icon.png");
            cache.addAll(urls);
          });
        }
      });
    }),
  );
});
self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    }),
  );
});
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keyList) {
      Promise.all(
        keyList.map(function(key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      );
    }),
  );
});
