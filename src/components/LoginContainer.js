import React, { Component } from "react";
import Header from "./Header";

class LoginContainer extends Component {
  state = {
    email: "",
    phone: "",
    error: "",
    showVerification: false,
    verificationCode: "",
  };

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handlePhoneChange = (event) => {
    this.setState({ phone: event.target.value });
  };

  handleVerificationCodeChange = (event) => {
    this.setState({ verificationCode: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);
    this.setState({ error: "" });
    if (this.state.email && this.state.phone) {
      // try to log them in
      if (this.state.showVerification === false) {
        this.sendVerificationCode();
      } else {
        this.confirmVerificationCode();
      }
    } else {
      // display error reminding them to fill out all fields
      this.setState({ error: "Please fill in both fields." });
    }
  };

  sendVerificationCode = () => {
    firebase.auth().signInWithPhoneNumber(this.state.phone, window.recaptchaVerifier).then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      document.getElementById("input-email").disabled = true;
      document.getElementById("input-phone").disabled = true;
      document.getElementById("recaptcha-container").style.display = "none";
      this.setState({ showVerification: true });
    }).catch((error) => {
      console.log("error", error);
      if (error.code === "auth/user-not-found") {
        // Sign up here.
      } else {
        this.setState({ error: "Error logging in." });
      }
      grecaptcha.reset(window.recaptchaWidgetId);
    });
  };

  confirmVerificationCode = () => {
    window.confirmationResult.confirm(this.state.verificationCode).then((result) => {
      // User signed in successfully.
      var user = result.user;
      console.log("login successful", user, result);
      // ...
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      console.log("error", error);
      // ...
    });
  };

  render() {
    return (
      <div id="LoginContainer" className="inner-container">
        <Header />
        <form onSubmit={this.handleSubmit}>
          <p>Sign in or sign up by entering your email and phone number.</p>
          <input id="input-email" type="text" pattern="[a-zA-Z0-9-_.]+[@][a-zA-z0-9-_]+[.][a-zA-z]+" value={this.state.email} onChange={this.handleEmailChange} placeholder="Your email" required />
          <input id="input-phone" type="tel" pattern="[+][0-9]{2}[0-9]{8}" value={this.state.phone} onChange={this.handlePhoneChange} placeholder="Your mobile (e.g. +6598765432)" required />
          <div id="recaptcha-container"></div>
          { this.state.showVerification ? <input id="input-verification-code" type="text" value={this.state.verificationCode} onChange={this.handleVerificationCodeChange} placeholder="Verification Code" /> : null }
          <p className="error">{this.state.error}</p>
          <button className="red light" type="submit">{ this.state.showVerification ? "Login" : "Get Verification Code" }</button>
        </form>
      </div>
    );
  }

  componentDidMount() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
      'size': 'normal',
      'callback': function(response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
      },
      'expired-callback': function() {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
      }
    });
    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    });
  }
}

export default LoginContainer;
