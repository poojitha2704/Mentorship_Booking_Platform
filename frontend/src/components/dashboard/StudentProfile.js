import React from 'react';

function StudentProfile() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return (
    <div className="container mt-5 bg-light p-4 rounded shadow-sm">
      <h2 className="text-center text-primary">Student Profile</h2>
      <p>
        <strong>Name:</strong> {userInfo.name}
      </p>
      <p>
        <strong>Email:</strong> {userInfo.email}
      </p>
    </div>
  );
}

export default StudentProfile;
