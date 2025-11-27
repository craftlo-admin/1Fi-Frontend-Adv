import React, { useState } from 'react';
import './Features.css';

interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const Features: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const features: Feature[] = [
    {
      id: 1,
      icon: '📊',
      title: 'Automated Loan Origination',
      description: 'End-to-end digital loan processing from application to disbursement. Automated credit decisioning and document verification.',
      color: '#4F46E5'
    },
    {
      id: 2,
      icon: '📈',
      title: 'Real-time LTV Monitoring',
      description: 'Live collateral valuation tracking with automated shortfall alerts. Trigger margin calls when LTV breaches thresholds.',
      color: '#EC4899'
    },
    {
      id: 3,
      icon: '🔄',
      title: 'Portfolio Management',
      description: 'Comprehensive dashboard for active, closed, and new loans. Track repayments, write-offs, and securities with ease.',
      color: '#10B981'
    },
    {
      id: 4,
      icon: '⚡',
      title: 'Integration Ready',
      description: 'RESTful APIs for seamless integration with your core banking system. Pre-built connectors for popular platforms.',
      color: '#F59E0B'
    },
    {
      id: 5,
      icon: '🔒',
      title: 'Compliance & Security',
      description: 'SEBI compliant operations with complete audit trails. Bank-grade security with role-based access control.',
      color: '#8B5CF6'
    },
    {
      id: 6,
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Business intelligence dashboards with predictive analytics. Generate regulatory reports and performance metrics instantly.',
      color: '#06B6D4'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <div className="section-header">
          <span className="section-tag">Platform Capabilities</span>
          <h2 className="section-title">Enterprise-Grade Loan Management</h2>
          <p className="section-description">
            Powerful features designed for NBFCs and Banks to efficiently manage 
            loan against mutual funds operations at scale.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`feature-card ${activeFeature === feature.id ? 'active' : ''}`}
              onMouseEnter={() => setActiveFeature(feature.id)}
              onMouseLeave={() => setActiveFeature(null)}
              style={{ '--feature-color': feature.color } as React.CSSProperties}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-hover-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
