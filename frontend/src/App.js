import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import FacultyDashboard from './components/dashboard/FacultyDashboard';
import FacultyProfile from './components/dashboard/FacultyProfile';
import StudentDashboard from './components/dashboard/StudentDashboard';
import StudentProfile from './components/dashboard/StudentProfile';
import Booking from './components/Booking'; // Updated route
import BookingList from './components/BookingList';
import Payment from './components/Payment';
import ChatList from './components/ChatList';
import ChatRoom from './components/ChatRoom';
import NavigationBar from './components/NavigationBar';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/faculty-dashboard" element={<PrivateRoute><FacultyDashboard /></PrivateRoute>} />
        <Route path="/faculty-profile" element={<PrivateRoute><FacultyProfile /></PrivateRoute>} />
        <Route path="/student-dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
        <Route path="/student-profile" element={<PrivateRoute><StudentProfile /></PrivateRoute>} />
        <Route path="/mybookings" element={<PrivateRoute><BookingList /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
        <Route path="/chat-list" element={<PrivateRoute><ChatList /></PrivateRoute>} />
        <Route path="/chat-room" element={<PrivateRoute><ChatRoom /></PrivateRoute>} />
        <Route path="/booking" element={<PrivateRoute><Booking /></PrivateRoute>} /> {/* Added /booking route */}
      </Routes>
    </Router>
  );
}

export default App;
