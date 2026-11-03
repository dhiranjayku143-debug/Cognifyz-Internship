const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());          // JSON body padhne ke liye
app.use(express.static('public')); // frontend files serve karne ke liye

let tasks = [
  { id: 1, title: 'Learn Express', done: false }
];
let nextId = 2;

// READ: saare tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// READ: ek task
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task nahi mila' });
  res.json(task);
});

// CREATE
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim().length < 3) {
    return res.status(400).json({ error: 'Title kam se kam 3 characters ka ho' });
  }
  const task = { id: nextId++, title: title.trim(), done: false };
  tasks.push(task);
  res.status(201).json(task);
});

// UPDATE
app.put('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task nahi mila' });

  if (req.body.title !== undefined) {
    if (req.body.title.trim().length < 3) {
      return res.status(400).json({ error: 'Title kam se kam 3 characters ka ho' });
    }
    task.title = req.body.title.trim();
  }
  if (req.body.done !== undefined) task.done = Boolean(req.body.done);
  res.json(task);
});

// DELETE
app.delete('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Task nahi mila' });
  tasks.splice(index, 1);
  res.json({ message: 'Task delete ho gaya' });
});

app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});