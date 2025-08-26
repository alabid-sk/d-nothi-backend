const express = require('express');
const router = express.Router();
const { getLeaves, requestLeave } = require('../controllers/leaveController');

// Get leave requests
router.get('/', getLeaves);

// Request leave
router.post('/', requestLeave);

module.exports = router;
