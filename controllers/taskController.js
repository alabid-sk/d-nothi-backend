// controllers/taskController.js
const pool = require('../db');
const { logAudit } = require('./auditController');

// Get tasks
exports.getTasks = async (req, res) => {
  try {
    const userRole = req.user.role;
    let query = 'SELECT * FROM tasks';
    let params = [];

    if (userRole === 'agent') {
      query += ' WHERE user_id = $1';
      params.push(req.user.id);
    }

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create task
exports.createTask = async (req, res) => {
  try {
    const {
      datetime, source, category, service, office,
      user_info, description, status, comment, file_url
    } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO tasks(user_id, datetime, source, category, service, office, user_info, description, status, comment, file_url, updated_by, updated_at)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,now())
       RETURNING *`,
      [req.user.id, datetime || new Date(), source, category, service, office, user_info, description, status || 'Pending', comment, file_url, req.user.id]
    );

    await logAudit('task', rows[0].id, 'created', null, rows[0], req.user.id);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update task (example)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { rows: oldRows } = await pool.query('SELECT * FROM tasks WHERE id=$1', [id]);
    if (!oldRows[0]) return res.status(404).json({ error: 'Task not found' });

    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setStr = fields.map((f, i) => `${f}=$${i+1}`).join(',');

    const { rows } = await pool.query(
      `UPDATE tasks SET ${setStr}, updated_by=$${fields.length+1}, updated_at=now() WHERE id=$${fields.length+2} RETURNING *`,
      [...values, req.user.id, id]
    );

    await logAudit('task', id, 'updated', oldRows[0], rows[0], req.user.id);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
