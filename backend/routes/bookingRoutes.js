// backend/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createBooking, getMyBookings, updateBookingStatus } = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);
router.put('/:id/update-status', protect, updateBookingStatus);

module.exports = router;
