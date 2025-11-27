import React, { useState, useEffect } from 'react';
import './Hero.css';
import { useTheme } from '../../context/ThemeContext';

interface HeroProps {
  onGetStarted?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="hero">
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">1Fi</span>
            <span className="logo-text">LAMF</span>
          </div>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#calculator">Calculator</a></li>
            <li><a href="#benefits">Benefits</a></li>
          </ul>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button className="cta-button">Contact Sales</button>
        </div>
      </nav>

      <div className="hero-content">
        <div className="hero-left">
          <h1 className="hero-title">
            Enterprise Loan Management for
            <span className="gradient-text"> Mutual Fund Lending</span>
          </h1>
          <p className="hero-subtitle">
            Comprehensive LAMF solution for NBFCs and Banks. Automate loan origination, 
            collateral tracking, LTV monitoring, and portfolio management with real-time analytics.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <h3>₹5000Cr+</h3>
              <p>AUM Managed</p>
            </div>
            <div className="stat-item">
              <h3>50+ Banks</h3>
              <p>& NBFCs Trust Us</p>
            </div>
            <div className="stat-item">
              <h3>99.8%</h3>
              <p>System Uptime</p>
            </div>
          </div>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={onGetStarted}>
              View Dashboard
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="secondary-btn">
              Request Demo
            </button>
          </div>
        </div>
        <div className="hero-right">
          <div className="floating-card card-1">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h4>Real-time Analytics</h4>
              <p>Portfolio Insights</p>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">⚡</div>
            <div className="card-content">
              <h4>Automated LTV</h4>
              <p>Risk Monitoring</p>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🔒</div>
            <div className="card-content">
              <h4>Enterprise Grade</h4>
              <p>SEBI Compliant</p>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="circle-bg circle-1"></div>
            <div className="circle-bg circle-2"></div>
            <div className="circle-bg circle-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
