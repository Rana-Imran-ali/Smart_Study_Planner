const express = require('express');
const router = express.Router();
const { getActivities, createActivity, clearActivities } = require('../Controllers/activityController');
const { protect } = require('../Middleware/auth');

router.use(protect);

// GET /api/activities
router.get('/', getActivities);

// POST /api/activities
router.post('/', createActivity);

// DELETE /api/activities  (clear all)
router.delete('/', clearActivities);

module.exports = router;
