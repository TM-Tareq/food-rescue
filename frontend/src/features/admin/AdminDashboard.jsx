import React, { useState, useEffect } from 'react';
import SystemOverviewTab from './components/SystemOverviewTab/SystemOverviewTab';
import PartnerVerificationTab from './components/PartnerVerificationTab/PartnerVerificationTab';
import LogisticsTowerTab from './components/LogisticsTowerTab/LogisticsTowerTab';
import MarketplaceOversightTab from './components/MarketplaceOversightTab/MarketplaceOversightTab';
import AnalyticsReportTab from './components/AnalyticsReportTab/AnalyticsReportTab';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import { 
  Globe, ShieldCheck, Truck, ShoppingBag, BarChart3, Sun, Moon, 
  Search, Bell, User, Clock, ChevronDown, Sparkles, Activity, Edit2
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'verification', 'logistics', 'marketplace', 'analytics'
  const [theme, setTheme] = useState('light'); // 'light' vs 'dark'
  const [systemTime, setSystemTime] = useState('');

  // Editable Admin Profile State
  const [adminProfile, setAdminProfile] = useState({
    name: 'Tareq Rahman',
    role: 'Super Admin',
    email: 'tareq@foodrescue.org',
    phone: '+880 1711-000111',
    avatar: '👨‍💻',
    twoFactorEnabled: true
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...adminProfile });
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

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

  const handleOpenProfileModal = () => {
    setEditForm({ ...adminProfile });
    setProfileSuccessMsg('');
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setAdminProfile({ ...editForm });
    setProfileSuccessMsg('✅ Admin Profile updated successfully!');
    setTimeout(() => {
      setIsProfileModalOpen(false);
    }, 1500);
  };

  const availableAvatars = ['👨‍💻', '👨‍💼', '🦸‍♂️', '👨‍🔬', '👑', '🛡️', '👨‍🌾', '🌟'];

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

          {/* EDITABLE ADMIN USER PROFILE BADGE */}
          <div 
            className="admin-user-profile editable-profile"
            onClick={handleOpenProfileModal}
            title="Click to Edit Admin Profile & Credentials"
          >
            <div className="admin-avatar">{adminProfile.avatar}</div>
            <div className="user-meta">
              <span className="user-name">{adminProfile.name} <Edit2 size={12} className="edit-pencil-icon" /></span>
              <span className="user-role">{adminProfile.role}</span>
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

      {/* MODAL: EDIT ADMIN PROFILE & ACCOUNT SETTINGS */}
      <Modal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)}
        title="✏️ Edit Admin Profile & Credentials"
      >
        <form onSubmit={handleSaveProfile} className="profile-edit-form">
          <div className="avatar-picker-section">
            <label className="picker-label">Select Avatar Icon:</label>
            <div className="avatar-options-grid">
              {availableAvatars.map((emoji) => (
                <button 
                  key={emoji}
                  type="button"
                  className={`avatar-option-btn ${editForm.avatar === emoji ? 'selected' : ''}`}
                  onClick={() => setEditForm(prev => ({ ...prev, avatar: emoji }))}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group-admin">
            <label>Admin Full Name:</label>
            <input 
              type="text" 
              className="admin-form-input"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-group-admin">
            <label>Designation / Role Title:</label>
            <input 
              type="text" 
              className="admin-form-input"
              value={editForm.role}
              onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
              required
            />
          </div>

          <div className="form-row-two">
            <div className="form-group-admin">
              <label>Official Email:</label>
              <input 
                type="email" 
                className="admin-form-input"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="form-group-admin">
              <label>Phone Number:</label>
              <input 
                type="text" 
                className="admin-form-input"
                value={editForm.phone}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
          </div>

          {profileSuccessMsg && (
            <div className="action-feedback-notice">
              {profileSuccessMsg}
            </div>
          )}

          <div className="modal-actions-right">
            <Button type="button" variant="secondary" onClick={() => setIsProfileModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Profile Changes 💾
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
