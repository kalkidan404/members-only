const pool = require("../config/db");

async function createMessage(title, text, userId) {
  const result = await pool.query(
    `INSERT INTO messages (title, text, user_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, text, userId]
  );

  return result.rows[0];
}

async function getAllMessages() {
  const result = await pool.query(
    `SELECT messages.*, users.first_name, users.last_name
     FROM messages
     JOIN users ON users.id = messages.user_id
     ORDER BY created_at DESC`
  );

  return result.rows;
}

module.exports = {
  createMessage,
  getAllMessages,
};