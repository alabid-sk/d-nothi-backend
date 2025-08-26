const express = require('express');
const router = express.Router();
const { getTasks, createTask } = require('../controllers/taskController');

// Get all tasks
router.get('/', getTasks);

// Create task
router.post('/', createTask);

module.exports = router;
