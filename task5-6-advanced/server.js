require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.static('public'));

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minute
  max: 10,                    // 15 min me max 10 attempts
  message: { error: 'Bahut zyada attempts. 15 minute baad try karo.' }
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,        // 1 minute
  max: 60,                    // 1 min me max 60 requests
  message: { error: 'Bahut zyada requests. Thoda ruko.' }
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/quote', require('./routes/quote'));

// 404 handler (API ke liye)
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route nahi mila' });
});

// Central error handler (hamesha sabse last me)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Server me kuch galat hua' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server chal raha hai: http://localhost:${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err.message));