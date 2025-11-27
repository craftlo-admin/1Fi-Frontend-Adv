import React, { useState, useEffect } from 'react';
import './Repayment.css';
import { useTheme } from '../../context/ThemeContext';

interface LoanProduct {
  name: string;
  code: string;
}

interface Loan {
  loan_number: string;
  principal_sanctioned: number;
  principal_outstanding: number;
  status: string;
  loan_product_id: LoanProduct;
}

interface RepaymentData {
  _id: string;
  loan_id: Loan;
  payment_date: string;
  amount: number;
  principal_component: number;
  interest_component: number;
  penalty_component: number;
  payment_method: string;
  reference_number: string;
}

interface RepaymentSummary {
  totalAmount: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPenalty: number;
}

interface RepaymentPageProps {
  onBack: () => void;
}

const Repayment: React.FC<RepaymentPageProps> = ({ onBack }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [repayments, setRepayments] = useState<RepaymentData[]>([]);
  const [summary, setSummary] = useState<RepaymentSummary>({
    totalAmount: 0,
    totalPrincipal: 0,
    totalInterest: 0,
    totalPenalty: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedLoanId, setSelectedLoanId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'all' | 'customer' | 'loan'>('all');
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);

  const fetchAllRepayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://onefi-backend-adv.onrender.com/api/repayments');
      const result = await response.json();
      if (result.success) {
        setRepayments(result.data);
        calculateSummary(result.data);
      }
    } catch (error) {
      console.error('Error fetching repayments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRepayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCustomerRepayments = async (customerId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://onefi-backend-adv.onrender.com/api/repayments/customer/${customerId}`);
      const result = await response.json();
      if (result.success) {
        setRepayments(result.data);
        if (result.summary) {
          setSummary(result.summary);
        } else {
          calculateSummary(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching customer repayments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoanRepayments = async (loanId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://onefi-backend-adv.onrender.com/api/repayments/loan/${loanId}`);
      const result = await response.json();
      if (result.success) {
        setRepayments(result.data);
        calculateSummary(result.data);
      }
    } catch (error) {
      console.error('Error fetching loan repayments:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data: RepaymentData[]) => {
    const summary = data.reduce((acc, repayment) => ({
      totalAmount: acc.totalAmount + repayment.amount,
      totalPrincipal: acc.totalPrincipal + repayment.principal_component,
      totalInterest: acc.totalInterest + repayment.interest_component,
      totalPenalty: acc.totalPenalty + repayment.penalty_component
    }), {
      totalAmount: 0,
      totalPrincipal: 0,
      totalInterest: 0,
      totalPenalty: 0
    });
    setSummary(summary);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
  };

  const getPaymentMethodBadge = (method: string) => {
    const badges = {
      UPI: { class: 'method-upi', icon: '📱' },
      NEFT: { class: 'method-neft', icon: '🏦' },
      RTGS: { class: 'method-rtgs', icon: '💸' },
      IMPS: { class: 'method-imps', icon: '⚡' },
      CHEQUE: { class: 'method-cheque', icon: '📝' },
      CASH: { class: 'method-cash', icon: '💵' }
    };
    const badge = badges[method as keyof typeof badges] || { class: '', icon: '💳' };
    return (
      <span className={`payment-method-badge ${badge.class}`}>
        <span className="method-icon">{badge.icon}</span>
        <span className="method-text">{method}</span>
      </span>
    );
  };

  // Calculate outstanding for first repayment (if available)
  const currentOutstanding = repayments.length > 0 
    ? repayments[0].loan_id.principal_outstanding 
    : 0;

  const totalPayments = repayments.length;

  return (
    <div className="repayment-page">
      {/* Navbar */}
      <nav className="repayment-navbar">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">1Fi</span>
            <span className="logo-text">Repayment Management</span>
          </div>
          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={onBack} className="back-home-btn">← Back to Dashboard</button>
          </div>
        </div>
      </nav>

      <div className="repayment-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-left">
            <h1>Repayment Management</h1>
            <p>Track and manage loan repayments with detailed payment history</p>
          </div>
          <div className="header-actions">
            <button className="primary-action-btn" onClick={() => setShowRecordPaymentModal(true)}>
              + Record Payment
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card primary">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>{formatCurrency(summary.totalAmount)}</h3>
              <p>Total Paid</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>{formatCurrency(summary.totalPrincipal)}</h3>
              <p>Principal Paid</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon">📈</div>
            <div className="card-content">
              <h3>{formatCurrency(summary.totalInterest)}</h3>
              <p>Interest Paid</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon">⚠️</div>
            <div className="card-content">
              <h3>{formatCurrency(summary.totalPenalty)}</h3>
              <p>Penalties Paid</p>
            </div>
          </div>
          <div className="summary-card highlight">
            <div className="card-icon">💳</div>
            <div className="card-content">
              <h3>{formatCurrency(currentOutstanding)}</h3>
              <p>Outstanding</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon">📝</div>
            <div className="card-content">
              <h3>{totalPayments}</h3>
              <p>Payments Made</p>
            </div>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="view-selector">
          <div className="view-tabs">
            <button 
              className={`view-tab ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('all');
                fetchAllRepayments();
              }}
            >
              📋 All Repayments
            </button>
            <button 
              className={`view-tab ${viewMode === 'customer' ? 'active' : ''}`}
              onClick={() => setViewMode('customer')}
            >
              👤 By Customer
            </button>
            <button 
              className={`view-tab ${viewMode === 'loan' ? 'active' : ''}`}
              onClick={() => setViewMode('loan')}
            >
              📄 By Loan
            </button>
          </div>

          {viewMode === 'customer' && (
            <div className="filter-input-group">
              <input
                type="text"
                placeholder="Enter Customer ID"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="filter-input"
              />
              <button 
                className="filter-btn"
                onClick={() => selectedCustomerId && fetchCustomerRepayments(selectedCustomerId)}
              >
                Search
              </button>
            </div>
          )}

          {viewMode === 'loan' && (
            <div className="filter-input-group">
              <input
                type="text"
                placeholder="Enter Loan ID"
                value={selectedLoanId}
                onChange={(e) => setSelectedLoanId(e.target.value)}
                className="filter-input"
              />
              <button 
                className="filter-btn"
                onClick={() => selectedLoanId && fetchLoanRepayments(selectedLoanId)}
              >
                Search
              </button>
            </div>
          )}
        </div>

        {/* Repayment History Table */}
        <div className="data-table-container">
          <div className="table-header">
            <h2>Repayment History</h2>
            <p>Showing {repayments.length} payment{repayments.length !== 1 ? 's' : ''}</p>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading repayments...</p>
            </div>
          ) : repayments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💳</div>
              <h3>No Repayments Found</h3>
              <p>Record payments to track repayment history</p>
              <button className="primary-action-btn" onClick={() => setShowRecordPaymentModal(true)}>
                + Record Payment
              </button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Loan No.</th>
                    <th>Product</th>
                    <th>EMI Amount</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Penalty</th>
                    <th>Method</th>
                    <th>Reference</th>
                    <th>Outstanding After</th>
                  </tr>
                </thead>
                <tbody>
                  {repayments.map((repayment) => (
                    <tr key={repayment._id}>
                      <td className="date-cell">{formatDate(repayment.payment_date)}</td>
                      <td>
                        <strong className="loan-number">{repayment.loan_id.loan_number}</strong>
                      </td>
                      <td>
                        <div className="product-cell">
                          <span className="product-name">{repayment.loan_id.loan_product_id?.name || 'N/A'}</span>
                          <span className="product-code">{repayment.loan_id.loan_product_id?.code || ''}</span>
                        </div>
                      </td>
                      <td className="amount-cell primary-amount">
                        {formatCurrency(repayment.amount)}
                      </td>
                      <td className="amount-cell principal">
                        {formatCurrency(repayment.principal_component)}
                      </td>
                      <td className="amount-cell interest">
                        {formatCurrency(repayment.interest_component)}
                      </td>
                      <td className="amount-cell penalty">
                        {repayment.penalty_component > 0 
                          ? formatCurrency(repayment.penalty_component)
                          : '—'
                        }
                      </td>
                      <td>{getPaymentMethodBadge(repayment.payment_method)}</td>
                      <td className="reference-cell">{repayment.reference_number}</td>
                      <td className="amount-cell outstanding">
                        {formatCurrency(repayment.loan_id.principal_outstanding)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Record Payment Modal */}
      {showRecordPaymentModal && (
        <RecordPaymentModal
          onClose={() => setShowRecordPaymentModal(false)}
          onSuccess={() => {
            setShowRecordPaymentModal(false);
            fetchAllRepayments();
          }}
        />
      )}
    </div>
  );
};

// Record Payment Modal
const RecordPaymentModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    loan_id: '',
    payment_date: new Date().toISOString().split('T')[0],
    amount: '',
    principal_component: '',
    interest_component: '',
    penalty_component: '0',
    payment_method: 'UPI'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      const response = await fetch('https://onefi-backend-adv.onrender.com/api/repayments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loan_id: formData.loan_id,
          amount: Number(formData.amount),
          principal_component: Number(formData.principal_component),
          interest_component: Number(formData.interest_component),
          penalty_component: Number(formData.penalty_component),
          payment_method: formData.payment_method,
          payment_date: new Date(formData.payment_date).toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        alert(`Payment recorded successfully! Outstanding: ${new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(result.data.loan_id.principal_outstanding)}`);
        onSuccess();
      } else {
        alert('Error recording payment: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Error recording payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Auto-calculate total amount
  useEffect(() => {
    const principal = Number(formData.principal_component) || 0;
    const interest = Number(formData.interest_component) || 0;
    const penalty = Number(formData.penalty_component) || 0;
    const total = principal + interest + penalty;
    
    if (total > 0) {
      setFormData(prev => ({ ...prev, amount: total.toString() }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.principal_component, formData.interest_component, formData.penalty_component]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Record Payment</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Loan Number *</label>
                <input
                  type="text"
                  name="loan_id"
                  value={formData.loan_id}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="LAMF000018"
                />
                <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  Enter the loan number (e.g., LAMF000018)
                </small>
              </div>

              <div className="form-group">
                <label>Payment Date *</label>
                <input
                  type="date"
                  name="payment_date"
                  value={formData.payment_date}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Payment Method *</label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="UPI">UPI</option>
                  <option value="NEFT">NEFT</option>
                  <option value="RTGS">RTGS</option>
                  <option value="IMPS">IMPS</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>

              <div className="form-group">
                <label>Principal Component *</label>
                <input
                  type="number"
                  name="principal_component"
                  value={formData.principal_component}
                  onChange={handleChange}
                  className="form-input"
                  required
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Interest Component *</label>
                <input
                  type="number"
                  name="interest_component"
                  value={formData.interest_component}
                  onChange={handleChange}
                  className="form-input"
                  required
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Penalty Component</label>
                <input
                  type="number"
                  name="penalty_component"
                  value={formData.penalty_component}
                  onChange={handleChange}
                  className="form-input"
                  step="0.01"
                  placeholder="0.00"
                />
                <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  Reference number will be auto-generated
                </small>
              </div>
            </div>

            <div className="total-display">
              <span className="total-label">Total EMI Amount:</span>
              <span className="total-amount">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 2
                }).format(Number(formData.amount) || 0)}
              </span>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Recording...' : 'Record Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Repayment;
