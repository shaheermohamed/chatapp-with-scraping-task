const session = require("express-session");
require("dotenv").config()
const sessionM = session({
  secret: "qwertyuiop233asda",
  name: "sid",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production" ? "true" : "auto",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000 * 7, // 7 days
  },
});

const wrap = (expressMiddleware) => (socket, next) =>
  expressMiddleware(socket.request, {}, next);
module.exports = { sessionM,wrap};
