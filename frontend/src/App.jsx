import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout/MainLayout';
import LandingPage from './features/landing/LandingPage';
import RestaurantDashboard from './features/restaurant/RestaurantDashboard';
import PartnerAuthModal from './features/auth/components/PartnerAuthModal/PartnerAuthModal';
import './styles/variables.css';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'dashboard'
  const [authModalState, setAuthModalState] = useState({
    isOpen: false,
    role: 'restaurant',
    mode: 'signin'
  });

  const handleOpenAuth = (roleOrMode = 'restaurant') => {
    let role = 'restaurant';
    let mode = 'signin';

    if (roleOrMode === 'signin') {
      // Simulate direct sign in to Restaurant Dashboard for previewing
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
          className={`demo-btn ${currentView === 'landing' ? 'demo-active' : ''}`}
          onClick={() => setCurrentView('landing')}
        >
          🌐 Public Landing Page
        </button>
        <button
          className={`demo-btn ${currentView === 'dashboard' ? 'demo-active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          🏪 Restaurant Dashboard (Partner Portal)
        </button>
      </div>

      {/* Render View */}
      {currentView === 'landing' ? (
        <MainLayout onOpenAuth={handleOpenAuth}>
          <LandingPage onOpenAuth={handleOpenAuth} />
          <PartnerAuthModal
            isOpen={authModalState.isOpen}
            onClose={handleCloseAuth}
            initialRole={authModalState.role}
            mode={authModalState.mode}
          />
        </MainLayout>
      ) : (
        <RestaurantDashboard />
      )}
    </div>
  );
}
