const express = require('express');
const auth = require('../middleware/auth');
const cache = require('../utils/cache');

const router = express.Router();

// Protected route: only logged-in users can see a quote
router.get('/', auth, async (req, res, next) => {
  try {
    const cached = cache.get('quote');
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const response = await fetch('https://dummyjson.com/quotes/random');
    if (!response.ok) {
      return res.status(502).json({ error: 'Could not fetch data from the external API' });
    }
    const data = await response.json();
    const quote = { quote: data.quote, author: data.author };

    cache.set('quote', quote, 30); // cache for 30 seconds
    res.json({ ...quote, cached: false });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
