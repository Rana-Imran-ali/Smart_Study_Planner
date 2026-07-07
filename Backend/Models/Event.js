const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'Please provide a date (YYYY-MM-DD)']
  },
  time: {
    type: String,
    required: [true, 'Please provide a time (HH:MM)'],
    default: '09:00'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);
