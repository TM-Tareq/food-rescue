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
import PortalTransitionOverlay from './components/PortalTransitionOverlay/PortalTransitionOverlay';
import BackendStatusBadge from './components/BackendStatusBadge/BackendStatusBadge';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { authService } from './services';
import './styles/variables.css';

const VIEW_HASH_MAP = {
  landing: '#home',
  dashboard: '#restaurant',
  ngo: '#ngo',
  volunteer: '#volunteer',
  admin: '#admin',
  consumer: '#consumer',
  savings: '#savings'
};

const HASH_VIEW_MAP = {
  '#home': 'landing',
  '': 'landing',
  '#': 'landing',
  '#restaurant': 'dashboard',
  '#ngo': 'ngo',
  '#volunteer': 'volunteer',
  '#admin': 'admin',
  '#consumer': 'consumer',
  '#savings': 'savings'
};

export default function App() {
  const { user, logout } = useAuth();

  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    return HASH_VIEW_MAP[hash] || 'landing';
  });

  const [backendStatus, setBackendStatus] = useState('CHECKING');
  const { themeMode, toggleTheme } = useTheme();

  const [authModalState, setAuthModalState] = useState({
    isOpen: false,
    role: 'restaurant',
    mode: 'signin'
  });

  const [portalTransition, setPortalTransition] = useState({
    isVisible: false,
    role: 'restaurant',
    user: null,
    mode: 'login',
    targetView: 'dashboard'
  });

  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);

  // Helper to check if logged-in user is authorized for target view
  const isUserAuthorizedForView = (targetView, currentUser = user) => {
    if (targetView === 'landing' || targetView === 'savings') return true;
    if (!currentUser) return false;
    
    const userRole = (currentUser.role || '').toUpperCase();
    if (userRole === 'ADMIN') return true; // Admin has access to all portals
    
    if (targetView === 'admin') return userRole === 'ADMIN';
    if (targetView === 'dashboard') return userRole === 'RESTAURANT';
    if (targetView === 'ngo') return userRole === 'NGO';
    if (targetView === 'volunteer') return userRole === 'VOLUNTEER';
    if (targetView === 'consumer') return userRole === 'CONSUMER';
    
    return false;
  };

  // Central Navigation Function that pushes browser history state & checks authorization
  const changeView = (newView, pushHistory = true) => {
    if (!isUserAuthorizedForView(newView)) {
      const roleMap = { admin: 'admin', dashboard: 'restaurant', ngo: 'ngo', volunteer: 'volunteer', consumer: 'consumer' };
      handleOpenAuth(roleMap[newView] || 'restaurant');
      return;
    }

    setCurrentView(newView);
    if (pushHistory) {
      const hash = VIEW_HASH_MAP[newView] || '#home';
      if (window.location.hash !== hash) {
        window.history.pushState({ view: newView }, '', hash);
      }
    }
  };

  // Sync with Browser Back (◀) and Forward (▶) Buttons
  useEffect(() => {
    const handlePopState = (event) => {
      let targetView = 'landing';
      if (event.state && event.state.view) {
        targetView = event.state.view;
      } else {
        const hash = window.location.hash.toLowerCase();
        targetView = HASH_VIEW_MAP[hash] || 'landing';
      }

      if (isUserAuthorizedForView(targetView, user)) {
        setCurrentView(targetView);
      } else {
        setCurrentView('landing');
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const targetView = HASH_VIEW_MAP[hash] || 'landing';
      if (isUserAuthorizedForView(targetView, user)) {
        setCurrentView(targetView);
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);

    if (!window.history.state) {
      const initialHash = VIEW_HASH_MAP[currentView] || '#home';
      window.history.replaceState({ view: currentView }, '', initialHash);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [user]);

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

  const handleAuthSuccess = (selectedRole, userProfile, mode = 'login') => {
    const roleViewMap = {
      restaurant: 'dashboard',
      ngo: 'ngo',
      volunteer: 'volunteer',
      consumer: 'consumer',
      admin: 'admin'
    };
    const targetView = roleViewMap[selectedRole.toLowerCase()] || 'dashboard';

    setPortalTransition({
      isVisible: true,
      role: selectedRole,
      user: userProfile,
      mode: mode,
      targetView: targetView
    });
  };

  const handlePortalTransitionComplete = () => {
    setCurrentView(portalTransition.targetView);
    const hash = VIEW_HASH_MAP[portalTransition.targetView] || '#home';
    window.history.pushState({ view: portalTransition.targetView }, '', hash);
    setPortalTransition((prev) => ({ ...prev, isVisible: false }));
  };

  const handleOpenPortal = (roleStr) => {
    const roleViewMap = {
      restaurant: 'dashboard',
      ngo: 'ngo',
      volunteer: 'volunteer',
      consumer: 'consumer',
      admin: 'admin'
    };
    const targetView = roleViewMap[roleStr?.toLowerCase()] || 'dashboard';
    
    if (isUserAuthorizedForView(targetView)) {
      changeView(targetView, true);
    } else {
      handleOpenAuth(roleStr);
    }
  };

  return (
    <div className="app-container">
      {/* 1. FULLSCREEN SLEEK AUTH TRANSITION OVERLAY */}
      <PortalTransitionOverlay
        isVisible={portalTransition.isVisible}
        user={portalTransition.user}
        role={portalTransition.role}
        mode={portalTransition.mode}
        onComplete={handlePortalTransitionComplete}
      />

      {/* 2. MAIN PROFESSIONAL RENDERED VIEW WITH STRICT ROLE GUARDS */}
      {currentView === 'landing' && (
        <MainLayout onOpenAuth={handleOpenAuth} onOpenPortal={handleOpenPortal}>
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

      {currentView === 'dashboard' && isUserAuthorizedForView('dashboard') && (
        <div key="dashboard-view" className="portal-page-fade-enter">
          <RestaurantDashboard onLogout={() => { logout(); changeView('landing', true); }} />
        </div>
      )}
      {currentView === 'ngo' && isUserAuthorizedForView('ngo') && (
        <div key="ngo-view" className="portal-page-fade-enter">
          <NgoDashboard onLogout={() => { logout(); changeView('landing', true); }} />
        </div>
      )}
      {currentView === 'volunteer' && isUserAuthorizedForView('volunteer') && (
        <div key="volunteer-view" className="portal-page-fade-enter">
          <VolunteerApp onLogout={() => { logout(); changeView('landing', true); }} />
        </div>
      )}
      {currentView === 'admin' && isUserAuthorizedForView('admin') && (
        <div key="admin-view" className="portal-page-fade-enter">
          <AdminDashboard onLogout={() => { logout(); changeView('landing', true); }} />
        </div>
      )}
      {currentView === 'consumer' && isUserAuthorizedForView('consumer') && (
        <div key="consumer-view" className="portal-page-fade-enter">
          <ConsumerMarketplace onLogout={() => { logout(); changeView('landing', true); }} />
        </div>
      )}
      {currentView === 'savings' && (
        <div key="savings-view" className="portal-page-fade-enter">
          <SavingsImpactDashboard onLogout={() => { logout(); changeView('landing', true); }} />
        </div>
      )}

      {/* If current view is protected and user is NOT authorized, fallback rendering to landing + auth modal */}
      {currentView !== 'landing' && currentView !== 'savings' && !isUserAuthorizedForView(currentView) && (
        <MainLayout onOpenAuth={handleOpenAuth} onOpenPortal={handleOpenPortal}>
          <LandingPage onOpenAuth={handleOpenAuth} />
          <PartnerAuthModal
            isOpen={true}
            onClose={() => setCurrentView('landing')}
            initialRole={currentView === 'dashboard' ? 'restaurant' : currentView}
            mode="signin"
            onAuthSuccess={handleAuthSuccess}
          />
        </MainLayout>
      )}

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
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>🔒 Secured Portal Gateway</span>
              <button 
                onClick={() => setIsDemoMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button 
                onClick={() => { changeView('landing', true); setIsDemoMenuOpen(false); }}
                style={{ background: currentView === 'landing' ? '#2563eb' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: 500 }}
              >
                🌐 Public Landing Page
              </button>
              <button 
                onClick={() => { handleOpenPortal('restaurant'); setIsDemoMenuOpen(false); }}
                style={{ background: currentView === 'dashboard' ? '#2563eb' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: 500 }}
              >
                🏪 Restaurant Partner Dashboard
              </button>
              <button 
                onClick={() => { handleOpenPortal('ngo'); setIsDemoMenuOpen(false); }}
                style={{ background: currentView === 'ngo' ? '#2563eb' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: 500 }}
              >
                🏢 NGO Shelter Portal
              </button>
              <button 
                onClick={() => { handleOpenPortal('volunteer'); setIsDemoMenuOpen(false); }}
                style={{ background: currentView === 'volunteer' ? '#2563eb' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: 500 }}
              >
                🛵 Hero Volunteer GPS App
              </button>
              <button 
                onClick={() => { handleOpenPortal('consumer'); setIsDemoMenuOpen(false); }}
                style={{ background: currentView === 'consumer' ? '#2563eb' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: 500 }}
              >
                🛍️ Consumer Marketplace (50-80% OFF)
              </button>
              <button 
                onClick={() => { handleOpenPortal('admin'); setIsDemoMenuOpen(false); }}
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
            🔒 Portal Gateway
          </button>
        )}
      </div>
    </div>
  );
}
