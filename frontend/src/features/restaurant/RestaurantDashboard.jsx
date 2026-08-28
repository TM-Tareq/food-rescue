import React, { useState } from 'react';
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
  Radio
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Badge from '../../components/Badge/Badge';
import DispatchOptionModal from './components/DispatchOptionModal/DispatchOptionModal';
import ActiveListingsTab from './components/ActiveListingsTab/ActiveListingsTab';
import LogisticsRescueTab from './components/LogisticsRescueTab/LogisticsRescueTab';
import ImpactAnalyticsTab from './components/ImpactAnalyticsTab/ImpactAnalyticsTab';
import SettingsTab from './components/SettingsTab/SettingsTab';
import './RestaurantDashboard.css';

export default function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedItemForDispatch, setSelectedItemForDispatch] = useState(null);

  // Mock listings
  const listings = [
    {
      id: 1,
      name: 'Spicy Chicken Biryani',
      sub: 'Cooked 1h ago',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80',
      quantity: '20 Portions',
      temp: 'Hot (60°C+)',
      expiry: 'Expires in 35m',
      expiryType: 'urgent',
      status: 'Volunteer En Route (Tanvir)',
      statusType: 'success'
    },
    {
      id: 2,
      name: 'Assorted Pastries Pkg',
      sub: 'Morning Bake',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80',
      quantity: '15 Packs',
      temp: 'Room Temp',
      expiry: 'Expires in 2h 10m',
      expiryType: 'warning',
      status: 'Matching NGO...',
      statusType: 'pending'
    }
  ];

  const handleOpenDispatch = (item = null) => {
    setSelectedItemForDispatch(item);
    setIsDispatchModalOpen(true);
  };

  return (
    <div className="dashboard-root">
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
        </div>
      </aside>

      {/* 2. Dynamic Main Content View based on Active Tab */}
      <main className="dashboard-main">
        {/* Render Tab Views */}
        {activeTab === 'dashboard' && (
          <>
            {/* Top Header */}
            <header className="dashboard-header">
              <div>
                <h1 className="header-greeting">Welcome back, Chef Bistro 👋</h1>
                <p className="header-date">Friday, August 28, 2026</p>
              </div>

              <div className="header-actions">
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
                  variant="primary"
                  icon={Plus}
                  onClick={() => handleOpenDispatch(null)}
                >
                  Post Surplus Food
                </Button>
              </div>
            </header>

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
                      {listings.map((item) => (
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
                            {item.expiryType === 'urgent' ? (
                              <Badge theme="flash">🔥 {item.expiry}</Badge>
                            ) : (
                              <Badge theme="fresh">⏳ {item.expiry}</Badge>
                            )}
                          </td>
                          <td>
                            <div className="status-cell">
                              {item.statusType === 'success' ? (
                                <span className="status-pill status-success">
                                  <Truck size={14} /> {item.status}
                                </span>
                              ) : (
                                <span className="status-pill status-pending">
                                  <Clock size={14} /> {item.status}
                                </span>
                              )}
                            </div>
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
        {activeTab === 'inventory' && <ActiveListingsTab onOpenDispatch={handleOpenDispatch} />}

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
    </div>
  );
}
