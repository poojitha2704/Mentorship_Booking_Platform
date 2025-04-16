// frontend/src/components/NavigationBar.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function NavigationBar() {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/home">
          Mentorship Hub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            {userInfo ? (
              <>
                {userInfo.role === 'faculty' ? (
                  <>
                    <Nav.Link as={Link} to="/faculty-dashboard">Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/faculty-profile">Profile</Nav.Link>
                    <Nav.Link as={Link} to="/mybookings">My Bookings</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/student-dashboard">Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/student-profile">Profile</Nav.Link>
                    <Nav.Link as={Link} to="/mybookings">My Bookings</Nav.Link>
                  </>
                )}
                <Nav.Link as={Link} to="/chat-list">Chat List</Nav.Link>
                <Nav.Link onClick={logoutHandler}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
