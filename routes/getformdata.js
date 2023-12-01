const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.get('/:id', async (req, res) => {
    const formId = req.params.id;

    try {
        const formQuery = `SELECT * FROM forms WHERE form_id = ${formId}`;
        const formResult = await db.query(formQuery);
        const formDetails = formResult[0][0];
        const titlesQuery = `
            SELECT titles.title, questions.text, questions.ResponseType
            FROM titles
            INNER JOIN questions ON titles.title_id = questions.title_id
            WHERE titles.form_id = ${formId}
        `;
        const titlesResult = await db.query(titlesQuery);
        const formattedData = {
            form_id: formDetails.form_id,
            formTitle: formDetails.formTitle,
            category: formDetails.category,
            titles: []
        };
        const titlesMap = new Map();
        titlesResult[0].forEach(row => {
            const title = row.title;
            if (!titlesMap.has(title)) {
                titlesMap.set(title, []);
            }
            titlesMap.get(title).push({
                text: row.text,
                ResponseType: row.ResponseType
            });
        });
        titlesMap.forEach((questions, title) => {
            formattedData.titles.push({
                title: title,
                questions: questions
            });
        });

        res.status(200).send(formattedData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'Error retrieving data' });
    }
});

module.exports = router;
