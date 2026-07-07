const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide goal description'],
    trim: true
  },
  category: {
    type: String,
    default: 'General',
    trim: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Goal', GoalSchema);
