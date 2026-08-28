import React, { useState } from 'react';
import { Store, ShieldCheck, Bell, Save } from 'lucide-react';
import Card from '../../../../components/Card/Card';
import Button from '../../../../components/Button/Button';
import './SettingsTab.css';

export default function SettingsTab() {
  const [restaurantName, setRestaurantName] = useState('Star Chef Bistro');
  const [tradeLicense, setTradeLicense] = useState('TRD-8849-DHAKA');
  const [address, setAddress] = useState('House 42, Road 11, Banani, Dhaka');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoFallback, setAutoFallback] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    alert('✅ Restaurant Settings & Safety Rules Saved Successfully!');
  };

  return (
    <div className="settings-tab">
      <div className="tab-header">
        <div>
          <h1 className="tab-title">Restaurant Profile & Safety Settings</h1>
          <p className="tab-sub">Manage trade verification credentials, default food safety rules, and alert channels.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-form-grid">
        {/* Profile Settings */}
        <Card hover={false} className="settings-card">
          <div className="card-header-row">
            <Store className="icon-emerald" size={20} />
            <h3 className="card-title">Restaurant Credentials</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Restaurant Business Name</label>
            <input
              type="text"
              className="form-input"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Trade License Number</label>
            <input
              type="text"
              className="form-input"
              value={tradeLicense}
              onChange={(e) => setTradeLicense(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Pickup Address</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </Card>

        {/* Safety & Alert Preferences */}
        <Card hover={false} className="settings-card">
          <div className="card-header-row">
            <ShieldCheck className="icon-orange" size={20} />
            <h3 className="card-title">Food Safety & Dispatch Rules</h3>
          </div>

          <div className="setting-toggle-row">
            <div>
              <span className="toggle-label">15-Minute Fallback Auto Switch</span>
              <span className="toggle-sub">Automatically convert preferred NGO broadcasts to Open Broadcast after 15 mins.</span>
            </div>
            <input
              type="checkbox"
              checked={autoFallback}
              onChange={(e) => setAutoFallback(e.target.checked)}
            />
          </div>

          <div className="setting-toggle-row">
            <div>
              <span className="toggle-label">SMS Critical Expiry Alerts</span>
              <span className="toggle-sub">Receive instant SMS alerts when food has less than 30 mins remaining.</span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
            />
          </div>

          <div className="save-btn-row">
            <Button type="submit" variant="primary" size="lg" icon={Save}>
              Save Settings
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
