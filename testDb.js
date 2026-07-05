const pool = require("./config/db");

async function testConnection() {
  try {
    const result = await pool.query("SELECT * FROM users");
    console.log("Users table works:", result.rows);
  } catch (err) {
    console.error("DB error:", err);
  }
}

testConnection();