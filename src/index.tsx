import React from "react";
import ReactDOM from "react-dom";

import App from "./app";

const container = document.querySelector("#root");
if (container === null) {
  throw new Error("React container element #root could not be found.");
}
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  container
);
