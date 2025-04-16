import React, { useState } from 'react';
import axios from 'axios';

function FacultyDashboard() {
  const [profile, setProfile] = useState({
    skills: '',
    subjects: '',
    bio: '',
    hourlyCost: '',
    counseling: false,
    availability: '',
  });
  const [message, setMessage] = useState('');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/faculty/profile',
        {
          skills: profile.skills.split(',').map((s) => s.trim()),
          subjects: profile.subjects.split(',').map((s) => s.trim()),
          bio: profile.bio,
          hourlyCost: Number(profile.hourlyCost),
          counseling: profile.counseling,
          availability: profile.availability.split(',').map((s) => s.trim()),
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setMessage('Profile saved successfully!');
    } catch (error) {
      setMessage('Error saving profile.');
    }
  };

  return (
    <div className="container mt-5 bg-light p-4 rounded shadow-sm">
      <h2 className="text-center text-primary">Faculty Dashboard</h2>
      {message && <p className="text-center text-success">{message}</p>}
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label className="form-label">Skills (comma separated)</label>
          <input
            type="text"
            className="form-control"
            value={profile.skills}
            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Subjects (comma separated)</label>
          <input
            type="text"
            className="form-control"
            value={profile.subjects}
            onChange={(e) =>
              setProfile({ ...profile, subjects: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Bio</label>
          <textarea
            className="form-control"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Hourly Cost</label>
          <input
            type="number"
            className="form-control"
            value={profile.hourlyCost}
            onChange={(e) =>
              setProfile({ ...profile, hourlyCost: e.target.value })
            }
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={profile.counseling}
            onChange={(e) =>
              setProfile({ ...profile, counseling: e.target.checked })
            }
          />
          <label className="form-check-label">
            Offers Counseling Sessions
          </label>
        </div>
        <div className="mb-3">
          <label className="form-label">Availability (comma separated)</label>
          <input
            type="text"
            className="form-control"
            value={profile.availability}
            onChange={(e) =>
              setProfile({ ...profile, availability: e.target.value })
            }
          />
        </div>
        <div className="text-center">
          <button className="btn btn-primary w-50" type="submit">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default FacultyDashboard;
