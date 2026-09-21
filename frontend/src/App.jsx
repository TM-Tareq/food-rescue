import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout/MainLayout';
import LandingPage from './features/landing/LandingPage';
import RestaurantDashboard from './features/restaurant/RestaurantDashboard';
import NgoDashboard from './features/ngo/NgoDashboard';
import VolunteerApp from './features/volunteer/VolunteerApp';
import AdminDashboard from './features/admin/AdminDashboard';

import PartnerAuthModal from './features/auth/components/PartnerAuthModal/PartnerAuthModal';
import './styles/variables.css';

export default function App() {

  const [authModalState, setAuthModalState] = useState({
    isOpen: false,
    role: 'restaurant',
    mode: 'signin'
  });

  const handleOpenAuth = (roleOrMode = 'restaurant') => {
    let role = 'restaurant';
    let mode = 'signin';

    if (roleOrMode === 'signin') {
      setCurrentView('dashboard');
      return;
    } else if (roleOrMode === 'signup') {
      mode = 'signup';
    } else {
      role = roleOrMode;
      mode = 'signup';
    }

    setAuthModalState({
      isOpen: true,
      role,
      mode
    });
  };

  const handleCloseAuth = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="app-container">
      {/* Top Quick Demo View Switcher Bar */}
      <div className="demo-view-switcher">
        <button
          className={`demo-btn ${currentView === 'savings' ? 'demo-active' : ''}`}
          onClick={() => setCurrentView('savings')}
        >
          🌱 My Savings & Eco Impact (User Portal)
        </button>
        <button
          className={`demo-btn ${currentView === 'landing' ? 'demo-active' : ''}`}
          onClick={() => setCurrentView('landing')}
        >
          🌐 Public Landing Page
        </button>
        <button
          className={`demo-btn ${currentView === 'dashboard' ? 'demo-active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          🏪 Restaurant Dashboard
        </button>
        <button
          className={`demo-btn ${currentView === 'ngo' ? 'demo-active' : ''}`}
          onClick={() => setCurrentView('ngo')}
        >
          🏢 NGO Portal
        </button>
        <button
          className={`demo-btn ${currentView === 'volunteer' ? 'demo-active' : ''}`}
          onClick={() => setCurrentView('volunteer')}
        >
          🛵 Volunteer App
        </button>
        <button
          className={`demo-btn ${currentView === 'admin' ? 'demo-active' : ''}`}
          onClick={() => setCurrentView('admin')}
        >
          🛡️ Super Admin Tower
        </button>
        <button
          className={`demo-btn ${currentView === 'consumer' ? 'demo-active' : ''}`}
          onClick={() => setCurrentView('consumer')}
        >
          🛍️ Consumer Marketplace (50-70% OFF)
        </button>
      </div>

      {/* Render Selected View */}
      {currentView === 'savings' && <SavingsImpactDashboard />}

      {currentView === 'landing' && (
        <MainLayout onOpenAuth={handleOpenAuth}>
          <LandingPage onOpenAuth={handleOpenAuth} />
          <PartnerAuthModal
            isOpen={authModalState.isOpen}
            onClose={handleCloseAuth}
            initialRole={authModalState.role}
            mode={authModalState.mode}
          />
        </MainLayout>
      )}

      {currentView === 'dashboard' && <RestaurantDashboard />}

      {currentView === 'ngo' && <NgoDashboard />}

      {currentView === 'volunteer' && <VolunteerApp />}

      {currentView === 'admin' && <AdminDashboard />}

      {currentView === 'consumer' && <ConsumerMarketplace />}
    </div>
  );
}


