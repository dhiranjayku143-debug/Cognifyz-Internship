const express = require('express');
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

// Temporary in-memory storage (cleared when the server restarts)
const submissions = [];

router.get('/', (req, res) => {
  res.render('forms/index', { errors: [], old: {} });
});

router.post('/submit', (req, res) => {
  const { name, email, phone, age, gender, country, message } = req.body;
  let hobbies = req.body.hobbies || [];
  if (!Array.isArray(hobbies)) hobbies = [hobbies];

  const errors = [];
  if (!name || name.trim().length < 3) errors.push('Name must be at least 3 characters long.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address.');
  if (phone && !/^[0-9]{10}$/.test(phone)) errors.push('Phone number must be exactly 10 digits.');
  const ageNum = Number(age);
  if (!age || isNaN(ageNum) || ageNum < 18 || ageNum > 100) errors.push('Age must be between 18 and 100.');
  if (!gender) errors.push('Please select a gender.');
  if (!country) errors.push('Please select a country.');
  if (!message || message.trim().length < 10) errors.push('Message must be at least 10 characters long.');

  if (errors.length > 0) {
    return res.status(400).render('forms/index', { errors, old: req.body });
  }

  const entry = {
    id: submissions.length + 1,
    name: name.trim(),
    email: email.trim(),
    phone: phone || '-',
    age: ageNum,
    gender,
    country,
    hobbies,
    message: message.trim(),
    createdAt: new Date().toLocaleString()
  };
  submissions.push(entry);
  res.render('forms/result', { entry });
});

router.get('/submissions', (req, res) => {
  res.render('forms/submissions', { submissions });
});

router.get('/about', (req, res) => {
  res.render('forms/about', { title: 'About Me', intern: 'Full Stack Intern' });
});

module.exports = router;
