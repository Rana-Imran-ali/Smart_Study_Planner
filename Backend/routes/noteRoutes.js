const express = require('express');
const router = express.Router();
const { getNotes, createNote, updateNote, deleteNote } = require('../Controllers/noteController');
const { protect } = require('../Middleware/auth');

router.use(protect);

// GET /api/notes
router.get('/', getNotes);

// POST /api/notes
router.post('/', createNote);

// PUT /api/notes/:id
router.put('/:id', updateNote);

// DELETE /api/notes/:id
router.delete('/:id', deleteNote);

module.exports = router;
