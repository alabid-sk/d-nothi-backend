const express = require("express");
const router = express.Router();
const { createUser, updatePrivileges, getUsers } = require("../controllers/userController");
const { protect, adminOrSupervisor } = require("../middleware/authMiddleware");

// Admin/Supervisor only
router.post("/", protect, adminOrSupervisor, createUser);
router.put("/:id/privileges", protect, adminOrSupervisor, updatePrivileges);
router.get("/", protect, adminOrSupervisor, getUsers);

module.exports = router;
