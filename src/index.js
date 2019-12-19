import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "core-js/stable";
import "regenerator-runtime/runtime";
import App from "./components/App";

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById("root"));

if (module.hot) {
  module.hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    ReactDOM.render(
      <BrowserRouter><NextApp /></BrowserRouter>,
      document.getElementById("root")
    );
  });
}
