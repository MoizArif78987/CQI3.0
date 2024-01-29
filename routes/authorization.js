require('dotenv').config();
const express = require("express");
const router = express.Router();
const db = require("../database/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

router.use(cookieParser());
router.use(express.json());

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = "SELECT * FROM Admin WHERE LOWER(email) = LOWER(?);";
    const [user] = await db.query(query, [email]);

    if (!user || user[0].password === undefined || user[0].password === null) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user[0].password);

    if (!isPasswordMatch) {
      return res.status(401).send({ error: "Invalid password" });
    }

    const token = jwt.sign(
      {
        user_id: user[0].id,
        user_name: user[0].name,
        user_email: user[0].email 
      },
      process.env.JWT_SECRET
    );
    console.log(token);

    res.status(200).cookie("token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    }).send({ message: "Authentication successful", user_name: user[0].name, user_email: user[0].email });
    

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Error during authentication" });
  }
});

module.exports = router;
