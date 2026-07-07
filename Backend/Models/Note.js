const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a note title'],
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'General',
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);
