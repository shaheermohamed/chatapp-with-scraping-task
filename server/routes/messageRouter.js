const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/send-message", async (req, res) => {
  const { message, receiverId } = req.body;
  const senderId = req.session.user.userid;

  try {
    await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3)",
      [senderId, receiverId, message]
    );

    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/messages/:userId", async (req, res) => {
  const receiverId = req.params.userId;
  const senderId = req.session.user.userid;

  try {
    const messages = await pool.query(
      "SELECT * FROM messages WHERE (receiver_id = $1 AND sender_id = $2) OR (receiver_id = $2 AND sender_id = $1)",
      [receiverId, senderId]
    );

    res.json({ success: true, messages: messages.rows });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
