// src/components/Payment.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51REXYNFKRyl8ajWS7HHJa0lW7Z6J4cdn6DEXZ5ee38TQAyvcq4rQkJG1tIuXjCmQqdarKDt2LfzJBa5wlBpJ1iDH00Swdgu7sL');

function CheckoutForm({ bookingId, amount, bookingStatus }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [clientSecret, setClientSecret] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (bookingStatus !== 'accepted') {
      setMessage('Booking is not accepted for payment.');
      return;
    }
    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post(
          'http://localhost:5000/api/payment/create-payment-intent',
          { bookingId },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating PaymentIntent', error);
        setMessage('Error initializing payment. Please try again.');
      }
    };
    createPaymentIntent();
  }, [bookingId, userInfo.token, bookingStatus]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setMessage(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        await axios.post(
          'http://localhost:5000/api/payment/complete-payment',
          { bookingId, paymentInfo: result.paymentIntent },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setMessage('Payment completed successfully!');
        setTimeout(() => {
          navigate('/chat', { state: { bookingId } });
        }, 2000);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit" className="btn btn-dark mt-3" disabled={!stripe || !clientSecret}>
        Pay ₹{amount}
      </button>
      {message && <p className="mt-3">{message}</p>}
    </form>
  );
}

function Payment() {
  const { bookingId, amount, bookingStatus } = useLocation().state || {};
  const paymentContainerStyle = {
    backgroundColor: "#ffffff",
    color: "#333333",
    padding: "2rem",
    borderRadius: "8px",
    marginTop: "2rem"
  };

  if (!bookingId) return <p>No booking information available</p>;

  return (
    <div className="container" style={paymentContainerStyle}>
      <h2>Payment</h2>
      <p>Amount to pay: ₹{amount}</p>
      <Elements stripe={stripePromise}>
        <CheckoutForm bookingId={bookingId} amount={amount} bookingStatus={bookingStatus} />
      </Elements>
    </div>
  );
}

export default Payment;
