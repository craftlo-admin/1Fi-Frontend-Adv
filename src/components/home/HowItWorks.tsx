import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HowItWorks.css';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
  time: string;
}

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps: Step[] = [
    {
      id: 1,
      title: 'Discovery & Requirements',
      description: 'Schedule a demo with our team. We understand your business needs, loan volumes, and integration requirements.',
      icon: '📝',
      time: '1-2 days'
    },
    {
      id: 2,
      title: 'System Configuration',
      description: 'Set up your organization profile, configure loan policies, LTV thresholds, and user roles with our onboarding team.',
      icon: '⚙️',
      time: '3-5 days'
    },
    {
      id: 3,
      title: 'Integration & Testing',
      description: 'Connect with your core banking system via APIs. Conduct UAT and test all workflows in sandbox environment.',
      icon: '🔧',
      time: '1-2 weeks'
    },
    {
      id: 4,
      title: 'Go Live & Support',
      description: 'Launch in production with our support. Dedicated account manager and 24/7 technical support for your team.',
      icon: '🚀',
      time: '1 day'
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="how-it-works-container">
        <div className="section-header">
          <span className="section-tag">Implementation</span>
          <h2 className="section-title">Quick Onboarding Process</h2>
          <p className="section-description">
            Get your LAMF system up and running in 2-3 weeks with our structured implementation approach.
          </p>
        </div>

        <div className="steps-container">
          <div className="steps-timeline">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className={`step-item ${activeStep === step.id ? 'active' : ''} ${activeStep > step.id ? 'completed' : ''}`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className="step-number">{step.id}</div>
                  <div className="step-content">
                    <div className="step-icon">{step.icon}</div>
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                    <span className="step-time">⏱️ {step.time}</span>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`step-connector ${activeStep > step.id ? 'completed' : ''}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="process-visual">
            <div className="visual-container">
              <div className={`visual-step step-${activeStep}`}>
                <div className="visual-icon">{steps[activeStep - 1].icon}</div>
                <h3>{steps[activeStep - 1].title}</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(activeStep / steps.length) * 100}%` }}></div>
                </div>
                <p className="progress-text">Step {activeStep} of {steps.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-container">
          <button className="start-button" onClick={() => navigate('/dashboard')}>Go To Dashboard</button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
