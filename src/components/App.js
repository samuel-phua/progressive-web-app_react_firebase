import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import LoginContainer from "./LoginContainer";
import ChatContainer from "./ChatContainer";
import UserContainer from "./UserContainer";
import "./app.css";

class App extends Component {
  state = { user: null, messages: [] };

  handleSubmitMessage = (msg) => {
    const data = {
      msg,
      author: this.state.user.email,
      user_id: this.state.user.uid,
      timestamp: Date.now(),
    };
    // Send to database
    firebase.database().ref("messages/").push(data);
  };

  onMessage = (snapshot) => {
    const messages = Object.keys(snapshot.val()).map(key => {
      const msg = snapshot.val()[key];
      msg.id = key;
      return msg;
    });
    this.setState({ messages });
  };

  render() {
    return (
      <div id="container" className="inner-container">
        <Route exact path="/" render={() => (
          <ChatContainer
            onSubmit={this.handleSubmitMessage}
            user={this.state.user}
            messages={this.state.messages}
          />)} />
        <Route path="/login" component={LoginContainer} />
        <Route path="/users/:userId" component={UserContainer} />
      </div>
    );
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } else {
        this.props.history.push("/login");
      }
    });
    firebase.database().ref("/messages").on("value", (snapshot) => {
      this.onMessage(snapshot);
    });
  }
}

export default withRouter(App);
