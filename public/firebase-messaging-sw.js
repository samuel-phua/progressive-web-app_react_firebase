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
console.log(firebase.messaging());
self.addEventListener("install", function() {
  console.log("Install!");
});
self.addEventListener("activate", function() {
  console.log("Activate!");
});
self.addEventListener("fetch", function(event) {
  console.log("Fetch!", event.request);
});
