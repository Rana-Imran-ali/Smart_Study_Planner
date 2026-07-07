const Activity = require('../Models/Activity');

// @desc  Get recent activities for logged-in user (last 20)
// @route GET /api/activities
// @access Private
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching activities.', error: err.message });
  }
};

// @desc  Log a new activity entry
// @route POST /api/activities
// @access Private
const createActivity = async (req, res) => {
  const { text, type } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Activity description is required.' });
  }
  try {
    const activity = await Activity.create({
      text: text.trim(),
      type: type || 'general',
      userId: req.user.id
    });
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: 'Server error logging activity.', error: err.message });
  }
};

// @desc  Clear all activities for a user
// @route DELETE /api/activities
// @access Private
const clearActivities = async (req, res) => {
  try {
    await Activity.deleteMany({ userId: req.user.id });
    res.json({ message: 'Activity log cleared.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error clearing activities.', error: err.message });
  }
};

module.exports = { getActivities, createActivity, clearActivities };
