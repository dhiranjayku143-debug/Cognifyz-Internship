const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Protected route: sirf logged-in user dekh sakta hai
router.get('/', auth, async (req, res, next) => {
  try {
    const response = await fetch('https://dummyjson.com/quotes/random');
    if (!response.ok) {
      return res.status(502).json({ error: 'External API se data nahi mila' });
    }
    const data = await response.json();
    res.json({ quote: data.quote, author: data.author });
  } catch (err) {
    next(err); // central error handler ko bhej do
  }
});

module.exports = router;