import React from 'react';
import { useNavigate } from 'react-router-dom';
import Collateral from '../components/collateral/Collateral';

const CollateralPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
    window.scrollTo(0, 0);
  };

  return <Collateral onBack={handleBack} />;
};

export default CollateralPage;
