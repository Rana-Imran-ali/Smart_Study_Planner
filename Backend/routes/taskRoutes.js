const express = require('express');
const router = express.Router();
const { getTasks, createTask, toggleTask, deleteTask } = require('../Controllers/taskController');
const { protect } = require('../Middleware/auth');

router.use(protect);

// GET /api/tasks
router.get('/', getTasks);

// POST /api/tasks
router.post('/', createTask);

// PUT /api/tasks/:id  (toggle done)
router.put('/:id', toggleTask);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

module.exports = router;
