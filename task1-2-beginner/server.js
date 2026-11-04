const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const submissions = [];

// Home page
app.get('/', (req, res) => {
  res.render('index', { errors: [], old: {} });
});

// Form submit + server-side validation
app.post('/submit', (req, res) => {
  const { name, email, phone, age, gender, country, message } = req.body;
  let hobbies = req.body.hobbies || [];
  if (!Array.isArray(hobbies)) hobbies = [hobbies];

  const errors = [];

  if (!name || name.trim().length < 3) {
    errors.push('Name must be atleast of 3 Characters.');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid Email.');
  }
  if (phone && !/^[0-9]{10}$/.test(phone)) {
    errors.push('Must Contain 10 digits.');
  }
  const ageNum = Number(age);
  if (!age || isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
    errors.push('Age must between 18 to 100.');
  }
  if (!gender) {
    errors.push('Select Gender.');
  }
  if (!country) {
    errors.push('Select Country.');
  }
  if (!message || message.trim().length < 10) {
    errors.push('Message must be of minimum 10 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).render('index', { errors, old: req.body });
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

  res.render('result', { entry });
});

app.get('/submissions', (req, res) => {
  res.render('submissions', { submissions });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Me', intern: 'Dhiranjay Kumar' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});