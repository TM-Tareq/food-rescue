import React, { useState } from 'react';
import { 
  Building2, Users, ShieldCheck, Bell, Smartphone, Mail, Truck, 
  Check, Save, Sparkles, MapPin, CheckCircle2, AlertTriangle
} from 'lucide-react';
import Card from '../../../../components/Card/Card';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import './NgoSettingsTab.css';

export default function NgoSettingsTab() {
  const [isSaved, setIsSaved] = useState(false);
  const [shelterName, setShelterName] = useState('Anjuman Orphanage & Children Shelter');
  const [regNumber, setRegNumber] = useState('NGO-REG-2024-8842');
  const [beneficiaryCapacity, setBeneficiaryCapacity] = useState('120');
  const [address, setAddress] = useState('House 42, Road 11, Block D, Bashundhara R/A, Dhaka');
  const [managerPhone, setManagerPhone] = useState('+880 1712-345678');
  const [managerEmail, setManagerEmail] = useState('shelter.manager@anjuman-ngo.org');

  // Preferences Toggles
  const [halalOnly, setHalalOnly] = useState(true);
  const [vegOption, setVegOption] = useState(true);
  const [hotFoodPriority, setHotFoodPriority] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [defaultTransport, setDefaultTransport] = useState('VOLUNTEER_RIDER');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="ngo-settings-tab">
      {/* Header */}
      <div className="tab-header">
        <div>
          <h1 className="tab-title">NGO Shelter Settings & Preferences</h1>
          <p className="tab-sub">Manage beneficiary capacity, dietary requirements, and automated rescue notification rules.</p>
        </div>
        <Badge theme="ngo">
          <ShieldCheck size={14} /> Tier-1 Verified Shelter
        </Badge>
      </div>

      <form onSubmit={handleSaveSettings} className="settings-form-layout">
        {/* SECTION 1: SHELTER PROFILE & CAPACITY */}
        <Card hover={false} className="settings-card">
          <div className="card-section-header">
            <Building2 size={20} className="text-emerald" />
            <div>
              <h2 className="card-section-title">Shelter Profile & Capacity Manager</h2>
              <p className="card-section-sub">Official shelter credentials and beneficiary intake numbers.</p>
            </div>
          </div>

          <div className="form-grid-2col">
            <div className="form-group">
              <label className="form-label">Shelter Official Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={shelterName} 
                onChange={(e) => setShelterName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">NGO Registration License #</label>
              <input 
                type="text" 
                className="form-input" 
                value={regNumber} 
                onChange={(e) => setRegNumber(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Beneficiary Intake Capacity (Children/Residents)</label>
              <div className="input-icon-wrap">
                <Users size={16} className="input-icon" />
                <input 
                  type="number" 
                  className="form-input with-icon" 
                  value={beneficiaryCapacity} 
                  onChange={(e) => setBeneficiaryCapacity(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Shelter Physical Address</label>
              <div className="input-icon-wrap">
                <MapPin size={16} className="input-icon" />
                <input 
                  type="text" 
                  className="form-input with-icon" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  required 
                />
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 2: DIETARY & FOOD SAFETY PREFERENCES */}
        <Card hover={false} className="settings-card">
          <div className="card-section-header">
            <ShieldCheck size={20} className="text-emerald" />
            <div>
              <h2 className="card-section-title">Dietary Requirements & Safety Toggles</h2>
              <p className="card-section-sub">Filter incoming restaurant surplus food based on your shelter's dietary rules.</p>
            </div>
          </div>

          <div className="toggles-list">
            <div className="toggle-row-item">
              <div>
                <strong className="toggle-title">🌙 Strict Halal Certification Required</strong>
                <p className="toggle-sub">Only accept surplus food certified 100% Halal by donor restaurants.</p>
              </div>
              <label className="switch-toggle">
                <input 
                  type="checkbox" 
                  checked={halalOnly} 
                  onChange={(e) => setHalalOnly(e.target.checked)} 
                />
                <span className="slider-round"></span>
              </label>
            </div>

            <div className="toggle-row-item">
              <div>
                <strong className="toggle-title">🥗 Vegetarian & Bakery Surplus Options</strong>
                <p className="toggle-sub">Accept non-meat bakery goods, vegetable curries, and fruit baskets.</p>
              </div>
              <label className="switch-toggle">
                <input 
                  type="checkbox" 
                  checked={vegOption} 
                  onChange={(e) => setVegOption(e.target.checked)} 
                />
                <span className="slider-round"></span>
              </label>
            </div>

            <div className="toggle-row-item">
              <div>
                <strong className="toggle-title">🌡️ Hot Cooked Meal Priority (60°C+)</strong>
                <p className="toggle-sub">Prioritize freshly sealed hot meals with thermal insulation packaging.</p>
              </div>
              <label className="switch-toggle">
                <input 
                  type="checkbox" 
                  checked={hotFoodPriority} 
                  onChange={(e) => setHotFoodPriority(e.target.checked)} 
                />
                <span className="slider-round"></span>
              </label>
            </div>
          </div>
        </Card>

        {/* SECTION 3: AUTOMATED RESCUE ALERTS & DEFAULT TRANSPORT */}
        <Card hover={false} className="settings-card">
          <div className="card-section-header">
            <Bell size={20} className="text-emerald" />
            <div>
              <h2 className="card-section-title">Automated Rescue Alert Rules & Transport Choice</h2>
              <p className="card-section-sub">Configure real-time SMS notifications and default pickup preferences.</p>
            </div>
          </div>

          <div className="form-grid-2col mb-4">
            <div className="form-group">
              <label className="form-label">Manager SMS Notification Phone</label>
              <div className="input-icon-wrap">
                <Smartphone size={16} className="input-icon" />
                <input 
                  type="text" 
                  className="form-input with-icon" 
                  value={managerPhone} 
                  onChange={(e) => setManagerPhone(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Manager Official Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input 
                  type="email" 
                  className="form-input with-icon" 
                  value={managerEmail} 
                  onChange={(e) => setManagerEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="toggles-list">
            <div className="toggle-row-item">
              <div>
                <strong className="toggle-title">📱 Instant SMS Alerts for Nearby Food Postings</strong>
                <p className="toggle-sub">Receive instant SMS on phone (+8801712345678) when new food within 5 km is posted.</p>
              </div>
              <label className="switch-toggle">
                <input 
                  type="checkbox" 
                  checked={smsAlerts} 
                  onChange={(e) => setSmsAlerts(e.target.checked)} 
                />
                <span className="slider-round"></span>
              </label>
            </div>

            <div className="toggle-row-item">
              <div>
                <strong className="toggle-title">📧 Daily Impact Digest & Receipt Emails</strong>
                <p className="toggle-sub">Receive email summaries of daily rescued meals and completed digital receipts.</p>
              </div>
              <label className="switch-toggle">
                <input 
                  type="checkbox" 
                  checked={emailDigest} 
                  onChange={(e) => setEmailDigest(e.target.checked)} 
                />
                <span className="slider-round"></span>
              </label>
            </div>
          </div>

          {/* Transport Choice Radio Cards */}
          <div className="transport-choice-section mt-4">
            <label className="form-label">Default Rescue Transport Preference</label>
            <div className="transport-radio-grid">
              <label className={`transport-radio-card ${defaultTransport === 'VOLUNTEER_RIDER' ? 'active-radio' : ''}`}>
                <input 
                  type="radio" 
                  name="transport" 
                  value="VOLUNTEER_RIDER" 
                  checked={defaultTransport === 'VOLUNTEER_RIDER'}
                  onChange={() => setDefaultTransport('VOLUNTEER_RIDER')}
                />
                <div className="radio-card-content">
                  <strong className="radio-title">🛵 Request Volunteer Rider</strong>
                  <p className="radio-sub">Dispatch nearby verified volunteer motorbikes for quick pickups.</p>
                </div>
              </label>

              <label className={`transport-radio-card ${defaultTransport === 'NGO_VAN' ? 'active-radio' : ''}`}>
                <input 
                  type="radio" 
                  name="transport" 
                  value="NGO_VAN" 
                  checked={defaultTransport === 'NGO_VAN'}
                  onChange={() => setDefaultTransport('NGO_VAN')}
                />
                <div className="radio-card-content">
                  <strong className="radio-title">🚚 NGO Self Pickup Van</strong>
                  <p className="radio-sub">Use shelter's own pickup van for large food batches (50+ portions).</p>
                </div>
              </label>
            </div>
          </div>
        </Card>

        {/* SAVE BUTTON & CONFIRMATION */}
        <div className="save-bar-row">
          {isSaved && (
            <div className="save-success-pill">
              <CheckCircle2 size={16} /> Shelter Preferences Saved Successfully!
            </div>
          )}
          <Button
            type="submit"
            variant="emerald"
            size="lg"
            icon={Save}
            className="save-settings-btn"
          >
            💾 Save Shelter Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
