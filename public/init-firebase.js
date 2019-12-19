// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: window.apiKey,
  authDomain: window.projectId + ".firebaseapp.com",
  databaseURL: "https://" + window.projectId + ".firebaseio.com",
  projectId: window.projectId,
  storageBucket: window.projectId + ".appspot.com",
  messagingSenderId: window.messagingSenderId,
  appId: window.appId,
  measurementId: window.measurementId,
};
window.firebase = firebase;
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.auth().languageCode = "en";
// Initialize the FirebaseUI Widget using Firebase.
window.ui = new firebaseui.auth.AuthUI(firebase.auth());
