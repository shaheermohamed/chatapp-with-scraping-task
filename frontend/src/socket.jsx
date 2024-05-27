import { io } from "socket.io-client";

const socket = new io("https://chatapp-with-scraping-task-server.onrender.com", {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
