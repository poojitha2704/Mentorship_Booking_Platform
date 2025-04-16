// src/components/PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  if (userInfo) {
    return userInfo.role === 'faculty' ? (
      <Navigate to="/faculty-dashboard" />
    ) : (
      <Navigate to="/student-dashboard" />
    );
  }
  return children;
};

export default PublicRoute;
