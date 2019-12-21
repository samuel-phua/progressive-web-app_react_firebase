export default class NotificationResource {
  allTokens = [];
  tokensLoaded = false;

  constructor(messaging, database) {
    console.log("Instantiated!");
    this.messaging = messaging;
    this.database = database;
    try {
      this.messaging.requestPermission().then((res) => {
        console.log("Permission granted");
      }).catch((err) => {
        console.log("No access", err);
      });
    } catch (err) {
      console.log("No notification support.", err);
    }
    this.setupTokenRefresh();
    this.database.collection("fcmTokens").onSnapshot((snapshot) => {
      var tokens = [];
      snapshot.forEach((doc) => {
        var token = doc.data();
        token.id = doc.id;
        tokens.push(token);
      });
      this.allTokens = tokens;
      this.tokensLoaded = true;
    });
  }

  setupTokenRefresh() {
    this.messaging.onTokenRefresh(() => {
      this.saveTokenToServer();
    });
  }

  saveTokenToServer() {
    this.messaging.getToken().then((res) => {
      if (this.tokensLoaded) {
        const existingToken = this.findExistingToken(res);
        if (existingToken) {
          // Replace existing token
        } else {
          // Create a new one
        }
      }
    });
  }

  findExistingToken(tokenToSave) {
    // may need to rewrite this when checking the data structure of allTokens
    for (let tokenKey in this.allTokens) {
      const token = this.allTokens[tokenKey].token;
      if (token === tokenToSave) {
        return tokenKey;
      }
    }
    return false;
  }
}
