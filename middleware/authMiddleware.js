const jwt = require('jsonwebtoken');
const pool = require('../db');

exports.protect = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  if (token.startsWith('Bearer ')) token = token.slice(7, token.length);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await pool.query('SELECT id, role FROM users WHERE id=$1', [decoded.id]);
    if (!rows[0]) return res.status(401).json({ error: 'User not found' });

    req.user = rows[0]; // id and role
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalid' });
  }
};
