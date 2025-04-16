// backend/controllers/facultyController.js
const FacultyProfile = require('../models/FacultyProfile');

// Create or update faculty profile
exports.createOrUpdateProfile = async (req, res) => {
  const { skills, subjects, bio, hourlyCost, counseling, availability } = req.body;
  try {
    let profile = await FacultyProfile.findOne({ user: req.user._id });
    if (profile) {
      profile.skills = skills;
      profile.subjects = subjects;
      profile.bio = bio;
      profile.hourlyCost = hourlyCost;
      profile.counseling = counseling;
      profile.availability = availability;
      profile = await profile.save();
      return res.json(profile);
    } else {
      profile = await FacultyProfile.create({
        user: req.user._id,
        skills,
        subjects,
        bio,
        hourlyCost,
        counseling,
        availability,
      });
      return res.status(201).json(profile);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Get all faculty profiles (with filtering by subject or counseling option)
exports.getAllFaculty = async (req, res) => {
  const { subject, counseling } = req.query;
  let filter = {};
  if (subject) {
    filter.subjects = subject;
  }
  if (counseling) {
    filter.counseling = counseling === 'true';
  }
  try {
    const profiles = await FacultyProfile.find(filter).populate('user', 'name email');
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profiles' });
  }
};
