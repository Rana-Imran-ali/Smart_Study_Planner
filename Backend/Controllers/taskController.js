const Task = require('../Models/Task');
const Activity = require('../Models/Activity');

// @desc  Get all tasks for logged-in user
// @route GET /api/tasks
// @access Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching tasks.', error: err.message });
  }
};

// @desc  Create a new task
// @route POST /api/tasks
// @access Private
const createTask = async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Task description is required.' });
  }
  try {
    const task = await Task.create({ text: text.trim(), userId: req.user.id });
    await Activity.create({
      text: `Added task: "${task.text}"`,
      type: 'task',
      userId: req.user.id
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating task.', error: err.message });
  }
};

// @desc  Toggle task done status
// @route PUT /api/tasks/:id
// @access Private
const toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    task.done = !task.done;
    await task.save();

    if (task.done) {
      await Activity.create({
        text: `Completed task: "${task.text}" ✓`,
        type: 'task',
        userId: req.user.id
      });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating task.', error: err.message });
  }
};

// @desc  Delete a task
// @route DELETE /api/tasks/:id
// @access Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting task.', error: err.message });
  }
};

module.exports = { getTasks, createTask, toggleTask, deleteTask };
