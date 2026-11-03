const express = require('express');
const app = express();
const PORT = 3001;

app.set('view engine', 'ejs');

// public folder ki files (CSS, images) serve karne ke liye
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});