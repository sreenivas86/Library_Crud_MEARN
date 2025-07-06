const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  bookName: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Library', librarySchema);
