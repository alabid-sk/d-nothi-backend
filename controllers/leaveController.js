const pool = require("../db");

const getLeaves = async (req,res)=>{
  try{
    let query="SELECT * FROM leaves";
    let params=[];
    if(req.user.role==="agent") { query+=" WHERE user_id=$1"; params.push(req.user.id); }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch(err){ res.status(500).json({ error: err.message }); }
};

const requestLeave = async (req,res)=>{
  const { date_from,date_to,reason } = req.body;
  try{
    const result = await pool.query(
      "INSERT INTO leaves (user_id,date_from,date_to,reason,status,created_at) VALUES ($1,$2,$3,$4,'Pending',NOW()) RETURNING *",
      [req.user.id,date_from,date_to,reason]
    );
    res.json(result.rows[0]);
  } catch(err){ res.status(500).json({ error: err.message }); }
};

const updateLeave = async (req,res)=>{
  const { id } = req.params;
  const { status, approver } = req.body;
  try{
    const result = await pool.query(
      "UPDATE leaves SET status=$1, approver=$2 WHERE id=$3 RETURNING *",
      [status, approver, id]
    );
    res.json(result.rows[0]);
  } catch(err){ res.status(500).json({ error: err.message }); }
};

module.exports = { getLeaves, requestLeave, updateLeave };
