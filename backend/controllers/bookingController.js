// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const FacultyProfile = require('../models/FacultyProfile');

exports.createBooking = async (req, res) => {
  const { facultyId, sessionDate, duration, counseling } = req.body;
  try {
    // Find faculty to get cost
    const profile = await FacultyProfile.findOne({ user: facultyId });
    if (!profile) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    const cost = profile.hourlyCost * duration;
    const booking = await Booking.create({
      student: req.user._id,
      faculty: facultyId,
      sessionDate,
      duration,
      cost,
      counseling: counseling || false
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking' });
  }
};

// Get bookings for current user
exports.getMyBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'student') {
      bookings = await Booking.find({ student: req.user._id }).populate('faculty', 'name email');
    } else if (req.user.role === 'faculty') {
      bookings = await Booking.find({ faculty: req.user._id }).populate('student', 'name email');
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params; // booking id
  const { status } = req.body; // expected "accepted" or "rejected"
  try {
    const Booking = require('../models/Booking');
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.faculty.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    booking.paymentStatus = status;
    await booking.save();
    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
};
