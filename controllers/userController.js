const bcrypt = require("bcryptjs");
const pool = require("../db");

// Create new user (Admin/Supervisor only)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, privileges } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password, role, privileges) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, privileges",
      [name, email, hashedPassword, role, privileges || {}]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update privileges
const updatePrivileges = async (req, res) => {
  try {
    const { id } = req.params;
    const { privileges } = req.body;

    const result = await pool.query(
      "UPDATE users SET privileges=$1 WHERE id=$2 RETURNING id, name, email, role, privileges",
      [privileges, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update privileges error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// List all users
const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role, privileges FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createUser, updatePrivileges, getUsers };
