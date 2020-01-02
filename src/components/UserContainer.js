import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Loading from "./Loading";

export default class UserContainer extends Component {
  renderedUserEmail = false;
  renderAuthor = (author) => {
    if (!this.renderedUserEmail) {
      this.renderedUserEmail = true;
      return (
        <p className="author">{author}</p>
      );
    }
  };
  render() {
    return (
      <div id="UserContainer" className="inner-container">
        <Header>
          <Link to="/">
            <button className="red">Back to Chat</button>
          </Link>
        </Header>
        {this.props.messagesLoaded ? (
          <div id="message-container">
            {this.props.messages.map(msg => {
              if (msg.user_id === this.props.userId) {
                return (
                  <div key={msg.id} className="message">
                    {this.renderAuthor(msg.author)}
                    <p>{msg.msg}</p>
                  </div>
                );
              }
            })}
          </div>
        ) : <Loading />}
      </div>
    );
  }
}
