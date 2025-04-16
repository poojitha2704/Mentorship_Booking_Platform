// src/components/Booking.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { faculty } = location.state || {};
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [sessionDate, setSessionDate] = useState('');
  const [duration, setDuration] = useState(1);

  if (!faculty) {
    return <p>No faculty selected. Please go back and select a faculty.</p>;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/booking',
        {
          facultyId: faculty.user._id,
          sessionDate,
          duration,
          counseling: faculty.counseling,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      alert('Booking successful! You can now pay or chat from My Bookings.');
      navigate('/mybookings');
    } catch (error) {
      alert('Error booking session');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Book Session with {faculty.user.name}</h2>
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label>Session Date & Time</label>
          <input
            type="datetime-local"
            className="form-control"
            required
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Duration (hours)</label>
          <input
            type="number"
            className="form-control"
            required
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Book Session
        </button>
      </form>
    </div>
  );
}

export default Booking;
