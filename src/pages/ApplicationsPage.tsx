import React from 'react';
import { useNavigate } from 'react-router-dom';
import Applications from '../components/applications/Applications';

const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
    window.scrollTo(0, 0);
  };

  return <Applications onBack={handleBack} />;
};

export default ApplicationsPage;
