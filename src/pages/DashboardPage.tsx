import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/dashboard/Dashboard';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  const handleNavigateToApplications = () => {
    navigate('/applications');
    window.scrollTo(0, 0);
  };

  const handleNavigateToCollateral = () => {
    navigate('/collateral');
    window.scrollTo(0, 0);
  };

  const handleNavigateToRepayment = () => {
    navigate('/repayment');
    window.scrollTo(0, 0);
  };

  return (
    <Dashboard
      onBack={handleBack}
      onNavigateToApplications={handleNavigateToApplications}
      onNavigateToCollateral={handleNavigateToCollateral}
      onNavigateToRepayment={handleNavigateToRepayment}
    />
  );
};

export default DashboardPage;
