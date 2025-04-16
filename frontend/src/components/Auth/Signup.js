// src/components/Auth/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // default
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
        role,
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      if (data.role === 'faculty') navigate('/faculty-dashboard');
      else navigate('/student-dashboard');
    } catch (error) {
      alert('Error signing up. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Signup</h2>
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>
        <button className="btn btn-primary" type="submit">
          Signup
        </button>
      </form>
      <p className="mt-3">
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default Signup;
