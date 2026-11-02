const express = require('express');
const app = express();
const PORT = 3000;

// EJS ko template engine bata rahe hain
app.set('view engine', 'ejs');

// Form ka data padhne ke liye (req.body me aayega)
app.use(express.urlencoded({ extended: true }));

// Home page: form dikhata hai
app.get('/', (req, res) => {
  res.render('index');
});

// Form submit hone par ye chalega
app.post('/submit', (req, res) => {
 const { name, email, phone, city, message } = req.body;
res.render('result', { name, email, phone, city, message });
});

// About page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Me', intern: 'Dhiranjay Kumar' });
});

app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});