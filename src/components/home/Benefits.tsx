import React, { useState } from 'react';
import './Benefits.css';

interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const Benefits: React.FC = () => {
  const [expandedBenefit, setExpandedBenefit] = useState<number | null>(null);

  const benefits: Benefit[] = [
    {
      id: 1,
      title: 'Reduce Operational Costs by 60%',
      description: 'Automate manual processes and reduce staffing needs. Our platform handles everything from loan origination to closure with minimal human intervention.',
      icon: '💰'
    },
    {
      id: 2,
      title: 'Scale Without Infrastructure',
      description: 'Handle 10x loan volume without adding headcount. Cloud-based architecture scales automatically with your business growth.',
      icon: '🚀'
    },
    {
      id: 3,
      title: 'Minimize Credit Risk',
      description: 'Real-time LTV monitoring with automated margin calls. Reduce NPAs with proactive risk management and collateral tracking.',
      icon: '🛡️'
    },
    {
      id: 4,
      title: 'Instant Regulatory Compliance',
      description: 'Built-in compliance with RBI and SEBI guidelines. Generate audit reports and regulatory filings automatically with complete trail.',
      icon: '✅'
    },
    {
      id: 5,
      title: 'Faster Time to Market',
      description: 'Launch LAMF products in weeks, not months. Pre-built workflows and integrations reduce development time by 80%.',
      icon: '⚡'
    },
    {
      id: 6,
      title: 'Revenue Growth Opportunities',
      description: 'Tap into the ₹5 lakh crore mutual fund market. Cross-sell to existing customers and acquire new segments with low-risk products.',
      icon: '📈'
    }
  ];

  const toggleBenefit = (id: number) => {
    setExpandedBenefit(expandedBenefit === id ? null : id);
  };

  return (
    <section id="benefits" className="benefits-section">
      <div className="benefits-container">
        <div className="section-header">
          <span className="section-tag">Value Proposition</span>
          <h2 className="section-title">Why Leading Institutions Choose 1Fi</h2>
          <p className="section-description">
            Transform your LAMF operations with enterprise-grade automation and intelligence
          </p>
        </div>

        <div className="benefits-content">
          <div className="benefits-list">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className={`benefit-item ${expandedBenefit === benefit.id ? 'expanded' : ''}`}
                onClick={() => toggleBenefit(benefit.id)}
              >
                <div className="benefit-header">
                  <div className="benefit-icon">{benefit.icon}</div>
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <div className="expand-icon">
                    {expandedBenefit === benefit.id ? '−' : '+'}
                  </div>
                </div>
                <div className="benefit-description">
                  <p>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="comparison-card">
            <h3>Platform Comparison</h3>
            <div className="comparison-table">
              <div className="comparison-row header">
                <div className="comparison-cell">Capability</div>
                <div className="comparison-cell">1Fi LAMF</div>
                <div className="comparison-cell">Legacy Systems</div>
              </div>
              <div className="comparison-row">
                <div className="comparison-cell">Loan Processing Time</div>
                <div className="comparison-cell highlight">2-4 Hours</div>
                <div className="comparison-cell">2-3 Days</div>
              </div>
              <div className="comparison-row">
                <div className="comparison-cell">LTV Monitoring</div>
                <div className="comparison-cell highlight">Real-time</div>
                <div className="comparison-cell">Weekly/Manual</div>
              </div>
              <div className="comparison-row">
                <div className="comparison-cell">Integration</div>
                <div className="comparison-cell highlight">API Ready</div>
                <div className="comparison-cell">Custom Dev</div>
              </div>
              <div className="comparison-row">
                <div className="comparison-cell">Reporting</div>
                <div className="comparison-cell highlight">Instant</div>
                <div className="comparison-cell">Manual/Delayed</div>
              </div>
              <div className="comparison-row">
                <div className="comparison-cell">Implementation</div>
                <div className="comparison-cell highlight">2-3 Weeks</div>
                <div className="comparison-cell">3-6 Months</div>
              </div>
            </div>
          </div>
        </div>

        <div className="testimonials">
          <h3>Trusted by Leading Financial Institutions</h3>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p>"Reduced our loan processing time from 3 days to 4 hours. The automation has helped us scale LAMF business 5x in 6 months."</p>
              <div className="testimonial-author">
                <strong>Suresh Menon</strong>
                <span>COO, Leading NBFC</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p>"Real-time LTV monitoring saved us from potential NPAs. The analytics dashboard gives complete visibility of our portfolio."</p>
              <div className="testimonial-author">
                <strong>Dr. Anita Desai</strong>
                <span>CRO, Private Sector Bank</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p>"Seamless integration with our CBS. Implementation was completed in 2 weeks with excellent support from 1Fi team."</p>
              <div className="testimonial-author">
                <strong>Vikram Singh</strong>
                <span>CTO, Digital Lending Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
