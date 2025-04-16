const stripe = require('stripe');
const Booking = require('../models/Booking');

// Initialize Stripe with your secret key
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Create PaymentIntent
exports.createPaymentIntent = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!booking.cost || isNaN(booking.cost)) {
      return res.status(400).json({ message: 'Invalid or missing booking cost' });
    }

    const amountInCents = Math.round(booking.cost * 100); // Stripe expects amount in cents

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd', // Use USD for US-based Stripe account
      metadata: { bookingId },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('❌ Error creating PaymentIntent:', error);
    res.status(500).json({ message: 'Error creating PaymentIntent', error: error.message });
  }
};

// Complete Payment and update booking
exports.completePayment = async (req, res) => {
  const { bookingId, paymentInfo } = req.body;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = 'completed';
    booking.paymentDetails = paymentInfo;

    await booking.save();

    res.json({ message: 'Payment completed successfully', booking });
  } catch (error) {
    console.error('❌ Error completing payment:', error);
    res.status(500).json({ message: 'Error completing payment', error: error.message });
  }
};
