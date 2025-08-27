const express = require("express");
const router = express.Router();
const { getTasks, createTask } = require("../controllers/taskController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth(["admin","supervisor"]), getTasks);
router.get("/self", auth(["agent","supervisor","admin"]), getTasks);
router.post("/", auth(), createTask);

module.exports = router;
