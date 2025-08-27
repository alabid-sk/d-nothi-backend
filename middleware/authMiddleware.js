const jwt = require("jsonwebtoken");
const pool = require("../db");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const result = await pool.query("SELECT id, email, role, privileges FROM users WHERE id=$1", [decoded.id]);
      if (!result.rows[0]) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = result.rows[0];
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const adminOrSupervisor = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "supervisor")) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin/supervisor" });
  }
};

module.exports = { protect, adminOrSupervisor };
