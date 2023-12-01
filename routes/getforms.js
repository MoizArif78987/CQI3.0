const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.get('/', async (err,res)=>{
    try{
        const result = await db.query("Select * from forms");
        res.status(200).send(result[0]);
    }catch(error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'Error inserting data' });
    }
})

module.exports=router;