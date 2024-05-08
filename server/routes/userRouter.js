const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/list", async (req, res) => {
  try {
    const users = await pool.query("SELECT userid,username,id FROM users");

    res.json({ success: true, users: users.rows });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
