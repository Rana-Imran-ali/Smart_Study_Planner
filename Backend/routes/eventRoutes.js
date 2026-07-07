const express = require('express');
const router = express.Router();
const { getEvents, createEvent, deleteEvent } = require('../Controllers/eventController');
const { protect } = require('../Middleware/auth');

router.use(protect);

// GET /api/events
router.get('/', getEvents);

// POST /api/events
router.post('/', createEvent);

// DELETE /api/events/:id
router.delete('/:id', deleteEvent);

module.exports = router;
