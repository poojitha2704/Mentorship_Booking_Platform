// src/components/Home.js
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-hero">
      <Container className="text-center">
        <h1 className="animate__animated animate__fadeInDown">
          Welcome to Mentorship Hub
        </h1>
        <p className="lead animate__animated animate__fadeInUp">
          Empowering professionals and students through personalized mentorship.
        </p>
        <Button
          variant="light"
          size="lg"
          className="mt-3 animate__animated animate__fadeIn"
          onClick={() => navigate('/login')}
        >
          Get Started
        </Button>
      </Container>
    </div>
  );
}

export default Home;
