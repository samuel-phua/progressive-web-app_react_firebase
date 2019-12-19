import React, { Component } from "react";
import Header from "./Header";

class LoginContainer extends Component {
  render() {
    return (
      <div id="LoginContainer" className="inner-container">
        <Header />
        <div id="loader">Loading ...</div>
        <div id="firebaseui-auth-container"></div>
      </div>
    );
  }

  componentDidMount() {
    const googleSignInOption = {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: [
        "https://www.googleapis.com/auth/contacts.readonly",
      ],
      customParameters: {
        // Forces account selection even when one account
        // is available.
        prompt: "select_account"
      }
    };
    const facebookSignInOption = {
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      scopes: [
        "public_profile",
        "email",
        "user_likes",
        "user_friends"
      ],
      customParameters: {
        // Forces password re-entry.
        auth_type: "reauthenticate"
      }
    };
    const phoneSignInOption = {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      recaptchaParameters: {
        type: "image", // 'audio'
        size: "normal", // 'invisible' or 'compact'
        badge: "bottomleft" //' bottomright' or 'inline' applies to invisible.
      },
      defaultCountry: "SG", // Set default country to the United Kingdom (+44).
      // For prefilling the national number, set defaultNationNumber.
      // This will only be observed if only phone Auth provider is used since
      // for multiple providers, the NASCAR screen will always render first
      // with a 'sign in with phone number' button.
      defaultNationalNumber: "98765432",
      // You can also pass the full phone number string instead of the
      // 'defaultCountry' and 'defaultNationalNumber'. However, in this case,
      // the first country ID that matches the country code will be used to
      // populate the country selector. So for countries that share the same
      // country code, the selected country may not be the expected one.
      // In that case, pass the 'defaultCountry' instead to ensure the exact
      // country is selected. The 'defaultCountry' and 'defaultNationaNumber'
      // will always have higher priority than 'loginHint' which will be ignored
      // in their favor. In this case, the default country will be 'GB' even
      // though 'loginHint' specified the country code as '+1'.
      loginHint: "+6598765432"
    };
    const emailSignInOption = {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
    };
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          document.getElementById("loader").style.display = "initial";
          console.log("auth result", authResult);
          console.log("redirect", redirectUrl);
          // authResult.operationType === "signIn"
          // authResult.additionalUserInfo.providerId === "phone"
          // authResult.additionalUserInfo.isNewUser === false
          // authResult.user.uid
          // authResult.user.refreshToken
          // authResult.user.displayName
          // authResult.user.email
          // authResult.user.emailVerified === true
          // authResult.user.phoneNumber
          return false;
        },
        uiShown: () => {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById("loader").style.display = "none";
        }
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: "popup",
      signInOptions: [
        googleSignInOption,
        // facebookSignInOption,
        phoneSignInOption,
        emailSignInOption,
      ],
      signInSuccessUrl: "https://www.example.com",
      // Terms of service url.
      tosUrl: "https://www.example.com",
      // Privacy policy url.
      privacyPolicyUrl: "https://www.example.com",
    };
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
  }
}

export default LoginContainer;
