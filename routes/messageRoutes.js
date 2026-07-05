const express = require("express");
const router = express.Router();

const messageModel = require("../models/messageModel");
router.get("/create-page", (req, res) => {
  if (!req.user) return res.redirect("/users/login");
  res.render("newMessage");
});
// CREATE MESSAGE
router.post("/create", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Login required" });
  }

  const { title, text } = req.body;

  const message = await messageModel.createMessage(
    title,
    text,
    req.user.id
  );

  res.json(message);
});

// GET ALL MESSAGES
router.get("/", async (req, res) => {
  const messages = await messageModel.getAllMessages();

  const formatted = messages.map((msg) => {
    let base = {
      id: msg.id,
      title: msg.title,
      text: msg.text,
    };

    if (req.user?.is_member) {
      base.author = msg.first_name + " " + msg.last_name;
      base.created_at = msg.created_at;
    }

    return base;
  });

  res.render("index", {
    messages: formatted,
    user: req.user || null,
  });
});
router.delete("/:id", async (req, res) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ message: "Admin only" });
  }

  await pool.query("DELETE FROM messages WHERE id = $1", [
    req.params.id,
  ]);

  res.json({ message: "Message deleted" });
});
module.exports = router;