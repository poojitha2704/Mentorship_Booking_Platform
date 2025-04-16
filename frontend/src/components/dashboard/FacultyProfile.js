import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FacultyProfile() {
  const [profile, setProfile] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/faculty/profile', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };
    fetchProfile();
  }, [userInfo.token]);

  return (
    <div className="container mt-5 bg-light p-4 rounded shadow-sm">
      <h2 className="text-center text-primary">Faculty Profile</h2>
      {profile ? (
        <div>
          <p>
            <strong>Name:</strong> {profile.user.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.user.email}
          </p>
          <p>
            <strong>Skills:</strong> {profile.skills.join(', ')}
          </p>
          <p>
            <strong>Subjects:</strong> {profile.subjects.join(', ')}
          </p>
          <p>
            <strong>Hourly Cost:</strong> ${profile.hourlyCost}
          </p>
          <p>
            <strong>Counseling:</strong> {profile.counseling ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Availability:</strong> {profile.availability.join(', ')}
          </p>
        </div>
      ) : (
        <p className="text-center text-danger">No profile found. Please create one in the dashboard.</p>
      )}
    </div>
  );
}

export default FacultyProfile;
