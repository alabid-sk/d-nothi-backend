// controllers/leaveController.js
const pool = require('../db');
const { logAudit } = require('./auditController');

// Get leaves
exports.getLeaves = async (req, res) => {
  try {
    const userRole = req.user.role;
    let query = 'SELECT * FROM leaves';
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

// Request leave
exports.requestLeave = async (req, res) => {
  try {
    const { date_from, date_to, reason } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO leaves(user_id, date_from, date_to, reason, status, created_at)
       VALUES($1,$2,$3,$4,'Pending',now())
       RETURNING *`,
      [req.user.id, date_from, date_to, reason]
    );

    await logAudit('leave', rows[0].id, 'created', null, rows[0], req.user.id);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve/Reject leave (Admin/Supervisor)
exports.updateLeaveStatus = async (req, res) => {
  try {
    if (req.user.role === 'agent') return res.status(403).json({ error: 'Not authorized' });

    const { id } = req.params;
    const { status } = req.body; // 'Approved' or 'Rejected'

    const { rows: oldRows } = await pool.query('SELECT * FROM leaves WHERE id=$1', [id]);
    if (!oldRows[0]) return res.status(404).json({ error: 'Leave not found' });

    const { rows } = await pool.query(
      `UPDATE leaves SET status=$1, approver=$2 WHERE id=$3 RETURNING *`,
      [status, req.user.id, id]
    );

    await logAudit('leave', id, 'updated', oldRows[0], rows[0], req.user.id);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
