import React, { useState, useEffect } from 'react';
import SystemOverviewTab from './components/SystemOverviewTab/SystemOverviewTab';
import PartnerVerificationTab from './components/PartnerVerificationTab/PartnerVerificationTab';
import LogisticsTowerTab from './components/LogisticsTowerTab/LogisticsTowerTab';
import MarketplaceOversightTab from './components/MarketplaceOversightTab/MarketplaceOversightTab';
import AnalyticsReportTab from './components/AnalyticsReportTab/AnalyticsReportTab';
import { 
  Globe, ShieldCheck, Truck, ShoppingBag, BarChart3, Sun, Moon, 
  Search, Bell, User, Clock, ChevronDown, Sparkles, Activity
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'verification', 'logistics', 'marketplace', 'analytics'
  const [theme, setTheme] = useState('light'); // 'light' vs 'dark'
  const [systemTime, setSystemTime] = useState('');

  // Update System Time Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' GMT+6');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="admin-dashboard-container" data-theme={theme}>
      {/* TOP ENTERPRISE ADMIN HEADER */}
      <header className="admin-top-header">
        <div className="header-brand-group">
          <div className="admin-logo-badge">
            <ShieldCheck size={22} className="shield-icon" />
          </div>
          <div className="brand-text">
            <h3>FoodRescue <span className="control-tower-badge">SUPER ADMIN</span></h3>
            <p className="system-clock-line">📍 Dhaka Control Tower • ⏱️ {systemTime}</p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="header-actions-group">
          {/* DYNAMIC LIGHT / DARK THEME SWITCHER */}
          <button 
            className="theme-switcher-toggle"
            onClick={toggleTheme}
            title="Toggle Light Mode / Dark Mode Theme"
          >
            {theme === 'light' ? (
              <>
                <Moon size={16} className="moon-icon" />
                <span>Switch to <strong>Dark Mode</strong></span>
              </>
            ) : (
              <>
                <Sun size={16} className="sun-icon" />
                <span>Switch to <strong>Light Mode</strong></span>
              </>
            )}
          </button>

          <div className="notifications-bell-box">
            <Bell size={18} />
            <span className="bell-red-dot"></span>
          </div>

          <div className="admin-user-profile">
            <div className="admin-avatar">👨‍💻</div>
            <div className="user-meta">
              <span className="user-name">Tareq Rahman</span>
              <span className="user-role">Super Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION SUB-TAB BAR */}
      <nav className="admin-subtab-navbar">
        <button 
          className={`subtab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Globe size={16} />
          <span>Ecosystem Overview</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'verification' ? 'active' : ''}`}
          onClick={() => setActiveTab('verification')}
        >
          <ShieldCheck size={16} />
          <span>Partner Verification</span>
          <span className="tab-badge-pending">3</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'logistics' ? 'active' : ''}`}
          onClick={() => setActiveTab('logistics')}
        >
          <Truck size={16} />
          <span>Fleet Logistics</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
          onClick={() => setActiveTab('marketplace')}
        >
          <ShoppingBag size={16} />
          <span>Marketplace & Escrow</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={16} />
          <span>ESG Analytics & PDF Reports</span>
        </button>
      </nav>

      {/* DYNAMIC TAB VIEWPORT */}
      <main className="admin-main-viewport">
        {activeTab === 'overview' && <SystemOverviewTab theme={theme} />}
        {activeTab === 'verification' && <PartnerVerificationTab />}
        {activeTab === 'logistics' && <LogisticsTowerTab />}
        {activeTab === 'marketplace' && <MarketplaceOversightTab />}
        {activeTab === 'analytics' && <AnalyticsReportTab />}
      </main>
    </div>
  );
}
