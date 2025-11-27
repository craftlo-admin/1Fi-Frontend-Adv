import React, { useState, useEffect } from 'react';
import './Calculator.css';

const Calculator: React.FC = () => {
  const [portfolioValue, setPortfolioValue] = useState<number>(1000000);
  const [loanPercentage, setLoanPercentage] = useState<number>(40);
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [tenure, setTenure] = useState<number>(12);
  
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [monthlyEmi, setMonthlyEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  useEffect(() => {
    calculateLoan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioValue, loanPercentage, interestRate, tenure]);

  const calculateLoan = () => {
    const loan = (portfolioValue * loanPercentage) / 100;
    setLoanAmount(loan);

    const monthlyRate = interestRate / 12 / 100;
    const emi = loan * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
    setMonthlyEmi(emi);

    const total = emi * tenure;
    setTotalPayment(total);
    setTotalInterest(total - loan);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <section id="calculator" className="calculator-section">
      <div className="calculator-container">
        <div className="section-header">
          <span className="section-tag">ROI Calculator</span>
          <h2 className="section-title">Business Impact Estimator</h2>
          <p className="section-description">
            Calculate potential loan volume, revenue, and operational efficiency gains for your institution
          </p>
        </div>

        <div className="calculator-content">
          <div className="calculator-inputs">
            <div className="input-group">
              <label className="input-label">
                <span>Mutual Fund Portfolio Value</span>
                <span className="input-value">{formatCurrency(portfolioValue)}</span>
              </label>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(Number(e.target.value))}
                className="range-slider"
              />
              <div className="range-labels">
                <span>₹1L</span>
                <span>₹1Cr</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Loan to Value Ratio</span>
                <span className="input-value">{loanPercentage}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={loanPercentage}
                onChange={(e) => setLoanPercentage(Number(e.target.value))}
                className="range-slider"
              />
              <div className="range-labels">
                <span>10%</span>
                <span>50%</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Interest Rate (p.a.)</span>
                <span className="input-value">{interestRate}%</span>
              </label>
              <input
                type="range"
                min="9.5"
                max="15"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="range-slider"
              />
              <div className="range-labels">
                <span>9.5%</span>
                <span>15%</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Loan Tenure (Months)</span>
                <span className="input-value">{tenure} months</span>
              </label>
              <input
                type="range"
                min="6"
                max="36"
                step="6"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="range-slider"
              />
              <div className="range-labels">
                <span>6M</span>
                <span>36M</span>
              </div>
            </div>
          </div>

          <div className="calculator-results">
            <div className="result-card primary-result">
              <h3>Loan Amount</h3>
              <div className="result-amount">{formatCurrency(loanAmount)}</div>
              <p className="result-note">{loanPercentage}% of portfolio value</p>
            </div>

            <div className="result-card">
              <h3>Monthly EMI</h3>
              <div className="result-amount secondary">{formatCurrency(monthlyEmi)}</div>
              <p className="result-note">For {tenure} months</p>
            </div>

            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Total Interest</span>
                <span className="result-value">{formatCurrency(totalInterest)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Total Payment</span>
                <span className="result-value">{formatCurrency(totalPayment)}</span>
              </div>
            </div>

            <div className="payment-breakdown">
              <h4>Payment Breakdown</h4>
              <div className="breakdown-chart">
                <div className="chart-bar">
                  <div 
                    className="bar-principal" 
                    style={{ width: `${(loanAmount / totalPayment) * 100}%` }}
                  >
                    <span className="bar-label">Principal</span>
                  </div>
                  <div 
                    className="bar-interest" 
                    style={{ width: `${(totalInterest / totalPayment) * 100}%` }}
                  >
                    <span className="bar-label">Interest</span>
                  </div>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color principal"></span>
                  <span>Principal: {formatCurrency(loanAmount)}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color interest"></span>
                  <span>Interest: {formatCurrency(totalInterest)}</span>
                </div>
              </div>
            </div>

            <button className="apply-button">Apply for This Loan</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
