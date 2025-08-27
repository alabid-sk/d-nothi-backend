const pool = require("../db");

// Create task
exports.createTask = async (req, res) => {
  const {
    user_id, datetime, source, category, service, office,
    user_info, description, status, comment, file_url
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tasks
      (user_id, datetime, source, category, service, office, user_info, description, status, comment, file_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [user_id, datetime, source, category, service, office, user_info, description, status, comment, file_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get tasks (Admin sees all, agent sees own)
exports.getTasks = async (req, res) => {
  const { role, id } = req.user;
  try {
    let result;
    if (role === "agent") {
      result = await pool.query("SELECT * FROM tasks WHERE user_id=$1", [id]);
    } else {
      result = await pool.query("SELECT * FROM tasks");
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
