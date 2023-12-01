const express = require('express');
const router = express.Router();
const db = require('../database/database');
router.use(express.json());

router.post('/', async (req, res) => {
  const formData = req.body;
  console.log(formData.formTitle, formData.category, formData.titles);

  const formTitle = formData.formTitle;
  const category = formData.category;
  const titles = formData.titles;

  try {
    const insertFormQuery = 'INSERT INTO forms (formTitle, category) VALUES (?, ?)';
    const formResult = await db.query(insertFormQuery, [formTitle, category]);
    const formId = formResult[0].insertId;

    for (const title of titles) {
      const titleValue = title.title;
      const questions = title.questions;

      const insertTitleQuery = 'INSERT INTO titles (title, form_id) VALUES (?, ?)';
      const titleResult = await db.query(insertTitleQuery, [titleValue, formId]);
      const titleId = titleResult[0].insertId;

      for (const question of questions) {
        const questionText = question.text;
        const responseType = question.ResponseType;

        // Insert the question for the respective titleId
        const insertQuestionQuery = 'INSERT INTO questions (question, title_id, responseType, form_id) VALUES (?, ?, ?, ?)';
        await db.query(insertQuestionQuery, [questionText, titleId, responseType, formId]);
      }
    }

    res.status(200).send({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Error inserting data' });
  }
});


module.exports = router;
