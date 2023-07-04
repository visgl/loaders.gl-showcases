/* global document */
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import { Provider } from "react-redux";
import { setupStore } from "./redux/store";

import "normalize.css";

ReactDOM.render(
    <Provider store={setupStore()}>
        <App />
    </Provider>
, document.getElementById("root"));
