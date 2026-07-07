const Event = require('../Models/Event');
const Activity = require('../Models/Activity');

// @desc  Get all calendar events for logged-in user
// @route GET /api/events
// @access Private
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.id }).sort({ date: 1, time: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching events.', error: err.message });
  }
};

// @desc  Create a new calendar event
// @route POST /api/events
// @access Private
const createEvent = async (req, res) => {
  const { title, date, time } = req.body;
  if (!title || !date) {
    return res.status(400).json({ message: 'Event title and date are required.' });
  }
  try {
    const event = await Event.create({
      title: title.trim(),
      date,
      time: time || '09:00',
      userId: req.user.id
    });
    await Activity.create({
      text: `Scheduled event: "${event.title}" on ${event.date}`,
      type: 'planner',
      userId: req.user.id
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating event.', error: err.message });
  }
};

// @desc  Delete a calendar event
// @route DELETE /api/events/:id
// @access Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user.id });
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting event.', error: err.message });
  }
};

module.exports = { getEvents, createEvent, deleteEvent };
