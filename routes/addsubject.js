const express = require('express');
const router = express.Router();
const db = require("../database/database");
router.use(express.json());

router.post('/', async (req, res) => {
    const registrationDetails = req.body;
    console.log(registrationDetails);
  
    try {
      await Promise.all(
        registrationDetails.electivesData.map(async (subject) => {
          const subjectQuery =
            "INSERT INTO Subjects (SubjectName, Seats, Semester) VALUES (?, ?, ?)";
          await db.query(subjectQuery, [subject.subjectName, subject.seats, registrationDetails.selectedSemester]);
        })
      );
  
      res.status(200).send({ message: "Data inserted successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({ error: "Error inserting data" });
    }
});

module.exports = router;
