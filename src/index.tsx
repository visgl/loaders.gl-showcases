/* global document */
import ReactDOM from "react-dom/client";
import { App } from "./app";
import { Provider } from "react-redux";
import { setupStore } from "./redux/store";

import "normalize.css";

const el = document.getElementById("root");
if (el) {
  const root = ReactDOM.createRoot(el);
  root.render(
    <Provider store={setupStore()}>
      <App />
    </Provider>
  );
}
