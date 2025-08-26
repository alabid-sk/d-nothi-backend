const pool = require('../db');

exports.getDropdowns = async (req, res) => {
  try {
    const { type } = req.params;
    const result = await pool.query('SELECT * FROM dropdowns WHERE type=$1', [type]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addDropdown = async (req, res) => {
  try {
    const { type, value } = req.body;
    const result = await pool.query(
      'INSERT INTO dropdowns (type, value) VALUES ($1,$2) RETURNING *',
      [type, value]
    );
    res.json({ message: 'Dropdown added', dropdown: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
