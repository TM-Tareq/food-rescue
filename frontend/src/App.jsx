import React, { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout/MainLayout';
import LandingPage from './features/landing/LandingPage';
import RestaurantDashboard from './features/restaurant/RestaurantDashboard';
import NgoDashboard from './features/ngo/NgoDashboard';
import VolunteerApp from './features/volunteer/VolunteerApp';
import AdminDashboard from './features/admin/AdminDashboard';
import SavingsImpactDashboard from './features/savings-impact/SavingsImpactDashboard';
import ConsumerMarketplace from './features/consumer/ConsumerMarketplace';

import PartnerAuthModal from './features/auth/components/PartnerAuthModal/PartnerAuthModal';
import BackendStatusBadge from './components/BackendStatusBadge/BackendStatusBadge';
import { useTheme } from './context/ThemeContext';
import { authService } from './services';
import './styles/variables.css';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [backendStatus, setBackendStatus] = useState('CHECKING'); // 'ONLINE', 'FALLBACK', 'CHECKING'

  const { themeMode, toggleTheme } = useTheme();

  const [authModalState, setAuthModalState] = useState({
    isOpen: false,
    role: 'restaurant',
    mode: 'signin'
  });

  useEffect(() => {
    authService.checkBackendHealth().then((res) => {
      if (res && res.status !== 'OFFLINE') {
        setBackendStatus('ONLINE');
      } else {
        setBackendStatus('FALLBACK');
      }
    });
  }, []);

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
        <BackendStatusBadge />
        <button
          className="demo-btn theme-toggle-btn"
          onClick={toggleTheme}
          style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fbbf24', borderColor: '#f59e0b' }}
        >
          {themeMode === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
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
