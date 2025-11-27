import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useTheme } from '../../context/ThemeContext';

interface DashboardData {
  newLoans: number;
  activeLoans: number;
  closedLoans: number;
  applicantsWithUnpaidShortfall: number;
  totalShortfallAmount: string;
  totalSanctionedAmount: string;
  totalRepayment: string;
  totalDisbursed: string;
  activeSecurities: number;
  totalWriteOff: string;
}

interface DashboardProps {
  onBack: () => void;
  onNavigateToApplications: () => void;
  onNavigateToCollateral: () => void;
  onNavigateToRepayment: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBack, onNavigateToApplications, onNavigateToCollateral, onNavigateToRepayment }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://onefi-backend-adv.onrender.com/api/dashboard');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatCompactCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '₹0';
    
    if (num >= 10000000) { // Crores
      return `₹${(num / 10000000).toFixed(2)}Cr`;
    } else if (num >= 100000) { // Lakhs
      return `₹${(num / 100000).toFixed(2)}L`;
    }
    return formatCurrency(num);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <div className="loader"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-error">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-btn">Retry</button>
          <button onClick={onBack} className="back-btn">Back to Home</button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-navbar">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">1Fi</span>
            <span className="logo-text">LAMF Dashboard</span>
          </div>
          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={onBack} className="back-home-btn">← Back to Home</button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-badge">
                <span className="badge-icon">📊</span>
                <span>Real-time Analytics</span>
              </div>
              <h1>Loan Portfolio Overview</h1>
              <p className="header-description">
                Comprehensive view of your loan management system with live metrics and insights
              </p>
            </div>
            <div className="header-right">
              <div className="stats-preview">
                <div className="preview-item">
                  <span className="preview-label">Total Loans</span>
                  <span className="preview-value">
                    {data ? (data.newLoans + data.activeLoans + data.closedLoans) : '---'}
                  </span>
                </div>
                <div className="preview-divider"></div>
                <div className="preview-item">
                  <span className="preview-label">Active Portfolio</span>
                  <span className="preview-value">{data?.activeLoans || '---'}</span>
                </div>
              </div>
              <div className="last-updated">
                <span className="update-icon">🕐</span>
                <span>Last updated: {new Date().toLocaleString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'short'
                })}</span>
              </div>
            </div>
          </div>
          <div className="header-actions-row">
            <button className="quick-action-btn" onClick={onNavigateToApplications}>
              📋 Applications
            </button>
            <button className="quick-action-btn" onClick={onNavigateToCollateral}>
              🔐 Collateral
            </button>
            <button className="quick-action-btn" onClick={onNavigateToRepayment}>
              💰 Repayment
            </button>
          </div>
        </div>

        {/* Loan Status Cards */}
        <div className="metrics-grid">
          <div className="metric-card status-card">
            <div className="metric-icon new">📋</div>
            <div className="metric-content">
              <h3>{data.newLoans}</h3>
              <p>New Loans</p>
              <span className="metric-label">Recently Created</span>
            </div>
          </div>

          <div className="metric-card status-card">
            <div className="metric-icon active">✅</div>
            <div className="metric-content">
              <h3>{data.activeLoans}</h3>
              <p>Active Loans</p>
              <span className="metric-label">Currently Running</span>
            </div>
          </div>

          <div className="metric-card status-card">
            <div className="metric-icon closed">🎯</div>
            <div className="metric-content">
              <h3>{data.closedLoans}</h3>
              <p>Closed Loans</p>
              <span className="metric-label">Fully Repaid</span>
            </div>
          </div>

          <div className="metric-card status-card">
            <div className="metric-icon securities">🔒</div>
            <div className="metric-content">
              <h3>{data.activeSecurities}</h3>
              <p>Active Securities</p>
              <span className="metric-label">Pledged Collaterals</span>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="financial-section">
          <h2 className="section-title">Financial Overview</h2>
          <div className="financial-grid">
            <div className="metric-card financial-card highlight">
              <div className="card-header">
                <span className="card-icon">💰</span>
                <span className="card-badge">Total Sanctioned</span>
              </div>
              <h2 className="amount-large">{formatCompactCurrency(data.totalSanctionedAmount)}</h2>
              <p className="card-description">Total approved loan amount</p>
              <div className="card-footer">
                <span className="detail-label">Full Amount:</span>
                <span className="detail-value">{formatCurrency(data.totalSanctionedAmount)}</span>
              </div>
            </div>

            <div className="metric-card financial-card">
              <div className="card-header">
                <span className="card-icon">📤</span>
                <span className="card-badge">Disbursed</span>
              </div>
              <h2 className="amount-large">{formatCompactCurrency(data.totalDisbursed)}</h2>
              <p className="card-description">Money transferred to customers</p>
              <div className="card-footer">
                <span className="detail-label">Full Amount:</span>
                <span className="detail-value">{formatCurrency(data.totalDisbursed)}</span>
              </div>
            </div>

            <div className="metric-card financial-card success">
              <div className="card-header">
                <span className="card-icon">📥</span>
                <span className="card-badge">Repayments</span>
              </div>
              <h2 className="amount-large">{formatCompactCurrency(data.totalRepayment)}</h2>
              <p className="card-description">Total money collected</p>
              <div className="card-footer">
                <span className="detail-label">Full Amount:</span>
                <span className="detail-value">{formatCurrency(data.totalRepayment)}</span>
              </div>
            </div>

            <div className="metric-card financial-card danger">
              <div className="card-header">
                <span className="card-icon">📉</span>
                <span className="card-badge">Write-offs</span>
              </div>
              <h2 className="amount-large">{formatCompactCurrency(data.totalWriteOff)}</h2>
              <p className="card-description">Losses due to defaults</p>
              <div className="card-footer">
                <span className="detail-label">Full Amount:</span>
                <span className="detail-value">{formatCurrency(data.totalWriteOff)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Alerts */}
        {(data.applicantsWithUnpaidShortfall > 0 || parseFloat(data.totalShortfallAmount) > 0) && (
          <div className="risk-section">
            <h2 className="section-title">Risk Alerts</h2>
            <div className="alert-grid">
              <div className="alert-card warning">
                <div className="alert-header">
                  <span className="alert-icon">⚠️</span>
                  <h3>LTV Shortfall Alert</h3>
                </div>
                <div className="alert-content">
                  <div className="alert-stat">
                    <span className="stat-label">Affected Applicants</span>
                    <span className="stat-value">{data.applicantsWithUnpaidShortfall}</span>
                  </div>
                  <div className="alert-stat">
                    <span className="stat-label">Total Shortfall Amount</span>
                    <span className="stat-value danger-text">{formatCurrency(data.totalShortfallAmount)}</span>
                  </div>
                  <p className="alert-description">
                    Customers with unresolved shortfalls due to collateral value drops. Immediate attention required.
                  </p>
                </div>
                <button className="alert-action">View Details →</button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="summary-section">
          <div className="summary-card">
            <h3>Portfolio Health</h3>
            <div className="health-metrics">
              <div className="health-item">
                <span className="health-label">Active Loans</span>
                <div className="health-bar">
                  <div 
                    className="health-fill active" 
                    style={{ width: `${(data.activeLoans / (data.newLoans + data.activeLoans + data.closedLoans)) * 100}%` }}
                  ></div>
                </div>
                <span className="health-percent">
                  {Math.round((data.activeLoans / (data.newLoans + data.activeLoans + data.closedLoans)) * 100)}%
                </span>
              </div>
              <div className="health-item">
                <span className="health-label">Repayment Rate</span>
                <div className="health-bar">
                  <div 
                    className="health-fill success" 
                    style={{ width: `${Math.min((parseFloat(data.totalRepayment) / parseFloat(data.totalDisbursed)) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="health-percent">
                  {Math.min(Math.round((parseFloat(data.totalRepayment) / parseFloat(data.totalDisbursed)) * 100), 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
