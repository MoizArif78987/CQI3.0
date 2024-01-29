const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.post('/', async (req, res) => {
  try {
    const ratingResponses = req.body;

    // Iterate over rating responses
    for (const response of ratingResponses) {
      const { form_id: formId, user_id: userId, question_id: questionId, rating_response: ratingResponse } = response;

      // Check if the user has already submitted a response for the given form and question
      const existingResponseQuery = `
        SELECT * FROM ratingresponses
        WHERE form_id = ? AND user_id = ? AND question_id = ?
      `;

      const [existingResponses] = await db.query(existingResponseQuery, [formId, userId, questionId]);

      if (existingResponses.length === 0) {
        // User has not submitted a response, proceed with insertion
        const insertRatingResponseQuery = `
          INSERT INTO ratingresponses (form_id, user_id, question_id, rating_response)
          VALUES (?, ?, ?, ?)
        `;

        await db.query(insertRatingResponseQuery, [formId, userId, questionId, ratingResponse]);
      } else {
        // User has already submitted a response, handle accordingly
        console.log(`User ${userId} has already submitted a response for form ${formId} and question ${questionId}.`);
        // Handle logic based on your requirements
      }
    }

    res.status(200).send({ message: 'Rating responses inserted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Error inserting rating responses' });
  }
});

module.exports = router;
