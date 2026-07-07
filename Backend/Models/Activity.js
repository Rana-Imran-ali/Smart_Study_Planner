const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide activity description'],
    trim: true
  },
  type: {
    type: String,
    enum: ['task', 'planner', 'focus', 'general'],
    default: 'general'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', ActivitySchema);
