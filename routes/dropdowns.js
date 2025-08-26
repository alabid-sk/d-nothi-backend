const express = require('express');
const router = express.Router();
const { getDropdowns, addDropdown } = require('../controllers/dropdownController');

// Get dropdowns by type
router.get('/:type', getDropdowns);

// Add new dropdown value
router.post('/', addDropdown);

module.exports = router;
