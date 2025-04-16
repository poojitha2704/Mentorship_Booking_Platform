// backend/models/FacultyProfile.js
const mongoose = require('mongoose');

const facultyProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  skills: { type: [String], required: true },
  subjects: { type: [String], required: true },
  bio: { type: String },
  hourlyCost: { type: Number, required: true },
  counseling: { type: Boolean, default: false },
  availability: { type: [String] }, // e.g., ["Mon 10am-2pm", "Wed 1pm-5pm"]
}, { timestamps: true });

module.exports = mongoose.model('FacultyProfile', facultyProfileSchema);
