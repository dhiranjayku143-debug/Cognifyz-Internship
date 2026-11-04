const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title || title.trim().length < 3) {
    return res.status(400).json({ error: 'Title must be at least 3 characters long' });
  }
  const task = await Task.create({ title, user: req.userId });
  res.status(201).json(task);
});

router.put('/:id', async (req, res) => {
  try {
    const changes = {};
    if (req.body.title !== undefined) {
      if (req.body.title.trim().length < 3) {
        return res.status(400).json({ error: 'Title must be at least 3 characters long' });
      }
      changes.title = req.body.title.trim();
    }
    if (req.body.done !== undefined) changes.done = Boolean(req.body.done);

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      changes,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: 'Invalid task id' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid task id' });
  }
});

module.exports = router;

