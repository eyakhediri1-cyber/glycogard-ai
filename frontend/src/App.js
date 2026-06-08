import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BloodSugarTracker from './pages/BloodSugarTracker';
import NutritionTracker from './pages/NutritionTracker';
import MentalHealthLogger from './pages/MentalHealthLogger';
import RiskAssessment from './pages/RiskAssessment';
import AICompanion from './pages/AICompanion';
import Medications from './pages/Medications';

import './styles/global.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading GlycoGuard...</div>;
  }

  return (
    <Router>
      <Layout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/blood-sugar" element={<BloodSugarTracker />} />
              <Route path="/nutrition" element={<NutritionTracker />} />
              <Route path="/mental-health" element={<MentalHealthLogger />} />
              <Route path="/risk-assessment" element={<RiskAssessment />} />
              <Route path="/ai-companion" element={<AICompanion />} />
              <Route path="/medications" element={<Medications />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          )}
        </Routes>
      </Layout>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
