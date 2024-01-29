const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.get('/', async (req, res) => {
    try {
        const result = await db.query("SELECT MIN(id) AS id, Semester FROM subjects GROUP BY Semester");
        res.status(200).send(result[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'Error retrieving semester values' });
    }
});

module.exports = router;
