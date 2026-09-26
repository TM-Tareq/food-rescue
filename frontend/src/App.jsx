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

  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);

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
      mode = 'signin';
    } else if (roleOrMode === 'signup') {
      mode = 'signup';
    } else if (typeof roleOrMode === 'string') {
      role = roleOrMode;
      mode = 'signin';
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

  const handleAuthSuccess = (selectedRole) => {
    const roleViewMap = {
      restaurant: 'dashboard',
      ngo: 'ngo',
      volunteer: 'volunteer',
      consumer: 'consumer',
      admin: 'admin'
    };
    setCurrentView(roleViewMap[selectedRole.toLowerCase()] || 'dashboard');
  };

  return (
    <div className="app-container">
      {/* 1. MAIN PROFESSIONAL RENDERED VIEW */}
      {currentView === 'landing' && (
        <MainLayout onOpenAuth={handleOpenAuth}>
          <LandingPage onOpenAuth={handleOpenAuth} />
          <PartnerAuthModal
            isOpen={authModalState.isOpen}
            onClose={handleCloseAuth}
            initialRole={authModalState.role}
            mode={authModalState.mode}
            onAuthSuccess={handleAuthSuccess}
          />
        </MainLayout>
      )}

      {currentView === 'dashboard' && <RestaurantDashboard onLogout={() => setCurrentView('landing')} />}
      {currentView === 'ngo' && <NgoDashboard onLogout={() => setCurrentView('landing')} />}
      {currentView === 'volunteer' && <VolunteerApp onLogout={() => setCurrentView('landing')} />}
      {currentView === 'admin' && <AdminDashboard onLogout={() => setCurrentView('landing')} />}
      {currentView === 'consumer' && <ConsumerMarketplace onLogout={() => setCurrentView('landing')} />}
      {currentView === 'savings' && <SavingsImpactDashboard onLogout={() => setCurrentView('landing')} />}

      {/* 2. SLEEK FLOATING EVALUATOR DEMO WIDGET (Bottom Right Corner) */}
      <div className="floating-evaluator-widget" style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        fontFamily: 'system-ui, sans-serif'
      }}>
        {isDemoMenuOpen ? (
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '14px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            width: '260px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>⚡ Evaluator Role Switcher</span>
              <button 
                onClick={() => setIsDemoMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button 
                onClick={() => { setCurrentView('landing'); setIsDemoMenuOpen(false); }}
                style={{ background: currentView === 'landing' ? '#2563eb' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: 500 }}
              >
                🌐 Public Landing Page
              </button>
              <button 
                onClick={() => { setCurrentView('dashboard'); setIsDemoMenuOpen(false); }}
                style={{ background: currentView === 'dashboard' ? '#2563eb' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: 500 }}
              >
                🏪 Restaurant Partner Dashboard
              </button>
              <button 
                onClick={() => { setCurrentView('ngo'); setIsDemoMenuOpen(false); }}
                style={{ background: currentView === 'ngo' ? '#2563eb' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: 500 }}
              >
                🏢 NGO Shelter Portal
              </button>
              <button 
                onClick={() => { setCurrentView('volunteer'); setIsDemoMenuOpen(false); }}
                style={{ background: currentView === 'volunteer' ? '#2563eb' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: 500 }}
              >
                🛵 Hero Volunteer GPS App
              </button>
              <button 
                onClick={() => { setCurrentView('consumer'); setIsDemoMenuOpen(false); }}
                style={{ background: currentView === 'consumer' ? '#2563eb' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: 500 }}
              >
                🛍️ Consumer Marketplace (50-80% OFF)
              </button>
              <button 
                onClick={() => { setCurrentView('admin'); setIsDemoMenuOpen(false); }}
                style={{ background: currentView === 'admin' ? '#2563eb' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: 500 }}
              >
                🛡️ Super Admin Control Tower
              </button>
            </div>
            
            <div style={{ marginTop: '10px', pt: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <BackendStatusBadge />
              <button 
                onClick={toggleTheme}
                style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontSize: '12px' }}
              >
                {themeMode === 'light' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsDemoMenuOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#38bdf8',
              border: '1px solid rgba(56,189,248,0.4)',
              borderRadius: '30px',
              padding: '8px 16px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ⚡ Demo Role Gateway
          </button>
        )}
      </div>
    </div>
  );
}
