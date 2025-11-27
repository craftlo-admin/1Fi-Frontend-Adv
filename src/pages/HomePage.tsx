import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import Calculator from '../components/home/Calculator';
import Benefits from '../components/home/Benefits';
import Footer from '../components/shared/Footer';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
    window.scrollTo(0, 0);
  };

  return (
    <div className="App">
      <Hero onGetStarted={handleGetStarted} />
      <Features />
      <HowItWorks />
      <Calculator />
      <Benefits />
      <Footer />
    </div>
  );
};

export default HomePage;
