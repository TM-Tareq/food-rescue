import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  LayoutDashboard, 
  Package, 
  Truck, 
  BarChart3, 
  Settings, 
  Bell, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  HelpCircle,
  Radio,
  Sparkles,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Badge from '../../components/Badge/Badge';
import DispatchOptionModal from './components/DispatchOptionModal/DispatchOptionModal';
import ActiveListingsTab from './components/ActiveListingsTab/ActiveListingsTab';
import LogisticsRescueTab from './components/LogisticsRescueTab/LogisticsRescueTab';
import ImpactAnalyticsTab from './components/ImpactAnalyticsTab/ImpactAnalyticsTab';
import SettingsTab from './components/SettingsTab/SettingsTab';
import AiFoodSafetyScannerModal from './components/AiFoodSafetyScannerModal/AiFoodSafetyScannerModal';
import LiveCountdownBadge from '../../components/LiveCountdownBadge/LiveCountdownBadge';
import FoodLifecycleTimeline from '../../components/FoodLifecycleTimeline/FoodLifecycleTimeline';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { surplusService, getItemLogisticsStatus } from '../../services/surplusService';
import './RestaurantDashboard.css';

export default function RestaurantDashboard({ onLogout }) {
  const { logout } = useAuth();
  const { roleThemes, toggleRoleTheme } = useTheme();
  const themeMode = roleThemes.restaurant;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isAiScannerOpen, setIsAiScannerOpen] = useState(false);
  const [selectedItemForDispatch, setSelectedItemForDispatch] = useState(null);

  // Active listings data state & live clock for logistics sync
  const [activeListingsData, setActiveListingsData] = useState([]);
  const [now, setNow] = useState(Date.now());

  // Fetch live active listings from surplusService on mount and on update events
  useEffect(() => {
    async function fetchListings() {
      const listings = await surplusService.getActiveListings();
      setActiveListingsData(listings);
    }
    fetchListings();

    const timer = setInterval(() => setNow(Date.now()), 1000);

    const handleSurplusUpdated = () => {
      fetchListings();
    };

    window.addEventListener('foodrescue_surplus_updated', handleSurplusUpdated);
    return () => {
      clearInterval(timer);
      window.removeEventListener('foodrescue_surplus_updated', handleSurplusUpdated);
    };
  }, []);

  const handleOpenDispatch = (item = null) => {
    setSelectedItemForDispatch(item);
    setIsDispatchModalOpen(true);
  };

  const handleAiListingApproved = (newListing) => {
    setActiveListingsData(prev => {
      if (prev.some(item => item.id === newListing.id)) return prev;
      return [newListing, ...prev];
    });
  };


  return (
    <div className={`dashboard-root theme-${themeMode}`}>
      {/* 1. Clean Light Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <div className="logo-icon-box">
              <Leaf size={22} />
            </div>
            <div className="logo-meta">
              <span className="logo-name">Food<span className="logo-accent">Rescue</span></span>
              <span className="logo-sub">Partner</span>
            </div>
          </div>

          <div className="donor-verified-badge">
            <CheckCircle2 size={16} />
            <span>Star Chef Bistro - Verified</span>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'nav-active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'inventory' ? 'nav-active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <Package size={18} />
              <span>Active Listings</span>
              <span className="nav-badge">2</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'logistics' ? 'nav-active' : ''}`}
              onClick={() => setActiveTab('logistics')}
            >
              <Truck size={18} />
              <span>Logistics & Rescue</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'analytics' ? 'nav-active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 size={18} />
              <span>Impact Analytics</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'settings' ? 'nav-active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <Button
            variant="outline"
            fullWidth
            icon={Radio}
            className="btn-dispatch-options"
            onClick={() => handleOpenDispatch(null)}
          >
            Dispatch & Broadcast Options
          </Button>

          <a href="#help" className="help-link">
            <HelpCircle size={16} />
            <span>Help Center</span>
          </a>

          <button 
            className="sidebar-logout-btn"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              width: '100%', 
              padding: '10px 14px', 
              borderRadius: '8px', 
              background: 'rgba(239, 68, 68, 0.08)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              color: '#dc2626', 
              fontWeight: 600, 
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginTop: '12px'
            }}
            onClick={() => {
              logout();
              if (onLogout) onLogout();
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Dynamic Main Content View based on Active Tab */}
      <main className="dashboard-main">
        {/* Persistent Top Header */}
        <header className="dashboard-header">
          <div>
            <h1 className="header-greeting">Welcome back, Chef Bistro 👋</h1>
            <p className="header-date">Friday, August 28, 2026 • Banani Zone</p>
          </div>

          <div className="header-actions">
            <button 
              className="theme-switch-btn"
              onClick={() => toggleRoleTheme('restaurant')}
              title="Toggle Light / Dark Mode"
            >
              {themeMode === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#059669" />}
              <span>{themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button 
              className="theme-switch-btn"
              onClick={() => {
                logout();
                if (onLogout) onLogout();
              }}
              style={{ borderColor: '#ef4444', color: '#dc2626' }}
              title="Sign Out of Account"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>

            <button className="icon-notification-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            <div className="user-profile-avatar">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=100&q=80"
                alt="Chef Avatar"
              />
            </div>

            <Button
              variant="outline"
              icon={Sparkles}
              onClick={() => setIsAiScannerOpen(true)}
              style={{ borderColor: '#059669', color: '#047857' }}
            >
              🤖 AI Hygiene & Photo Audit
            </Button>

            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setIsAiScannerOpen(true)}
            >
              Post Surplus Food
            </Button>
          </div>
        </header>

        {/* Render Tab Views */}
        {activeTab === 'dashboard' && (
          <>

            {/* KPI Metrics Summary Row */}
            <div className="kpi-grid">
              <Card hover={true} className="kpi-card">
                <div className="kpi-header">
                  <span className="kpi-icon icon-green"><Package size={20} /></span>
                  <span className="kpi-trend">+12%</span>
                </div>
                <div className="kpi-body">
                  <span className="kpi-value">45 Meals</span>
                  <span className="kpi-label">Rescued Today</span>
                  <span className="kpi-sub">18 kg of high-quality food</span>
                </div>
              </Card>

              <Card hover={true} className="kpi-card">
                <div className="kpi-header">
                  <span className="kpi-icon icon-emerald"><Leaf size={20} /></span>
                </div>
                <div className="kpi-body">
                  <span className="kpi-value">৳ 3,400</span>
                  <span className="kpi-label">Revenue Saved</span>
                  <span className="kpi-sub">Estimated waste offset</span>
                </div>
              </Card>

              <Card hover={true} className="kpi-card">
                <div className="kpi-header">
                  <span className="kpi-icon icon-orange"><Clock size={20} /></span>
                  <span className="kpi-dot"></span>
                </div>
                <div className="kpi-body">
                  <span className="kpi-value">2 Posts Live</span>
                  <span className="kpi-label">Active Listings</span>
                  <span className="kpi-sub">Awaiting pickup/matching</span>
                </div>
              </Card>

              <Card hover={true} className="kpi-card card-gold">
                <div className="kpi-header">
                  <span className="kpi-icon icon-gold">⭐</span>
                </div>
                <div className="kpi-body">
                  <span className="kpi-value">4.9 / 5.0</span>
                  <span className="kpi-label">Sustainability Rating</span>
                  <span className="kpi-sub gold-text">🎖 Gold Donor Status</span>
                </div>
              </Card>
            </div>

            {/* Dashboard Split Content Area */}
            <div className="dashboard-grid-split">
              {/* Left Table Section */}
              <div className="listings-section">
                <div className="listings-header">
                  <h2 className="section-title">Active Surplus Food Listings</h2>
                </div>

                <Card hover={false} className="table-card">
                  <table className="listings-table">
                    <thead>
                      <tr>
                        <th>ITEM</th>
                        <th>QUANTITY & STATE</th>
                        <th>TIME CRITICALITY</th>
                        <th>LOGISTICS STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeListingsData.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="item-cell">
                              <img src={item.image} alt={item.name} className="item-thumb" />
                              <div>
                                <span className="item-name">{item.name}</span>
                                <span className="item-sub">{item.sub}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="quantity-cell">
                              <span className="qty-value">{item.quantity}</span>
                              <span className="qty-badge">{item.temp}</span>
                            </div>
                          </td>
                          <td>
                            <LiveCountdownBadge 
                              expiresAt={item.expiresAt} 
                              ngoPriorityUntil={item.ngoPriorityUntil}
                              defaultExpiry={item.expiry} 
                              badgeTheme={true}
                            />
                            <FoodLifecycleTimeline 
                              expiresAt={item.expiresAt}
                              ngoPriorityUntil={item.ngoPriorityUntil}
                              createdAt={item.createdAt}
                              aiScore={item.aiScore || 100}
                              compact={true}
                            />
                          </td>
                          <td>
                            {(() => {
                              const dynStatus = getItemLogisticsStatus(item, now);
                              return (
                                <div className="status-cell">
                                  <span className={`status-pill ${dynStatus.pillClass}`}>
                                    {dynStatus.isSuccess ? <Truck size={14} /> : <Clock size={14} />} {dynStatus.label}
                                  </span>
                                </div>
                              );
                            })()}
                          </td>
                          <td>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDispatch(item)}
                            >
                              Dispatch Options
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>

              {/* Right Side Panel */}
              <div className="side-panel-section">
                <div className="action-required-card">
                  <AlertTriangle size={22} className="alert-icon" />
                  <div>
                    <h4 className="alert-title">Action Required</h4>
                    <p className="alert-desc">
                      1 item requires pickup within 45 mins to ensure food safety standards.
                    </p>
                  </div>
                </div>

                <div className="activity-feed-card">
                  <h3 className="feed-title">Live Rescue Tracker</h3>
                  <div className="activity-timeline">
                    <div className="timeline-item">
                      <div className="timeline-dot green-dot"></div>
                      <div className="timeline-content">
                        <span className="timeline-time">12 mins ago</span>
                        <p className="timeline-text">
                          <strong>Anjuman Orphanage</strong> accepted 10 portions of Mixed Rice.
                        </p>
                      </div>
                    </div>

                    <div className="timeline-item">
                      <div className="timeline-dot gray-dot"></div>
                      <div className="timeline-content">
                        <span className="timeline-time">45 mins ago</span>
                        <p className="timeline-text">
                          New surplus posted: Assorted Pastries (15 Packs).
                        </p>
                      </div>
                    </div>

                    <div className="timeline-item">
                      <div className="timeline-dot check-dot"></div>
                      <div className="timeline-content">
                        <span className="timeline-time">Yesterday, 9:30 PM</span>
                        <p className="timeline-text">
                          Delivery completed to City Mission Shelter.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Render Active Listings Tab */}
        {activeTab === 'inventory' && <ActiveListingsTab onOpenDispatch={handleOpenDispatch} listings={activeListingsData} />}


        {/* Render Logistics & Rescue Tab */}
        {activeTab === 'logistics' && <LogisticsRescueTab />}

        {/* Render Impact Analytics Tab */}
        {activeTab === 'analytics' && <ImpactAnalyticsTab />}

        {/* Render Settings Tab */}
        {activeTab === 'settings' && <SettingsTab />}
      </main>

      {/* Dispatch Choice Modal */}
      <DispatchOptionModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        selectedItem={selectedItemForDispatch}
      />

      {/* AI Food Safety & Thermal Packaging Vision Inspection Modal */}
      <AiFoodSafetyScannerModal
        isOpen={isAiScannerOpen}
        onClose={() => setIsAiScannerOpen(false)}
        onListingApproved={handleAiListingApproved}
      />
    </div>
  );
}
