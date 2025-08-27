const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../controllers/authController");
const { createTask, getTasks } = require("../controllers/taskController");

router.get("/", authMiddleware(["admin","supervisor"]), getTasks);
router.get("/self", authMiddleware(["agent"]), getTasks);
router.post("/", authMiddleware(["admin","supervisor","agent"]), createTask);

module.exports = router;
