const pool = require('../db');

exports.getDropdowns = async (req, res) => {
  try {
    const { type } = req.params;
    const { rows } = await pool.query('SELECT * FROM dropdowns WHERE type=$1', [type]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addDropdown = async (req, res) => {
  try {
    const { type, value, parent_id } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO dropdowns(type,value,parent_id) VALUES($1,$2,$3) RETURNING *`,
      [type,value,parent_id || null]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
