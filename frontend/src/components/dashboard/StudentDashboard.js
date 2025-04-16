import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const [facultyList, setFacultyList] = useState([]);
  const [search, setSearch] = useState('');
  const [counseling, setCounseling] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/faculty/all?subject=${search}&counseling=${counseling}`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setFacultyList(data);
      } catch (error) {
        console.error('Error fetching faculty', error);
      }
    };

    fetchFaculties();
  }, [search, counseling, userInfo.token]);

  return (
    <div className="container mt-5 bg-light p-4 rounded shadow-sm">
      <h2 className="text-center" style={{ color: '#0d6efd' }}>Find a Faculty Mentor</h2>
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate('/student-profile')}
        >
          My Profile
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/mybookings')}
        >
          My Bookings
        </button>
      </div>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by subject"
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          checked={counseling}
          onChange={(e) => setCounseling(e.target.checked)}
        />
        <label className="form-check-label" style={{ color: '#6c757d' }}>
          Offers Counseling Sessions
        </label>
      </div>
      <div className="row">
        {facultyList.map((faculty) => (
          <div key={faculty._id} className="col-md-4 mb-4">
            <div className="card border-light shadow-sm">
              <div className="card-body">
                <h5 className="card-title" style={{ color: '#0d6efd' }}>{faculty.user.name}</h5>
                <p className="card-text" style={{ color: '#6c757d' }}>
                  <strong>Subjects:</strong> {faculty.subjects.join(', ')}
                </p>
                <p className="card-text" style={{ color: '#6c757d' }}>
                  <strong>Hourly Cost:</strong> ${faculty.hourlyCost}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate('/booking', { state: { faculty } })
                  }
                >
                  Book Session
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentDashboard;
