export default class NotificationResource {
  allTokens = [];
  tokensLoaded = false;
  user = null;

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
      console.log("tokens", tokens);
      this.allTokens = tokens;
      this.tokensLoaded = true;
    });
  }

  setupTokenRefresh() {
    this.messaging.onTokenRefresh(() => {
      this.saveTokenToServer();
    });
  }

  changeUser(user) {
    this.user = user;
    this.saveTokenToServer();
  }

  saveTokenToServer() {
    this.messaging.getToken().then((res) => {
      console.log("get token", res);
      if (this.tokensLoaded) {
        const existingToken = this.findExistingToken(res);
        console.log("existing token", existingToken);
        if (existingToken) {
          const tokenId = this.allTokens[existingToken].id;
          this.replaceToken(tokenId, res);
        } else {
          this.registerToken(res);
        }
      }
    }).catch((err) => {
      console.log("get token err: ", err);
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

  replaceToken(tokenId, token) {
    this.database.collection("fcmTokens").doc(tokenId).update({
      token,
      user_id: this.user.uid,
    }).then(() => {
      console.log("Document successfully updated!");
    }).catch((err) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", err);
    });
  }

  registerToken(token) {
    this.database.collection("fcmTokens").add({
      token,
      user_id: this.user.uid,
    }).then((docRef) => {
      console.log("token registered with id: ", docRef.id);
    }).catch((err) => {
      console.log("register token err: ", err);
    });
  }
}
