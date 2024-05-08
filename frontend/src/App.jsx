import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";
import PrivateRoutes from "./components/PrivateRoutes";
import { useContext } from "react";
import { AccountContext } from "./context/AccountContext";
import Home from "./components/Home/Home";
import socket from "./socket";
import Scrape from "./components/Scrape";

function App() {
  socket.connect();
  const { user } = useContext(AccountContext);
  return user?.loggedIn === null ? (
    ""
  ) : (
    <Routes>
      <Route path="*" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<Home />} />
        <Route path="/scrape" element={<Scrape />} />
      </Route>
    </Routes>
  );
}

export default App;
