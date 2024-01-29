const express = require('express');
const router = express.Router();
const db = require('../database/database');
router.use(express.json());

router.post('/', async (req, res) => {
  try {
    const textResponses = req.body;
    console.log('Text Responses:', textResponses);

    // Assuming your TextResponses table columns are named as follows
    const responseTable = 'textresponses';
    const formIdColumn = 'form_id';
    const questionIdColumn = 'question_id';
    const userIdColumn = 'user_id';
    const textResponseColumn = 'text_response';

    // Insert the text responses into the database only when user_id is not empty
    for (const response of textResponses) {
      const {
        form_id: formId,
        question_id: questionId,
        user_id: userId,
        text_response: textResponse,
      } = response;

      if (userId) {
        // Check if the user has already submitted a response for the given form and question
        const existingResponseQuery = `
          SELECT * FROM ${responseTable}
          WHERE ${formIdColumn} = ? AND ${userIdColumn} = ? AND ${questionIdColumn} = ?
        `;

        const [existingResponses] = await db.query(existingResponseQuery, [formId, userId, questionId]);

        if (existingResponses.length === 0) {
          // User has not submitted a response, proceed with insertion
          const insertTextResponseQuery = `
            INSERT INTO ${responseTable} 
              (${formIdColumn}, ${questionIdColumn}, ${userIdColumn}, ${textResponseColumn})
            VALUES (?, ?, ?, ?)
          `;

          await db.query(insertTextResponseQuery, [formId, questionId, userId, textResponse]);
        } else {
          // User has already submitted a response, handle accordingly
          console.log(`User ${userId} has already submitted a text response for form ${formId} and question ${questionId}.`);
          // Handle logic based on your requirements
        }
      }
    }

    res.status(200).send({ message: 'Text responses inserted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Error inserting text responses' });
  }
});

module.exports = router;
