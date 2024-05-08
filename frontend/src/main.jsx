import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/AccountContext.jsx";
import FriendProviderContext from "./context/FriendContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserContext>
        <FriendProviderContext>
          <App />
        </FriendProviderContext>
      </UserContext>
    </BrowserRouter>
  </React.StrictMode>
);
