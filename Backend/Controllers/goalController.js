const Goal = require('../Models/Goal');
const Activity = require('../Models/Activity');

// @desc  Get all goals for logged-in user
// @route GET /api/goals
// @access Private
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching goals.', error: err.message });
  }
};

// @desc  Create a new goal
// @route POST /api/goals
// @access Private
const createGoal = async (req, res) => {
  const { text, category } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Goal description is required.' });
  }
  try {
    const goal = await Goal.create({
      text: text.trim(),
      category: category || 'General',
      progress: 0,
      userId: req.user.id
    });
    await Activity.create({
      text: `Added new goal: "${goal.text}"`,
      type: 'task',
      userId: req.user.id
    });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating goal.', error: err.message });
  }
};

// @desc  Update goal progress or details
// @route PUT /api/goals/:id
// @access Private
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found.' });

    const { progress, text, category } = req.body;

    if (progress !== undefined) {
      const newProgress = Math.min(Math.max(Number(progress), 0), 100);
      goal.progress = newProgress;
      if (newProgress === 100) {
        await Activity.create({
          text: `Completed goal: "${goal.text}" 🏆`,
          type: 'task',
          userId: req.user.id
        });
      }
    }
    if (text) goal.text = text.trim();
    if (category) goal.category = category;

    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating goal.', error: err.message });
  }
};

// @desc  Delete a goal
// @route DELETE /api/goals/:id
// @access Private
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found.' });

    await goal.deleteOne();
    res.json({ message: 'Goal deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting goal.', error: err.message });
  }
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };
