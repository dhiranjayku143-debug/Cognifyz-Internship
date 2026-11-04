const express = require('express');
const app = express();
const PORT = 3001;

app.set('view engine', 'ejs');

// Serve static files (CSS, images) from the public folder
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/app', (req, res) => {
  res.render('app');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});