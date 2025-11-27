import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import CollateralPage from './pages/CollateralPage';
import RepaymentPage from './pages/RepaymentPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/applications" element={<ApplicationsPage />} />
      <Route path="/collateral" element={<CollateralPage />} />
      <Route path="/repayment" element={<RepaymentPage />} />
    </Routes>
  );
}

export default App;
