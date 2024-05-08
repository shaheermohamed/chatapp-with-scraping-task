const express = require("express");
const Yup = require("yup");
const validateForm = require("../controllers/validateForm");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

router
  .route("/login")
  .get(async (req, res) => {
    console.log("req.session.user testing:", req.session.user);
    if (req.session.user && req.session.user.username) {
      res.json({
        loggedIn: true,
        username: req.session.user.username,
        userid: req.session.user.userid,
      });
    } else {
      res.json({ loggedIn: false });
    }
  })
  .post(async (req, res) => {
    validateForm(req, res);
    console.log(req.session);
    const potentialLogin = await pool.query(
      "SELECT id, username,passhash,userid FROM users u WHERE u.username=$1",
      [req.body.username]
    );
    console.log("potentialLogin:", potentialLogin);
    if (potentialLogin.rowCount > 0) {
      const isSamePass = await bcrypt.compare(
        req.body.password,
        potentialLogin.rows[0].passhash
      );

      console.log("isSamePass:", isSamePass);
      if (isSamePass) {
        req.session.user = {
          username: req.body.username,
          id: potentialLogin.rows[0].id,
          userid: potentialLogin.rows[0].userid,
        };
        console.log(req.session, "... this is testing");
        res.json({
          loggedIn: true,
          username: req.body.username,
          userid: potentialLogin.rows[0].userid,
        });
      } else {
        console.log("error while login");
        res.json({ loggedIn: false, status: "wrong username or password" });
      }
    } else {
      console.log("error while login");
      res.json({ loggedIn: false, status: "wrong username or password" });
    }
  });

router.post("/register", async (req, res) => {
  validateForm(req, res);
  const existingUser = await pool.query(
    "SELECT username from users WHERE username=$1",
    [req.body.username]
  );
  console.log("existingUser:", existingUser);
  if (existingUser.rowCount === 0) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await pool.query(
      "INSERT INTO users (username, passhash, userid) VALUES ($1, $2, $3) RETURNING id, username, userid",
      [req.body.username, hashedPassword, uuidv4()]
    );
    req.session.user = {
      username: req.body.username,
      id: newUserQuery.rows[0].id,
      userid: newUserQuery.rows[0].userid,
    };
    res.json({
      loggedIn: true,
      username: req.body.username,
      userid: newUserQuery.rows[0].userid,
    });
  } else {
    console.log("error while registering");
    res.json({ loggedIn: false, status: "Username already taken" });
  }
});

module.exports = router;
