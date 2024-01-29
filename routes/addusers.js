const express = require("express");
const router = express.Router();
const db = require("../database/database");
const { transporter } = require("../nodemailer/nodemailer");
router.use(express.json());

router.post("/", async (req, res) => {
  const userDetails = req.body;
  console.log(userDetails);
  
  try {
    await Promise.all(
      userDetails.map(async (user) => {
        const query =
          "INSERT INTO Users (Name, Email, Category, Semester) VALUES (?, ?, ?, ?)";
        await db.query(query, [
          user.Name,
          user.Email,
          user.Category,
          user.Semester,
        ]);

        const mailOption = {
          from: "Quality Enhancement Cell, Department of Computer Science, UET NewCampus <moizarif100@gmail.com>",
          to: user.Email,
          subject: "Registeration in CQI System",
          html: `<h1>Verification</h1>
            <p>Dear ${user.Name}, You have been registered successfully inn the system, anytime your feedback is required by the university you will be sent an email containing ling to the respective form that you have to fill and submit. Thank you for your cooperation.</p>`,
        };
        transporter.sendMail(mailOption, (error, info) => {
          if (error) throw error;
          else {
            console.log("Email Sent Successfully");
          }
        });
      })
    );

    res.status(200).send({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Error inserting data" });
  }
});

module.exports = router;
