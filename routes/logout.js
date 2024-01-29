const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  try {
    res.clearCookie('token', { path: '/' });
    res.status(200).send('Logout successful');
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Error during logout' });
  }
});

module.exports = router;
