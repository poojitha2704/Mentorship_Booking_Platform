// backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createPaymentIntent, completePayment } = require('../controllers/paymentController');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/complete-payment', protect, completePayment);

module.exports = router;
