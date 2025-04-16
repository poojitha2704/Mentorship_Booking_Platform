// backend/routes/facultyRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createOrUpdateProfile } = require('../controllers/facultyController');

// POST to create or update profile
router.post('/profile', protect, createOrUpdateProfile);

// GET to fetch the faculty profile of the logged-in user
router.get('/profile', protect, async (req, res) => {
  const FacultyProfile = require('../models/FacultyProfile');
  try {
    const profile = await FacultyProfile.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'No profile found. Please create one in the dashboard.' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// GET all faculty profiles (with filtering)
router.get('/all', protect, async (req, res) => {
  const { subject, counseling } = req.query;
  let filter = {};
  if (subject) {
    filter.subjects = subject;
  }
  if (counseling) {
    filter.counseling = counseling === 'true';
  }
  try {
    const profiles = await require('../models/FacultyProfile').find(filter).populate('user', 'name email');
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profiles', error: error.message });
  }
});

module.exports = router;
