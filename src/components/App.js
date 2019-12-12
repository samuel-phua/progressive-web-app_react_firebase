import React, { Component } from "react";
import LoginContainer from "./LoginContainer";
import "./app.css";

class App extends Component {
  state = { user: null };

  render() {
    return (
      <div id="container" className="inner-container">
        <LoginContainer />
      </div>
    );
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });
  }
}

export default App;
