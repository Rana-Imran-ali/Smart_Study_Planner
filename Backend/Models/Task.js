const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide task description'],
    trim: true
  },
  done: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);
