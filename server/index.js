const express = require("express");
const { Server } = require("socket.io");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const authRouter = require("./routes/authRouter");
const messageRouter = require("./routes/messageRouter");
const userRouter = require("./routes/userRouter");
const scrapeRouter = require("./routes/scrapeRouter");
const { sessionM, wrap } = require("./controllers/serverControllers");
const {
  authorizedUser,
  addFriend,
} = require("./controllers/socketControllers");
require("dotenv").config();

const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chatapp-with-scraping-task-frontend.onrender.com",
    credentials: true,
  },
});

app.use(helmet());
app.use(
  cors({
    origin: "https://chatapp-with-scraping-task-frontend.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(sessionM);
app.options(
  "*",
  cors({
    origin: "https://chatapp-with-scraping-task-frontend.onrender.com",
    credentials: true,
  })
);
app.use("/auth", authRouter);
app.use("/chat", messageRouter);
app.use("/user", userRouter);
app.use("/url", scrapeRouter);

app.get("/", (req, res) => {
  res.json("Hello World");
});
io.use(wrap(sessionM));
io.use(authorizedUser);
io.on("connect", (socket) => {
  console.log("socketUser", socket.user.userid);
  console.log("socketId", socket.id);
  console.log("socket connection:", socket.request.session?.user?.username);
  socket.on("add_friend", addFriend);
});

server.listen(4000, () => {
  console.log("Server listening on port 4000");
});
