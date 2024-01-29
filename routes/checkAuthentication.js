const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.use(express.json());

router.get('/', async (req, res) => {
  try {
    if (!req.cookies.token) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({ user_name: decoded.user_name, user_email: decoded.user_email });
  } catch (error) {
    console.error('Error checking authentication:', error);
    res.status(500).json({ error: 'Error checking authentication' });
  }
});

module.exports = router;
