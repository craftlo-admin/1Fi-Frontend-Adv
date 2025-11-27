import React, { useState, useEffect } from 'react';
import './Collateral.css';
import { useTheme } from '../../context/ThemeContext';

interface Loan {
  loan_number: string;
  status: string;
  principal_sanctioned: number;
}

interface Customer {
  full_name: string;
  email: string;
  phone?: string;
}

interface LoanSecurityType {
  name: string;
  security_type: string;
  haircut_percent: number;
  max_ltv_ratio: number;
}

interface CollateralData {
  _id: string;
  loan_id: Loan;
  customer_id: Customer;
  loan_security_type_id: LoanSecurityType;
  security_identifier: string;
  ltv_at_pledge: number;
  amount_at_pledge: number;
  current_ltv: number;
  current_value: number;
  status: 'PLEDGED' | 'RELEASED' | 'INVOKED';
  createdAt: string;
}

interface CollateralPageProps {
  onBack: () => void;
}

type StatusFilter = 'ALL' | 'PLEDGED' | 'RELEASED' | 'INVOKED';

const Collateral: React.FC<CollateralPageProps> = ({ onBack }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [collaterals, setCollaterals] = useState<CollateralData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedCollateral, setSelectedCollateral] = useState<CollateralData | null>(null);
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    fetchCollaterals();
  }, []);

  useEffect(() => {
    if (statusFilter === 'ALL') {
      fetchCollaterals();
    } else {
      fetchCollateralsByStatus(statusFilter);
    }
  }, [statusFilter]);

  const fetchCollaterals = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/collaterals');
      const result = await response.json();
      if (result.success) {
        setCollaterals(result.data);
      }
    } catch (error) {
      console.error('Error fetching collaterals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollateralsByStatus = async (status: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/collaterals/status/${status}`);
      const result = await response.json();
      if (result.success) {
        setCollaterals(result.data);
      }
    } catch (error) {
      console.error('Error fetching collaterals by status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCollateral = async (id: string, data: any) => {
    try {
      const response = await fetch(`http://localhost:5000/api/collaterals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        fetchCollaterals();
        setShowUpdateModal(false);
        setSelectedCollateral(null);
      }
    } catch (error) {
      console.error('Error updating collateral:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getLTVStatus = (ltv: number, maxLtv: number) => {
    const threshold = maxLtv || 50;
    if (ltv < threshold) return { status: 'safe', label: 'Safe', class: 'ltv-safe' };
    if (ltv >= threshold && ltv < threshold + 10) return { status: 'warning', label: 'Warning', class: 'ltv-warning' };
    return { status: 'breach', label: 'Breach', class: 'ltv-breach' };
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PLEDGED: { label: 'Pledged', class: 'status-pledged' },
      RELEASED: { label: 'Released', class: 'status-released' },
      INVOKED: { label: 'Invoked', class: 'status-invoked' }
    };
    const badge = badges[status as keyof typeof badges] || { label: status, class: '' };
    return <span className={`status-badge ${badge.class}`}>{badge.label}</span>;
  };

  const stats = {
    total: collaterals.length,
    pledged: collaterals.filter(c => c.status === 'PLEDGED').length,
    atRisk: collaterals.filter(c => c.status === 'PLEDGED' && c.current_ltv >= 60).length,
    totalValue: collaterals.reduce((sum, c) => sum + c.current_value, 0)
  };

  return (
    <div className="collateral-page">
      {/* Navbar */}
      <nav className="collateral-navbar">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">1Fi</span>
            <span className="logo-text">Collateral Management</span>
          </div>
          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={onBack} className="back-home-btn">← Back to Dashboard</button>
          </div>
        </div>
      </nav>

      <div className="collateral-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-left">
            <h1>Collateral Management</h1>
            <p>Monitor and manage pledged securities with real-time LTV tracking</p>
          </div>
          <div className="header-actions">
            <button className="primary-action-btn" onClick={() => setShowPledgeModal(true)}>
              + Pledge Collateral
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🔒</div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Total Collaterals</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.pledged}</h3>
              <p>Active Pledges</p>
            </div>
          </div>
          <div className="stat-card alert">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3>{stats.atRisk}</h3>
              <p>High LTV Risk</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>{formatCurrency(stats.totalValue)}</h3>
              <p>Total Collateral Value</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              All ({collaterals.length})
            </button>
            <button 
              className={`filter-tab ${statusFilter === 'PLEDGED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('PLEDGED')}
            >
              🔒 Pledged
            </button>
            <button 
              className={`filter-tab ${statusFilter === 'RELEASED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('RELEASED')}
            >
              ✓ Released
            </button>
            <button 
              className={`filter-tab ${statusFilter === 'INVOKED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('INVOKED')}
            >
              ⚡ Invoked
            </button>
          </div>
        </div>

        {/* Collaterals Table */}
        <div className="data-table-container">
          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading collaterals...</p>
            </div>
          ) : collaterals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔐</div>
              <h3>No Collaterals Found</h3>
              <p>Pledge securities to secure loans</p>
              <button className="primary-action-btn" onClick={() => setShowPledgeModal(true)}>
                + Pledge Collateral
              </button>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Loan No.</th>
                  <th>Customer</th>
                  <th>Security Type</th>
                  <th>Identifier</th>
                  <th>Pledged Value</th>
                  <th>Current Value</th>
                  <th>LTV</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collaterals.map((collateral) => {
                  const ltvStatus = getLTVStatus(collateral.current_ltv, collateral.loan_security_type_id?.max_ltv_ratio || 50);
                  return (
                    <tr key={collateral._id}>
                      <td>
                        <strong>{collateral.loan_id?.loan_number || 'N/A'}</strong>
                      </td>
                      <td>
                        <div className="customer-cell">
                          <strong>{collateral.customer_id?.full_name || 'N/A'}</strong>
                          <span className="customer-email">{collateral.customer_id?.email || ''}</span>
                        </div>
                      </td>
                      <td>
                        <div className="security-cell">
                          <strong>{collateral.loan_security_type_id?.name || 'N/A'}</strong>
                          <span className="security-details">
                            Haircut: {collateral.loan_security_type_id?.haircut_percent || 0}% | 
                            Max LTV: {collateral.loan_security_type_id?.max_ltv_ratio || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="identifier-cell">{collateral.security_identifier}</td>
                      <td className="amount-cell">{formatCurrency(collateral.amount_at_pledge)}</td>
                      <td className="amount-cell">
                        <div className="value-change">
                          {formatCurrency(collateral.current_value)}
                          {collateral.current_value !== collateral.amount_at_pledge && (
                            <span className={collateral.current_value > collateral.amount_at_pledge ? 'positive' : 'negative'}>
                              {collateral.current_value > collateral.amount_at_pledge ? '↑' : '↓'}
                              {Math.abs(((collateral.current_value - collateral.amount_at_pledge) / collateral.amount_at_pledge) * 100).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="ltv-cell">
                          <span className={`ltv-badge ${ltvStatus.class}`}>
                            {collateral.current_ltv.toFixed(1)}%
                          </span>
                          <span className="ltv-status">{ltvStatus.label}</span>
                        </div>
                      </td>
                      <td>{getStatusBadge(collateral.status)}</td>
                      <td>
                        <div className="action-buttons-cell">
                          <button 
                            className="action-btn view-btn"
                            onClick={() => setSelectedCollateral(collateral)}
                          >
                            View
                          </button>
                          {collateral.status === 'PLEDGED' && (
                            <button 
                              className="action-btn update-btn"
                              onClick={() => {
                                setSelectedCollateral(collateral);
                                setShowUpdateModal(true);
                              }}
                            >
                              Update
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Collateral Details Modal */}
      {selectedCollateral && !showUpdateModal && (
        <CollateralDetailsModal
          collateral={selectedCollateral}
          onClose={() => setSelectedCollateral(null)}
          onUpdate={(data) => updateCollateral(selectedCollateral._id, data)}
        />
      )}

      {/* Update Collateral Modal */}
      {showUpdateModal && selectedCollateral && (
        <UpdateCollateralModal
          collateral={selectedCollateral}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedCollateral(null);
          }}
          onUpdate={(data) => updateCollateral(selectedCollateral._id, data)}
        />
      )}

      {/* Pledge Collateral Modal */}
      {showPledgeModal && (
        <PledgeCollateralModal
          onClose={() => setShowPledgeModal(false)}
          onSuccess={() => {
            setShowPledgeModal(false);
            fetchCollaterals();
          }}
        />
      )}
    </div>
  );
};

// Collateral Details Modal
const CollateralDetailsModal: React.FC<{
  collateral: CollateralData;
  onClose: () => void;
  onUpdate: (data: any) => void;
}> = ({ collateral, onClose, onUpdate }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  const ltvStatus = collateral.current_ltv < 50 ? 'Safe' : 
                    collateral.current_ltv < 60 ? 'Warning' : 'Breach';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Collateral Details</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-section">
              <h3>Loan Information</h3>
              <div className="detail-row">
                <span className="label">Loan Number:</span>
                <span className="value">{collateral.loan_id?.loan_number || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Loan Status:</span>
                <span className="value">
                  <span className={`status-badge status-${collateral.loan_id?.status?.toLowerCase() || 'unknown'}`}>
                    {collateral.loan_id?.status || 'N/A'}
                  </span>
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Principal Sanctioned:</span>
                <span className="value amount">{formatCurrency(collateral.loan_id?.principal_sanctioned || 0)}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Customer Information</h3>
              <div className="detail-row">
                <span className="label">Name:</span>
                <span className="value">{collateral.customer_id?.full_name || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{collateral.customer_id?.email || 'N/A'}</span>
              </div>
              {collateral.customer_id?.phone && (
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span className="value">{collateral.customer_id.phone}</span>
                </div>
              )}
            </div>

            <div className="detail-section">
              <h3>Security Details</h3>
              <div className="detail-row">
                <span className="label">Security Type:</span>
                <span className="value">{collateral.loan_security_type_id?.name || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Security Identifier:</span>
                <span className="value identifier">{collateral.security_identifier}</span>
              </div>
              <div className="detail-row">
                <span className="label">Haircut Percentage:</span>
                <span className="value">{collateral.loan_security_type_id?.haircut_percent || 0}%</span>
              </div>
              <div className="detail-row">
                <span className="label">Max LTV Ratio:</span>
                <span className="value">{collateral.loan_security_type_id?.max_ltv_ratio || 0}%</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Valuation at Pledge</h3>
              <div className="detail-row">
                <span className="label">Pledged Value:</span>
                <span className="value amount">{formatCurrency(collateral.amount_at_pledge)}</span>
              </div>
              <div className="detail-row">
                <span className="label">LTV at Pledge:</span>
                <span className="value">{collateral.ltv_at_pledge.toFixed(2)}%</span>
              </div>
              <div className="detail-row">
                <span className="label">Pledged On:</span>
                <span className="value">{new Date(collateral.createdAt).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="detail-section highlight">
              <h3>Current Valuation</h3>
              <div className="detail-row">
                <span className="label">Current Value:</span>
                <span className="value amount highlight-value">{formatCurrency(collateral.current_value)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Value Change:</span>
                <span className={`value ${collateral.current_value >= collateral.amount_at_pledge ? 'positive' : 'negative'}`}>
                  {collateral.current_value >= collateral.amount_at_pledge ? '+' : ''}
                  {formatCurrency(collateral.current_value - collateral.amount_at_pledge)} 
                  ({((collateral.current_value - collateral.amount_at_pledge) / collateral.amount_at_pledge * 100).toFixed(2)}%)
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Current LTV:</span>
                <span className="value">
                  <span className={`ltv-badge ltv-${ltvStatus.toLowerCase()}`}>
                    {collateral.current_ltv.toFixed(2)}%
                  </span>
                </span>
              </div>
              <div className="detail-row">
                <span className="label">LTV Status:</span>
                <span className={`value ${ltvStatus.toLowerCase()}-text`}>
                  {ltvStatus}
                </span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Status</h3>
              <div className="detail-row">
                <span className="label">Collateral Status:</span>
                <span className="value">
                  <span className={`status-badge status-${collateral.status.toLowerCase()}`}>
                    {collateral.status}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {collateral.status === 'PLEDGED' && (
            <div className="action-section">
              <h3>Actions</h3>
              <div className="action-buttons">
                {collateral.current_ltv >= 60 && (
                  <button className="alert-btn" onClick={() => alert('Create shortfall functionality coming soon')}>
                    ⚠️ Create Shortfall Record
                  </button>
                )}
                <button 
                  className="release-btn"
                  onClick={() => onUpdate({ status: 'RELEASED' })}
                >
                  ✓ Release Collateral
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Update Collateral Modal
const UpdateCollateralModal: React.FC<{
  collateral: CollateralData;
  onClose: () => void;
  onUpdate: (data: any) => void;
}> = ({ collateral, onClose, onUpdate }) => {
  const [currentValue, setCurrentValue] = useState(collateral.current_value);
  const [calculatedLTV, setCalculatedLTV] = useState(collateral.current_ltv);

  useEffect(() => {
    // Recalculate LTV when value changes
    const principalSanctioned = collateral.loan_id?.principal_sanctioned || 0;
    const newLTV = currentValue > 0 ? (principalSanctioned / currentValue) * 100 : 0;
    setCalculatedLTV(newLTV);
  }, [currentValue, collateral.loan_id?.principal_sanctioned]);

  const handleUpdate = () => {
    onUpdate({
      current_value: currentValue,
      current_ltv: calculatedLTV
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Update Collateral Value</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-section">
            <p className="info-text">
              Update the current market value of the collateral. LTV will be automatically recalculated.
            </p>
            
            <div className="form-group">
              <label>Current Market Value (₹)</label>
              <input
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(Number(e.target.value))}
                className="form-input"
                step="0.01"
              />
            </div>

            <div className="calculation-display">
              <div className="calc-row">
                <span className="calc-label">Principal Sanctioned:</span>
                <span className="calc-value">₹{(collateral.loan_id?.principal_sanctioned || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="calc-row">
                <span className="calc-label">New Market Value:</span>
                <span className="calc-value">₹{currentValue.toLocaleString('en-IN')}</span>
              </div>
              <div className="calc-row highlight">
                <span className="calc-label">Calculated LTV:</span>
                <span className={`calc-value ltv-badge ltv-${calculatedLTV < 50 ? 'safe' : calculatedLTV < 60 ? 'warning' : 'breach'}`}>
                  {calculatedLTV.toFixed(2)}%
                </span>
              </div>
            </div>

            {calculatedLTV >= 60 && (
              <div className="warning-message">
                ⚠️ LTV breach detected! This will trigger a shortfall record.
              </div>
            )}

            <div className="action-buttons">
              <button className="cancel-btn" onClick={onClose}>Cancel</button>
              <button className="confirm-btn" onClick={handleUpdate}>Update Value</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pledge Collateral Modal - Placeholder
const PledgeCollateralModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    loan_id: '',
    loan_security_type_id: '',
    security_identifier: '',
    ltv_at_pledge: '',
    amount_at_pledge: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setSubmitting(true);
      const amountAtPledge = Number(formData.amount_at_pledge);
      const ltvAtPledge = Number(formData.ltv_at_pledge);

      const response = await fetch('http://localhost:5000/api/collaterals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loan_id: formData.loan_id,
          loan_security_type_id: formData.loan_security_type_id,
          security_identifier: formData.security_identifier,
          amount_at_pledge: amountAtPledge,
          current_value: amountAtPledge,
          ltv_at_pledge: ltvAtPledge,
          current_ltv: ltvAtPledge,
          status: 'PLEDGED'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Collateral pledged successfully!');
        onSuccess();
      } else {
        setError(result.message || 'Failed to pledge collateral');
      }
    } catch (error) {
      console.error('Error pledging collateral:', error);
      setError('Error pledging collateral. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Pledge New Collateral</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="payment-form">
            {error && (
              <div className="error-message" style={{ 
                background: '#ffe6e6', 
                border: '1px solid #ff4444', 
                padding: '1rem', 
                borderRadius: '6px', 
                color: '#cc0000',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label>Loan ID *</label>
                <input
                  type="text"
                  name="loan_id"
                  value={formData.loan_id}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="MongoDB ObjectId"
                />
                <small style={{ color: '#666', fontSize: '0.75rem' }}>
                  Approved loan to pledge collateral against
                </small>
              </div>

              <div className="form-group">
                <label>Security Type *</label>
                <select
                  name="loan_security_type_id"
                  value={formData.loan_security_type_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, loan_security_type_id: e.target.value }))}
                  className="form-input"
                  required
                >
                  <option value="">Select a security type</option>
                  <option value="1">1 - Mutual Fund - Equity Large Cap</option>
                  <option value="2">2 - Mutual Fund - Equity Mid Cap</option>
                  <option value="3">3 - Mutual Fund - Equity Small Cap</option>
                  <option value="4">4 - Mutual Fund - Debt/Liquid</option>
                  <option value="5">5 - Mutual Fund - Hybrid</option>
                </select>
                <small style={{ color: '#666', fontSize: '0.75rem' }}>
                  Defines haircut & max LTV for the collateral
                </small>
              </div>

              <div className="form-group">
                <label>Security Identifier *</label>
                <input
                  type="text"
                  name="security_identifier"
                  value={formData.security_identifier}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="INF234K01LQ5"
                />
                <small style={{ color: '#666', fontSize: '0.75rem' }}>
                  Mutual Fund ISIN code
                </small>
              </div>

              <div className="form-group">
                <label>Amount at Pledge (₹) *</label>
                <input
                  type="number"
                  name="amount_at_pledge"
                  value={formData.amount_at_pledge}
                  onChange={handleChange}
                  className="form-input"
                  required
                  step="0.01"
                  min="0"
                  placeholder="1000000"
                />
                <small style={{ color: '#666', fontSize: '0.75rem' }}>
                  Total market value of the securities
                </small>
              </div>

              <div className="form-group">
                <label>LTV at Pledge (%) *</label>
                <input
                  type="number"
                  name="ltv_at_pledge"
                  value={formData.ltv_at_pledge}
                  onChange={handleChange}
                  className="form-input"
                  required
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="50"
                />
                <small style={{ color: '#666', fontSize: '0.75rem' }}>
                  (Loan Amount / Collateral Value) × 100
                </small>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="confirm-btn" disabled={submitting}>
                {submitting ? 'Pledging...' : 'Pledge Collateral'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Collateral;
