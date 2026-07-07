const Note = require('../Models/Note');
const Activity = require('../Models/Activity');

// @desc  Get all notes for logged-in user
// @route GET /api/notes
// @access Private
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching notes.', error: err.message });
  }
};

// @desc  Create a new note
// @route POST /api/notes
// @access Private
const createNote = async (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Note title is required.' });
  }
  try {
    const note = await Note.create({
      title: title.trim(),
      content: content || '',
      category: category || 'General',
      userId: req.user.id
    });
    await Activity.create({
      text: `Created note: "${note.title}"`,
      type: 'general',
      userId: req.user.id
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating note.', error: err.message });
  }
};

// @desc  Update a note
// @route PUT /api/notes/:id
// @access Private
const updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found.' });

    const { title, content, category } = req.body;
    if (title) note.title = title.trim();
    if (content !== undefined) note.content = content;
    if (category) note.category = category;

    await note.save();
    await Activity.create({
      text: `Updated note: "${note.title}"`,
      type: 'general',
      userId: req.user.id
    });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating note.', error: err.message });
  }
};

// @desc  Delete a note
// @route DELETE /api/notes/:id
// @access Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found.' });

    await note.deleteOne();
    res.json({ message: 'Note deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting note.', error: err.message });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
