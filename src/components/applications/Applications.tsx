import React, { useState, useEffect } from 'react';
import './Applications.css';
import { useTheme } from '../../context/ThemeContext';

interface Customer {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  pan: string;
}

interface LoanProductType {
  name: string;
  code: string;
}

interface LoanProduct {
  _id: string;
  name: string;
  code: string;
  interest_rate_annual: number;
  repayment_style: string;
  loan_product_type_id: LoanProductType;
}

interface LoanApplication {
  _id: string;
  customer_id: Customer;
  loan_product_id: LoanProduct;
  requested_amount: number;
  tenor_months: number;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

interface NBFC {
  _id: string;
  name: string;
}

interface Account {
  _id: string;
  account_name: string;
  is_company_account: boolean;
  bank_account_type: string;
  bank_name: string;
  account_type: string;
  account_number: string;
  branch_code: string;
  iban?: string;
  nbfc_id?: NBFC;
  customer_id?: Customer;
  loan_product_id?: LoanProduct;
  createdAt: string;
  updatedAt: string;
}

interface ApplicationsProps {
  onBack: () => void;
}

type TabType = 'applications' | 'accounts';
type StatusFilter = 'ALL' | 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

const Applications: React.FC<ApplicationsProps> = ({ onBack }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('applications');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [accountFilter, setAccountFilter] = useState<'ALL' | 'COMPANY' | 'CUSTOMER'>('ALL');
  
  // Applications state
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [showNewApplicationModal, setShowNewApplicationModal] = useState(false);
  
  // Accounts state
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  
  // View details state
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    fetchApplications();
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (statusFilter === 'ALL') {
      fetchApplications();
    } else {
      fetchApplicationsByStatus(statusFilter);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (accountFilter === 'ALL') {
      fetchAccounts();
    } else if (accountFilter === 'COMPANY') {
      fetchAccountsByType(true);
    } else {
      fetchAccountsByType(false);
    }
  }, [accountFilter]);

  const fetchApplications = async () => {
    try {
      setLoadingApplications(true);
      const response = await fetch('https://onefi-backend-adv.onrender.com/api/loan-applications');
      const result = await response.json();
      if (result.success) {
        setApplications(result.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const fetchApplicationsByStatus = async (status: string) => {
    try {
      setLoadingApplications(true);
      const response = await fetch(`https://onefi-backend-adv.onrender.com/api/loan-applications/status/${status}`);
      const result = await response.json();
      if (result.success) {
        setApplications(result.data);
      }
    } catch (error) {
      console.error('Error fetching applications by status:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const response = await fetch('https://onefi-backend-adv.onrender.com/api/accounts');
      const result = await response.json();
      if (result.success) {
        setAccounts(result.data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const fetchAccountsByType = async (isCompany: boolean) => {
    try {
      setLoadingAccounts(true);
      const response = await fetch(`https://onefi-backend-adv.onrender.com/api/accounts?isCompany=${isCompany}`);
      const result = await response.json();
      if (result.success) {
        setAccounts(result.data);
      }
    } catch (error) {
      console.error('Error fetching accounts by type:', error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const updateApplicationStatus = async (id: string, newStatus: string, amount?: number) => {
    try {
      const body: any = { status: newStatus };
      if (amount) body.requested_amount = amount;

      const response = await fetch(`https://onefi-backend-adv.onrender.com/api/loan-applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const result = await response.json();
      if (result.success) {
        fetchApplications();
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
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
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      DRAFT: { label: 'Draft', class: 'status-draft' },
      SUBMITTED: { label: 'Submitted', class: 'status-submitted' },
      UNDER_REVIEW: { label: 'Under Review', class: 'status-review' },
      APPROVED: { label: 'Approved', class: 'status-approved' },
      REJECTED: { label: 'Rejected', class: 'status-rejected' }
    };
    const badge = badges[status as keyof typeof badges] || { label: status, class: '' };
    return <span className={`status-badge ${badge.class}`}>{badge.label}</span>;
  };

  const getAccountTypeBadge = (type: string) => {
    const badges = {
      SETTLEMENT: { label: 'Settlement', class: 'account-settlement' },
      CUSTOMER: { label: 'Customer', class: 'account-customer' },
      DISBURSEMENT: { label: 'Disbursement', class: 'account-disbursement' }
    };
    const badge = badges[type as keyof typeof badges] || { label: type, class: '' };
    return <span className={`account-badge ${badge.class}`}>{badge.label}</span>;
  };

  return (
    <div className="applications-page">
      {/* Navbar */}
      <nav className="applications-navbar">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">1Fi</span>
            <span className="logo-text">LAMF Management</span>
          </div>
          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={onBack} className="back-home-btn">← Back to Dashboard</button>
          </div>
        </div>
      </nav>

      <div className="applications-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-left">
            <h1>Loan Operations</h1>
            <p>Manage loan applications and financial accounts</p>
          </div>
          <div className="header-actions">
            {activeTab === 'applications' && (
              <button className="primary-action-btn" onClick={() => setShowNewApplicationModal(true)}>
                + New Application
              </button>
            )}
            {activeTab === 'accounts' && (
              <button className="primary-action-btn" onClick={() => setShowNewAccountModal(true)}>
                + Add Account
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button 
            className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            📋 Loan Applications
          </button>
          <button 
            className={`tab ${activeTab === 'accounts' ? 'active' : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            🏦 Accounts
          </button>
        </div>

        {/* Applications Section */}
        {activeTab === 'applications' && (
          <div className="section-content">
            {/* Status Filters */}
            <div className="filters-bar">
              <div className="filter-group">
                <label>Status:</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
                  <option value="ALL">All Applications</option>
                  <option value="DRAFT">Draft</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div className="filter-stats">
                <span className="stat-badge">Total: {applications.length}</span>
              </div>
            </div>

            {/* Applications Table */}
            <div className="data-table-container">
              {loadingApplications ? (
                <div className="loading-state">
                  <div className="loader"></div>
                  <p>Loading applications...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No Applications Found</h3>
                  <p>Create a new loan application to get started</p>
                  <button className="primary-action-btn" onClick={() => setShowNewApplicationModal(true)}>
                    + New Application
                  </button>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer Name</th>
                      <th>Product</th>
                      <th>Amount</th>
                      <th>Tenor</th>
                      <th>Status</th>
                      <th>Applied On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <code className="id-code">{app._id}</code>
                        </td>
                        <td>
                          <div className="customer-cell">
                            <strong>{app.customer_id?.full_name || 'N/A'}</strong>
                            <span className="customer-email">{app.customer_id?.email || ''}</span>
                          </div>
                        </td>
                        <td>
                          <div className="product-cell">
                            <strong>{app.loan_product_id?.name || 'N/A'}</strong>
                            <span className="product-type">{app.loan_product_id?.loan_product_type_id?.name || ''}</span>
                          </div>
                        </td>
                        <td className="amount-cell">{formatCurrency(app.requested_amount)}</td>
                        <td>{app.tenor_months} months</td>
                        <td>{getStatusBadge(app.status)}</td>
                        <td>{formatDate(app.createdAt)}</td>
                        <td>
                          <button 
                            className="action-btn view-btn"
                            onClick={() => setSelectedApplication(app)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Accounts Section */}
        {activeTab === 'accounts' && (
          <div className="section-content">
            {/* Account Filters */}
            <div className="filters-bar">
              <div className="filter-group">
                <label>Type:</label>
                <select value={accountFilter} onChange={(e) => setAccountFilter(e.target.value as any)}>
                  <option value="ALL">All Accounts</option>
                  <option value="COMPANY">Company Accounts</option>
                  <option value="CUSTOMER">Customer Accounts</option>
                </select>
              </div>
              <div className="filter-stats">
                <span className="stat-badge">Total: {accounts.length}</span>
              </div>
            </div>

            {/* Accounts Table */}
            <div className="data-table-container">
              {loadingAccounts ? (
                <div className="loading-state">
                  <div className="loader"></div>
                  <p>Loading accounts...</p>
                </div>
              ) : accounts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🏦</div>
                  <h3>No Accounts Found</h3>
                  <p>Add a new account to get started</p>
                  <button className="primary-action-btn" onClick={() => setShowNewAccountModal(true)}>
                    + Add Account
                  </button>
                </div>
              ) : (
                <div className="table-scroll-wrapper">
                  <table className="data-table accounts-table-expanded">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Account Name</th>
                        <th>Is Company</th>
                        <th>Bank Account Type</th>
                        <th>Bank Name</th>
                        <th>Account Type</th>
                        <th>IBAN</th>
                        <th>Branch Code</th>
                        <th>Account Number</th>
                        <th>NBFC</th>
                        <th>Customer Name</th>
                        <th>Customer Email</th>
                        <th>Customer Phone</th>
                        <th>Customer PAN</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map((account) => (
                        <tr key={account._id}>
                          <td>
                            <code className="id-code">{account._id}</code>
                          </td>
                          <td>
                            <strong>{account.account_name}</strong>
                          </td>
                          <td>
                            <span className={`type-badge ${account.is_company_account ? 'company' : 'customer'}`}>
                              {account.is_company_account ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td>
                            <span className="badge-type">{account.bank_account_type}</span>
                          </td>
                          <td>{account.bank_name}</td>
                          <td>{getAccountTypeBadge(account.account_type)}</td>
                          <td>
                            <code className="iban-code">{account.iban || '-'}</code>
                          </td>
                          <td>
                            <code className="branch-code">{account.branch_code}</code>
                          </td>
                          <td className="account-number">
                            <code>{account.account_number}</code>
                          </td>
                          <td>
                            {account.nbfc_id?.name || '-'}
                          </td>
                          <td>
                            {account.customer_id?.full_name || '-'}
                          </td>
                          <td>
                            <span className="email-text">{account.customer_id?.email || '-'}</span>
                          </td>
                          <td>
                            {account.customer_id?.phone || '-'}
                          </td>
                          <td>
                            <code className="pan-code">{account.customer_id?.pan || '-'}</code>
                          </td>
                          <td>{formatDate(account.createdAt)}</td>
                          <td>{formatDate(account.createdAt)}</td>
                          <td>
                            <button 
                              className="action-btn view-btn"
                              onClick={() => setSelectedAccount(account)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdate={updateApplicationStatus}
        />
      )}

      {/* Account Details Modal */}
      {selectedAccount && (
        <AccountDetailsModal
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}

      {/* New Application Modal */}
      {showNewApplicationModal && (
        <NewApplicationModal
          onClose={() => setShowNewApplicationModal(false)}
          onSuccess={() => {
            setShowNewApplicationModal(false);
            fetchApplications();
          }}
        />
      )}

      {/* New Account Modal */}
      {showNewAccountModal && (
        <NewAccountModal
          onClose={() => setShowNewAccountModal(false)}
          onSuccess={() => {
            setShowNewAccountModal(false);
            fetchAccounts();
          }}
        />
      )}
    </div>
  );
};

// Application Details Modal Component
const ApplicationDetailsModal: React.FC<{
  application: LoanApplication;
  onClose: () => void;
  onUpdate: (id: string, status: string, amount?: number) => void;
}> = ({ application, onClose, onUpdate }) => {
  const [editedAmount, setEditedAmount] = useState(application.requested_amount);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Application Details</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-section">
              <h3>Customer Information</h3>
              <div className="detail-row">
                <span className="label">Name:</span>
                <span className="value">{application.customer_id?.full_name || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{application.customer_id?.email || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Phone:</span>
                <span className="value">{application.customer_id?.phone || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">PAN:</span>
                <span className="value">{application.customer_id?.pan || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Loan Details</h3>
              <div className="detail-row">
                <span className="label">Product:</span>
                <span className="value">{application.loan_product_id?.name || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Product Code:</span>
                <span className="value">{application.loan_product_id?.code || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Interest Rate:</span>
                <span className="value">{application.loan_product_id?.interest_rate_annual || 0}% p.a.</span>
              </div>
              <div className="detail-row">
                <span className="label">Repayment Style:</span>
                <span className="value">{application.loan_product_id?.repayment_style || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Application Details</h3>
              <div className="detail-row">
                <span className="label">Requested Amount:</span>
                <span className="value amount">{formatCurrency(application.requested_amount)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Tenor:</span>
                <span className="value">{application.tenor_months} months</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className="value">
                  <span className={`status-badge status-${application.status.toLowerCase()}`}>
                    {application.status}
                  </span>
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Applied On:</span>
                <span className="value">{new Date(application.createdAt).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {application.status === 'SUBMITTED' && (
            <div className="detail-section action-section">
              <h3>Review Application</h3>
              <div className="edit-amount">
                <label>Adjust Amount (if needed):</label>
                <input
                  type="number"
                  value={editedAmount}
                  onChange={(e) => setEditedAmount(Number(e.target.value))}
                  className="amount-input"
                />
              </div>
              <div className="action-buttons">
                <button 
                  className="approve-btn"
                  onClick={() => onUpdate(application._id, 'APPROVED', editedAmount)}
                >
                  ✓ Approve Application
                </button>
                <button 
                  className="review-btn"
                  onClick={() => onUpdate(application._id, 'UNDER_REVIEW')}
                >
                  🔍 Move to Review
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => onUpdate(application._id, 'REJECTED')}
                >
                  ✕ Reject Application
                </button>
              </div>
            </div>
          )}

          {application.status === 'UNDER_REVIEW' && (
            <div className="detail-section action-section">
              <h3>Review Actions</h3>
              <div className="action-buttons">
                <button 
                  className="approve-btn"
                  onClick={() => onUpdate(application._id, 'APPROVED', editedAmount)}
                >
                  ✓ Approve Application
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => onUpdate(application._id, 'REJECTED')}
                >
                  ✕ Reject Application
                </button>
              </div>
            </div>
          )}

          {application.status === 'APPROVED' && (
            <div className="detail-section success-section">
              <p className="success-message">✓ This application has been approved and is ready for loan creation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Account Details Modal Component
const AccountDetailsModal: React.FC<{
  account: Account;
  onClose: () => void;
}> = ({ account, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Account Details</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-section">
              <h3>Account Information</h3>
              <div className="detail-row">
                <span className="label">Account Name:</span>
                <span className="value">{account.account_name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Account Type:</span>
                <span className="value">
                  <span className={`type-badge ${account.is_company_account ? 'company' : 'customer'}`}>
                    {account.is_company_account ? 'Company' : 'Customer'}
                  </span>
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Category:</span>
                <span className="value">{account.account_type}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Bank Details</h3>
              <div className="detail-row">
                <span className="label">Bank Name:</span>
                <span className="value">{account.bank_name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Account Number:</span>
                <span className="value account-number">{account.account_number}</span>
              </div>
              <div className="detail-row">
                <span className="label">Branch Code:</span>
                <span className="value">{account.branch_code}</span>
              </div>
              <div className="detail-row">
                <span className="label">Account Type:</span>
                <span className="value">{account.bank_account_type}</span>
              </div>
              {account.iban && (
                <div className="detail-row">
                  <span className="label">IBAN:</span>
                  <span className="value">{account.iban}</span>
                </div>
              )}
            </div>

            <div className="detail-section">
              <h3>Owner Information</h3>
              {account.is_company_account ? (
                <>
                  <div className="detail-row">
                    <span className="label">NBFC:</span>
                    <span className="value">{account.nbfc_id?.name || 'N/A'}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="detail-row">
                    <span className="label">Customer:</span>
                    <span className="value">{account.customer_id?.full_name || 'N/A'}</span>
                  </div>
                  {account.customer_id && (
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span className="value">{account.customer_id.email}</span>
                    </div>
                  )}
                </>
              )}
              <div className="detail-row">
                <span className="label">Created On:</span>
                <span className="value">{new Date(account.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// New Application Modal - Placeholder
const NewApplicationModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_pan: '',
    customer_phone: '',
    loan_product_id: '',
    requested_amount: '',
    tenor_months: '',
    status: 'DRAFT'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setSubmitting(true);
      const response = await fetch('https://onefi-backend-adv.onrender.com/api/loan-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_pan: formData.customer_pan,
          customer_phone: formData.customer_phone,
          loan_product_id: formData.loan_product_id,
          requested_amount: Number(formData.requested_amount),
          tenor_months: Number(formData.tenor_months),
          status: formData.status
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Loan application created successfully!');
        onSuccess();
      } else {
        setError(result.message || 'Failed to create application');
      }
    } catch (error) {
      console.error('Error creating application:', error);
      setError('Error creating application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Loan Application</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="application-form">
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
                <label>Customer Name *</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Sanjay Mehta"
                />
              </div>

              <div className="form-group">
                <label>Customer Email *</label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="sanjay.mehta@hotmail.com"
                />
              </div>

              <div className="form-group">
                <label>Customer PAN *</label>
                <input
                  type="text"
                  name="customer_pan"
                  value={formData.customer_pan}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="MNOPQ3456R"
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  maxLength={10}
                  style={{ textTransform: 'uppercase' }}
                />
                <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  Format: ABCDE1234F (5 letters, 4 digits, 1 letter)
                </small>
              </div>

              <div className="form-group">
                <label>Customer Phone *</label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="9876543222"
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
                <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  10-digit mobile number
                </small>
              </div>

              <div className="form-group">
                <label>Loan Product *</label>
                <select
                  name="loan_product_id"
                  value={formData.loan_product_id}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select a loan product</option>
                  <option value="1">LAMF_EMI_MC - Premium EMI - Multi Cap</option>
                  <option value="2">LAMF_EMI_SC - Quick EMI - Small Cap</option>
                  <option value="3">LAMF_EMI_LC - Standard EMI - Large Cap</option>
                  <option value="4">LAMF_IO_DEBT - Interest Only - Debt Funds</option>
                  <option value="5">LAMF_BULLET_HYB - Bullet - Hybrid Funds</option>
                  <option value="6">LAMF_OD_LIQ - Overdraft - Liquid Funds</option>
                </select>
              </div>

              <div className="form-group">
                <label>Requested Amount (₹) *</label>
                <input
                  type="number"
                  name="requested_amount"
                  value={formData.requested_amount}
                  onChange={handleChange}
                  className="form-input"
                  required
                  min="1000"
                  step="1"
                  placeholder="500000"
                />
              </div>

              <div className="form-group">
                <label>Tenor (Months) *</label>
                <input
                  type="number"
                  name="tenor_months"
                  value={formData.tenor_months}
                  onChange={handleChange}
                  className="form-input"
                  required
                  min="1"
                  max="360"
                  step="1"
                  placeholder="12"
                />
              </div>

              <div className="form-group">
                <label>Initial Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="DRAFT">Draft</option>
                  <option value="SUBMITTED">Submitted</option>
                </select>
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: '1.5rem' }}>
              <button type="button" className="cancel-btn" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// New Account Modal
const NewAccountModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [accountType, setAccountType] = useState<'company' | 'customer'>('customer');
  const [formData, setFormData] = useState({
    account_type: 'SETTLEMENT',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    account_holder_name: '',
    customer_id: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setSubmitting(true);
      const payload: any = {
        account_type: formData.account_type,
        bank_name: formData.bank_name,
        account_number: formData.account_number,
        ifsc_code: formData.ifsc_code,
        account_holder_name: formData.account_holder_name,
        isCompany: accountType === 'company'
      };

      if (accountType === 'customer' && formData.customer_id) {
        payload.customer_id = formData.customer_id;
      }

      const response = await fetch('https://onefi-backend-adv.onrender.com/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Account created successfully!');
        onSuccess();
      } else {
        setError(result.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setError('Error creating account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Account</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="application-form">
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

            {/* Account Type Selection */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Account Owner Type *</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="company"
                    checked={accountType === 'company'}
                    onChange={() => {
                      setAccountType('company');
                      setFormData(prev => ({ ...prev, customer_id: '' }));
                    }}
                  />
                  <span>Company/NBFC Account</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="customer"
                    checked={accountType === 'customer'}
                    onChange={() => setAccountType('customer')}
                  />
                  <span>Customer Account</span>
                </label>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Account Type *</label>
                <select
                  name="account_type"
                  value={formData.account_type}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="SETTLEMENT">Settlement Account</option>
                  <option value="DISBURSEMENT">Disbursement Account</option>
                  <option value="CUSTOMER">Customer Account</option>
                </select>
              </div>

              <div className="form-group">
                <label>Bank Name *</label>
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="HDFC Bank"
                />
              </div>

              <div className="form-group">
                <label>Account Number *</label>
                <input
                  type="text"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="50100123456789"
                />
              </div>

              <div className="form-group">
                <label>IFSC Code *</label>
                <input
                  type="text"
                  name="ifsc_code"
                  value={formData.ifsc_code}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="HDFC0001234"
                  pattern="^[A-Z0-9]+$"
                  title="Enter valid IFSC code (only capital letters and numbers)"
                  style={{ textTransform: 'uppercase' }}
                  minLength={5}
                  maxLength={15}
                />
              </div>

              <div className="form-group">
                <label>Account Holder Name *</label>
                <input
                  type="text"
                  name="account_holder_name"
                  value={formData.account_holder_name}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="John Doe"
                />
              </div>

              {accountType === 'customer' && (
                <div className="form-group">
                  <label>Customer ID *</label>
                  <input
                    type="text"
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleChange}
                    className="form-input"
                    required
                    placeholder="Enter customer MongoDB ID"
                  />
                  <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    MongoDB ObjectId (e.g., 65f1b2c3d4e5f6a7b8c9d0e1)
                  </small>
                </div>
              )}
            </div>

            <div className="form-actions" style={{ marginTop: '1.5rem' }}>
              <button type="button" className="cancel-btn" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Applications;
