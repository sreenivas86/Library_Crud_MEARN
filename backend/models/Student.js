const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  className: { type: String, required: true },
  imagePath: { type: String, required: true },
  videoPath: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
