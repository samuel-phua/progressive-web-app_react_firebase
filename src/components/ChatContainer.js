import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

export default class ChatContainer extends Component {
  state = { newMessage: "" };
  handleInputChange = (e) => {
    this.setState({ newMessage: e.target.value });
  };
  handleSubmit = (e) => {
    this.props.onSubmit(this.state.newMessage);
    this.setState({ newMessage: "" });
  };
  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.handleSubmit();
    }
  };
  handleLogout = () => {
    firebase.auth().signOut();
  };
  getAuthor = (msg, nextMsg) => {
    if (!nextMsg || nextMsg.author !== msg.author) {
      return (
        <p className="author">
          <Link to={`/users/${msg.user_id}`}>{msg.author}</Link>
        </p>
      );
    }
  }
  render() {
    return (
      <div id="ChatContainer" className="inner-container">
        <Header>
          <button className="red" onClick={this.handleLogout}>Logout</button>
        </Header>
        <div id="message-container">
          {this.props.messages.map((msg, i) => (
            <div key={msg.id} className={`message ${this.props.user.email === msg.author && "mine"}`}>
              <p>{msg.msg}</p>
              {this.getAuthor(msg, this.props.messages[i + 1])}
            </div>
          ))}
        </div>
        <div id="chat-input">
          <textarea
            placeholder="Add your message ..."
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            value={this.state.newMessage} />
          <button onClick={this.handleSubmit}>
            <svg viewBox="0 0 24 24">
              <path fill="#424242" d="M2, 21L23, 12L2, 3V10L17, 12L2, 14V21Z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
}
