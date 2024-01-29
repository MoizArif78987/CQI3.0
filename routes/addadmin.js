const express = require("express");
const router = express.Router();
const db = require("../database/database");
const { transporter } = require("../nodemailer/nodemailer");
const bcrypt = require('bcrypt');
router.use(express.json());

router.post("/", async (req, res) => {
  const jsonData = req.body;

  const generateRandomPassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  try {
    const dataWithHashedPasswords = jsonData.map((user) => {
      const password = generateRandomPassword();
      const hashedPassword = bcrypt.hashSync(password, 10);

      return {
        ...user,
        Password: hashedPassword,
        PlainPassword: password, 
      };
    });

    console.log(dataWithHashedPasswords);

    await Promise.all(
      dataWithHashedPasswords.map(async (user) => {
        const query =
          "INSERT INTO Admin (name, email, password) VALUES (?, ?, ?)";
        await db.query(query, [
          user.Name,
          user.Email,
          user.Password,
        ]);

        const mailOption = {
          from: "Quality Enhancement Cell, Department of Computer Science, UET NewCampus <moizarif100@gmail.com>",
          to: user.Email,
          subject: "Administrative Rights to CQI System",
          html: `<h1>Verification</h1>
            <p>Dear ${user.Name}, You have been registered successfully in the system, 
            <br>
            To Login to the system please use the Following credentials
            <br>
            <br>
            Email: ${user.Email}
            <br>
            And password: <b> ${user.PlainPassword} </b>
            <br>
            <br>
            Keep in mind that this password must be used for the first login, and you can edit it later on using the profile manager in the system
            </p>`,
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
