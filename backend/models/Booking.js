const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    cost: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'accepted', 'rejected'],
      default: 'pending',
    },
    counseling: { type: Boolean, default: false },
    paymentDetails: { type: Object }, // New field to store payment info
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
