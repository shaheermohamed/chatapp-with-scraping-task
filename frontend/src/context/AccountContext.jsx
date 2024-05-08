import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const AccountContext = createContext();

const UserContext = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ loggedIn: null });
  console.log("user:", user);
  useEffect(() => {
    //getting logged user after login
    axios
      .get("http://localhost:4000/auth/login", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("response:", response);
        if (!response || !response.data || !response.data.loggedIn) {
          setUser({ loggedIn: false });
          return;
        }
        setUser({ ...response.data });
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error during login:", error);
        setUser({ loggedIn: false });
      });
    console.log("useEffect worked");
  }, []);

  return (
    <AccountContext.Provider value={{ user, setUser }}>
      {children}
    </AccountContext.Provider>
  );
};

UserContext.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserContext;
