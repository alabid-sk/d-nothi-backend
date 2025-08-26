const express = require('express');
const router = express.Router();
const { getDropdowns, addDropdown } = require('../controllers/dropdownController');

// Get dropdown values
router.get('/:type', getDropdowns);

// Add dropdown value
router.post('/', addDropdown);

module.exports = router;
