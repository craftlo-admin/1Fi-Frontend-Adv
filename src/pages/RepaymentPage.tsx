import React from 'react';
import { useNavigate } from 'react-router-dom';
import Repayment from '../components/repayment/Repayment';

const RepaymentPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
    window.scrollTo(0, 0);
  };

  return <Repayment onBack={handleBack} />;
};

export default RepaymentPage;
