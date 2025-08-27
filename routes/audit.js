const express = require("express");
const router = express.Router();
const { getAuditLogs } = require("../controllers/auditController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth(["admin","supervisor"]), getAuditLogs);

module.exports = router;
