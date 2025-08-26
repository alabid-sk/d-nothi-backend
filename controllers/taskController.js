const pool = require('../db');

exports.getTasks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { user_id, datetime, source, category, service, office, user_info, description, status, comment, file_url } = req.body;

    const result = await pool.query(
      `INSERT INTO tasks 
        (user_id, datetime, source, category, service, office, user_info, description, status, comment, file_url) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) 
       RETURNING *`,
      [user_id, datetime, source, category, service, office, user_info, description, status, comment, file_url]
    );

    res.json({ message: 'Task created', task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
