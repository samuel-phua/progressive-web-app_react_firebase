// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
const secrets = require("./secrets");
const firebaseConfig = {
  apiKey: secrets.apiKey,
  authDomain: secrets.projectId + ".firebaseapp.com",
  databaseURL: "https://" + secrets.projectId + ".firebaseio.com",
  projectId: secrets.projectId,
  storageBucket: secrets.projectId + ".appspot.com",
  messagingSenderId: secrets.messagingSenderId,
  appId: secrets.appId,
  measurementId: secrets.measurementId,
};
admin.initializeApp(firebaseConfig);

exports.sendNotifications = functions.region("asia-east2")
.firestore.document("/messages/{messageId}")
.onCreate((snapshot, context) => {
  const snapshotData = snapshot.data();
  console.log("snapshot data", snapshotData);
  // notification payload
  const payload = {
    notification: {
      title: `${snapshotData.author}`,
      body: `${snapshotData.msg}`,
      icon: "assets/icon.png",
      click_action: `https://${firebaseConfig.authDomain}`,
    }
  };
  console.log("notification payload", payload);
  // get a list of all tokens in database
  return admin.firestore().collection("fcmTokens").get().then(allTokens => {
    // if (allTokens.val()) {
      console.log("fcmTokens", allTokens);
      var tokens = [];
      var tokenRefs = [];
      // filter list of tokens for only those that don't belong to the user who sent the message
      allTokens.forEach(token => {
        const fcmToken = token.data();
        if (fcmToken.user_id !== snapshotData.user_id) {
          tokens.push(fcmToken.token);
          tokenRefs.push(token.ref);
        }
      });
      console.log("selected tokens", tokens);
      if (tokens.length > 0) {
        // send notifications to the devices
        return admin.messaging().sendToDevice(tokens, payload).then(response => {
          console.log("send to device reponse", response);
          // if any devices fail to receive the notification due to an invalid or unregistered token, remove their tokens from the database
          const tokensToRemove = [];
          response.results.forEach((result, index) => {
            const error = result.error;
            if (error) {
              console.error("Failure sending notification to", tokens[index], error);
              if (error.code === "messaging/invalid-registration-token" || error.code === "messaging/registration-token-not-registered") {
                tokensToRemove.push(tokenRefs[index].delete());
              }
            }
          });
          console.log("tokens to remove", tokensToRemove.length);
          return Promise.all(tokensToRemove);
        });
      } else return null;
    // } else return null;
  });
});
