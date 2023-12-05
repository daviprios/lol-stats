import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import moment from "moment";
import "moment/dist/locale/pt-br";
moment.locale("pt-br");

import MatchContext from "./contexts/matchContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MatchContext>
      <App />
    </MatchContext>
  </React.StrictMode>
);
