const pool = require("../db");

const getDropdowns = async (req,res)=>{
  const { type } = req.params;
  try{
    const result = await pool.query("SELECT * FROM dropdowns WHERE type=$1", [type]);
    res.json(result.rows);
  } catch(err){ res.status(500).json({ error: err.message }); }
};

const addDropdown = async (req,res)=>{
  const { type,value,parent } = req.body;
  try{
    const result = await pool.query("INSERT INTO dropdowns (type,value,parent) VALUES ($1,$2,$3) RETURNING *",[type,value,parent||null]);
    res.json(result.rows[0]);
  } catch(err){ res.status(500).json({ error: err.message }); }
};

module.exports={getDropdowns, addDropdown};
