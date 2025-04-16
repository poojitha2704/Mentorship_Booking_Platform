import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/booking/mybookings',
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings', error);
      }
    })();
  }, [userInfo.token]);

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/booking/${bookingId}/update-status`,
        { status },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      alert(`Booking ${status} successfully!`);
      const { data } = await axios.get(
        'http://localhost:5000/api/booking/mybookings',
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setBookings(data);
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="container mt-5">
      <h2 
        className="common-container text-center" 
        style={{ background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', color: 'white' }}
      >
        My Bookings
      </h2>

      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking._id} className="card mb-3">
            <div className="card-body">
              <p><strong>Session Date:</strong> {new Date(booking.sessionDate).toLocaleString()}</p>
              <p><strong>Duration:</strong> {booking.duration} hours</p>
              <p><strong>Cost:</strong> ₹{booking.cost}</p>
              <p><strong>Status:</strong> {booking.paymentStatus}</p>

              {/* Buttons Always Visible */}
              <div className="mt-3">
                {userInfo.role === 'faculty' && booking.paymentStatus === 'pending' && (
                  <>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => updateStatus(booking._id, 'accepted')}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => updateStatus(booking._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
                {userInfo.role === 'student' && (
                  <>
                    {booking.paymentStatus === 'accepted' && (
                      <button
                        className="btn btn-primary me-2"
                        onClick={() =>
                          navigate('/payment', {
                            state: {
                              bookingId: booking._id,
                              amount: booking.cost,
                              bookingStatus: booking.paymentStatus,
                            },
                          })
                        }
                      >
                        Pay
                      </button>
                    )}
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        navigate('/chat-room', {
                          state: {
                            conversation: { bookingId: booking._id },
                          },
                        })
                      }
                    >
                      Chat with Faculty
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p
          className="common-container text-center"
          style={{
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          No bookings found.
        </p>
      )}
    </div>
  );
}

export default BookingList;
