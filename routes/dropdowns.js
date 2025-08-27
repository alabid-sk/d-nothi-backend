const express = require("express");
const router = express.Router();
const { getDropdowns, addDropdown } = require("../controllers/dropdownController");
const auth = require("../middleware/authMiddleware");

router.get("/:type", auth(), getDropdowns);
router.post("/", auth(["admin","supervisor"]), addDropdown);

module.exports = router;
