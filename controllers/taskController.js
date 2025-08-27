const pool = require("../db");

const getTasks = async (req, res) => {
  try {
    let query = "SELECT * FROM tasks";
    let params = [];
    if(req.user.role === "agent") {
      query += " WHERE user_id=$1";
      params.push(req.user.id);
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

const createTask = async (req, res) => {
  const { datetime, source, category, service, office, user_info, description, status, comment, file_url } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (user_id, datetime, source, category, service, office, user_info, description, status, comment, file_url, updated_by, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *",
      [req.user.id, datetime, source, category, service, office, user_info, description, status || "Pending", comment, file_url, req.user.name, new Date()]
    );
    res.json(result.rows[0]);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTasks, createTask };
