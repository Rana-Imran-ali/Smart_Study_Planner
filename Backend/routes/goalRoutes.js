const express = require('express');
const router = express.Router();
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../Controllers/goalController');
const { protect } = require('../Middleware/auth');

router.use(protect);

// GET /api/goals
router.get('/', getGoals);

// POST /api/goals
router.post('/', createGoal);

// PUT /api/goals/:id  (update progress or details)
router.put('/:id', updateGoal);

// DELETE /api/goals/:id
router.delete('/:id', deleteGoal);

module.exports = router;
