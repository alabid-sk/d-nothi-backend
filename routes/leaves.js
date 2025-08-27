const express = require("express");
const router = express.Router();
const { getLeaves, requestLeave, updateLeave } = require("../controllers/leaveController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth(["admin","supervisor"]), getLeaves);
router.get("/self", auth(), getLeaves);
router.post("/", auth(), requestLeave);
router.put("/:id", auth(["admin","supervisor"]), updateLeave);

module.exports = router;
