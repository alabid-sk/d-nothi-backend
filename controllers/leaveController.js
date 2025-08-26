const pool = require('../db');

exports.getLeaves = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leaves ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.requestLeave = async (req, res) => {
  try {
    const { user_id, date_from, date_to, reason } = req.body;

    const result = await pool.query(
      `INSERT INTO leaves (user_id, date_from, date_to, reason, status) 
       VALUES ($1,$2,$3,$4,'pending') RETURNING *`,
      [user_id, date_from, date_to, reason]
    );

    res.json({ message: 'Leave requested', leave: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
