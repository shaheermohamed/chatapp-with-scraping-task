import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
export const FriendContext = createContext();

const FriendProviderContext = ({ children }) => {
  const [friendList, setFriendList] = useState([]);
//fetching user list
  const handleUserList = () => {
    axios
      .get("https://chatapp-with-scraping-task-server.onrender.com/user/list", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("response:", response);
        console.log("friendsList:", response.data);
        setFriendList(response.data?.users || []);
      })
      .catch((error) => {
        console.error("Error during friends fetching:", error);
      });
  };
  useEffect(() => {
    handleUserList()
    console.log("useEffect worked");
  }, []);

  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      {children}
    </FriendContext.Provider>
  );
};

FriendProviderContext.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FriendProviderContext;
