import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import Loading from "./Loading";
import NotificationResource from "../resources/NotificationResource";
import "./app.css";

class App extends Component {
  state = { user: null, messages: [], messagesLoaded: false };

  handleSubmitMessage = (msg) => {
    const data = {
      msg,
      author: this.state.user.email ? this.state.user.email : this.state.user.phoneNumber,
      user_id: this.state.user.uid,
      timestamp: Date.now(),
    };
    // Send to database
    window.db.collection("messages").add(data);
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then(choice => {
        console.log(choice);
      });
      this.deferredPrompt = null;
    }
  };

  listenForMessages = () => {
    window.db.collection("messages").orderBy("timestamp", "asc").onSnapshot((snapshot) => {
      this.onMessage(snapshot);
      if (!this.state.messagesLoaded) {
        this.setState({ messagesLoaded: true });
      }
    });
    this.listenForInstallBanner();
  };

  listenForInstallBanner = () => {
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("beforeinstallprompt Event fired");
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
  };

  onMessage = (snapshot) => {
    var messages = [];
    snapshot.forEach((doc) => {
      var msg = doc.data();
      msg.id = doc.id;
      messages.push(msg);
    });
    this.setState({ messages });
  };

  render() {
    const LoginContainer = Loadable({
      loader: () => import("./LoginContainer"),
      loading: Loading,
    });
    const ChatContainer = Loadable({
      loader: () => import("./ChatContainer"),
      loading: Loading,
    });
    const UserContainer = Loadable({
      loader: () => import("./UserContainer"),
      loading: Loading,
    });
    return (
      <div id="container" className="inner-container">
        <Route path="/login" component={LoginContainer} />
        <Route exact path="/" render={() => (
          <ChatContainer
            onSubmit={this.handleSubmitMessage}
            user={this.state.user}
            messages={this.state.messages}
            messagesLoaded={this.state.messagesLoaded}
          />)} />
        <Route path="/users/:userId" render={({ history, match }) => (
          <UserContainer
            messages={this.state.messages}
            messagesLoaded={this.state.messagesLoaded}
            userId={match.params.userId}
          />)} />
      </div>
    );
  }

  componentDidMount() {
    this.notifications = new NotificationResource(firebase.messaging(), firebase.firestore());
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("auth change", user);
        this.setState({ user });
        this.listenForMessages();
        this.notifications.changeUser(user);
      } else {
        this.props.history.push("/login");
      }
    });
    this.listenForMessages();
    this.listenForInstallBanner();
  }
}

export default withRouter(App);
