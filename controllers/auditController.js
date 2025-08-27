const pool = require("../db");

const getAuditLogs = async (req,res)=>{
  try{
    const result = await pool.query("SELECT * FROM audit_logs ORDER BY performed_at DESC");
    res.json(result.rows);
  } catch(err){ res.status(500).json({ error: err.message }); }
};

module.exports = { getAuditLogs };
