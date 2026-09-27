import React, { useState, useEffect } from 'react';
import { 
  Activity, CheckCircle2, Clock, MapPin, Truck, ShieldCheck, 
  Store, Building2, User, ArrowRight, Search, Filter, RefreshCw, 
  Sparkles, AlertTriangle, Eye, Navigation, Award, Leaf, Key, Trash2
} from 'lucide-react';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import Modal from '../../../../components/Modal/Modal';
import { supplyChainService } from '../../../../services/supplyChainService';
import './LiveSupplyChainTab.css';

export default function LiveSupplyChainTab() {
  const [foodBatches, setFoodBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Admin OTP Verification Form State
  const [otpInput, setOtpInput] = useState('');
  const [otpNotice, setOtpNotice] = useState(null);

  const loadBatches = () => {
    const data = supplyChainService.getBatches();
    setFoodBatches(data);
    if (selectedBatch) {
      const updated = data.find(b => b.id === selectedBatch.id);
      if (updated) setSelectedBatch(updated);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const handleOpenTracker = (batch) => {
    setSelectedBatch(batch);
    setOtpInput('');
    setOtpNotice(null);
    setIsTimelineModalOpen(true);
  };

  const handleVerifyOtpAdmin = (e, otpType) => {
    e.preventDefault();
    setOtpNotice(null);
    try {
      let res;
      if (otpType === 'PICKUP') {
        res = supplyChainService.verifyPickupOtp(selectedBatch.id, otpInput);
      } else {
        res = supplyChainService.verifyDeliveryOtp(selectedBatch.id, otpInput);
      }
      setOtpNotice({ type: 'success', text: res.message });
      setOtpInput('');
      loadBatches();
    } catch (err) {
      setOtpNotice({ type: 'error', text: err.message });
    }
  };

  const filteredBatches = foodBatches.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.recipient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter || item.deliveryMode === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStageLabel = (stage, mode) => {
    if (mode === 'NGO_SELF_PICKUP' && stage === 5) return '5. Self-Pickup Handover Completed';
    switch (stage) {
      case 1: return '1. Listed & AI Audited';
      case 2: return '2. Allocated (NGO / Consumer)';
      case 3: return '3. Rider Pickup Verified';
      case 4: return '4. In Transit GPS';
      case 5: return '5. Handover Completed';
      default: return 'Processing';
    }
  };

  return (
    <div className="tab-pane-supply-chain">
      {/* 1. TOP LIVE SUPPLY CHAIN METRICS */}
      <div className="supply-chain-stats-grid">
        <div className="sc-stat-card gradient-emerald">
          <div className="stat-icon-box"><Activity size={22} /></div>
          <div>
            <span className="stat-card-title">ACTIVE SUPPLY CHAIN BATCHES</span>
            <span className="stat-card-num">{foodBatches.length} Active Batches</span>
            <span className="stat-card-sub">📍 Dhaka Metropolitan Area</span>
          </div>
        </div>

        <div className="sc-stat-card gradient-blue">
          <div className="stat-icon-box"><Building2 size={22} /></div>
          <div>
            <span className="stat-card-title">NGO FREE DONATED PORTIONS</span>
            <span className="stat-card-num">125 Meals Claimed</span>
            <span className="stat-card-sub">🏠 Tier 1 Free Shelter Allocation</span>
          </div>
        </div>

        <div className="sc-stat-card gradient-purple">
          <div className="stat-icon-box"><Truck size={22} /></div>
          <div>
            <span className="stat-card-title">LIVE GPS TRANSIT RIDERS</span>
            <span className="stat-card-num">3 Hero Riders En-Route</span>
            <span className="stat-card-sub">🛵 Real-Time OpenStreetMap Tracking</span>
          </div>
        </div>

        <div className="sc-stat-card gradient-amber">
          <div className="stat-icon-box"><Leaf size={22} /></div>
          <div>
            <span className="stat-card-title">SAVED CO₂ EMISSIONS TODAY</span>
            <span className="stat-card-num">139.4 KG CO₂ Reduced</span>
            <span className="stat-card-sub">🌱 93.0 KG Surplus Food Rescued</span>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROL TOOLBAR */}
      <div className="sc-toolbar-container">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by Food Batch ID, Restaurant Name, or NGO Destination..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sc-search-input"
          />
        </div>

        <div className="filter-button-group">
          <button 
            className={`filter-tab-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All Batches ({foodBatches.length})
          </button>
          <button 
            className={`filter-tab-btn ${statusFilter === 'NGO_SELF_PICKUP' ? 'active' : ''}`}
            onClick={() => setStatusFilter('NGO_SELF_PICKUP')}
          >
            🏠 NGO Self-Pickup ({foodBatches.filter(b => b.deliveryMode === 'NGO_SELF_PICKUP').length})
          </button>
          <button 
            className={`filter-tab-btn ${statusFilter === 'IN_TRANSIT' ? 'active' : ''}`}
            onClick={() => setStatusFilter('IN_TRANSIT')}
          >
            🚚 In Transit ({foodBatches.filter(b => b.status === 'IN_TRANSIT').length})
          </button>
          <button 
            className={`filter-tab-btn ${statusFilter === 'DELIVERED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('DELIVERED')}
          >
            ✅ Delivered ({foodBatches.filter(b => b.status === 'DELIVERED').length})
          </button>
        </div>
      </div>

      {/* 3. MASTER SUPPLY CHAIN RADAR TABLE */}
      <div className="admin-table-container">
        <div className="table-header-title">
          <div>
            <h4>📡 Real-Time Food Supply Chain Radar (Multi-Party OTP Active)</h4>
            <p className="table-sub-text">Monitor every food batch with multi-party OTP visibility and auto-removal upon completion.</p>
          </div>
          <span className="live-pulse">● LIVE DATABASE RADAR SYNC</span>
        </div>

        <table className="admin-master-table">
          <thead>
            <tr>
              <th>BATCH ID</th>
              <th>FOOD ITEM & DONOR</th>
              <th>DELIVERY MODE</th>
              <th>RECIPIENT & DESTINATION</th>
              <th>LIVE OTP STATUS</th>
              <th>CURRENT STAGE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatches.map((batch) => (
              <tr key={batch.id}>
                <td>
                  <strong className="batch-id-text">{batch.id}</strong>
                  <span className="category-pill">{batch.category}</span>
                </td>
                <td>
                  <div className="food-info-cell">
                    <strong className="food-title">{batch.title}</strong>
                    <span className="donor-sub">🏪 {batch.restaurant} ({batch.restaurantAddress})</span>
                  </div>
                </td>
                <td>
                  {batch.deliveryMode === 'NGO_SELF_PICKUP' ? (
                    <span className="delivery-mode-tag self-pickup">
                      🏠 NGO Self-Pickup
                    </span>
                  ) : (
                    <span className="delivery-mode-tag rider-delivery">
                      🛵 Hero Rider Delivery
                    </span>
                  )}
                </td>
                <td>
                  <div className="recipient-cell">
                    <strong>{batch.recipient}</strong>
                    <span className="time-sub">⏰ Prep: {batch.prepTime} • Exp: {batch.expiryTime}</span>
                  </div>
                </td>
                <td>
                  <div className="otp-status-cell-stack">
                    {/* Pickup OTP Status */}
                    <div className="otp-pill-box">
                      <span className="otp-label">Kitchen Pickup:</span>
                      {batch.pickupOtpVerified ? (
                        <span className="otp-badge-confirmed">
                          <CheckCircle2 size={12} /> Pickup Confirmed
                        </span>
                      ) : (
                        <span className="otp-badge-active">
                          🔑 OTP: <strong>{batch.pickupOtp}</strong>
                        </span>
                      )}
                    </div>

                    {/* Delivery OTP Status */}
                    <div className="otp-pill-box">
                      <span className="otp-label">Doorstep Handover:</span>
                      {batch.deliveryOtpVerified ? (
                        <span className="otp-badge-confirmed">
                          <CheckCircle2 size={12} /> Handover Confirmed
                        </span>
                      ) : batch.deliveryOtp ? (
                        <span className="otp-badge-active green-otp">
                          🔑 OTP: <strong>{batch.deliveryOtp}</strong>
                        </span>
                      ) : (
                        <span className="otp-badge-pending">Pending Allocation</span>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="stage-cell-box">
                    <div className="stage-progress-bar">
                      <div className="stage-progress-fill" style={{ width: `${(batch.currentStage / 5) * 100}%` }}></div>
                    </div>
                    <span className={`stage-status-badge status-${batch.status.toLowerCase()}`}>
                      {getStageLabel(batch.currentStage, batch.deliveryMode)}
                    </span>
                  </div>
                </td>
                <td>
                  <Button 
                    size="sm" 
                    variant="primary" 
                    icon={Eye}
                    onClick={() => handleOpenTracker(batch)}
                  >
                    📡 Track Full Chain
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. MODAL: FULL SUPPLY CHAIN LIVE RADAR TIMELINE WITH OTP CONTROLS */}
      <Modal 
        isOpen={isTimelineModalOpen} 
        onClose={() => setIsTimelineModalOpen(false)}
        title={`📡 Live Supply Chain Lifecycle Radar — ${selectedBatch?.id}`}
      >
        {selectedBatch && (
          <div className="supply-chain-modal-content">
            {/* BATCH HEADER SUMMARY */}
            <div className="batch-modal-header-card">
              <div className="batch-header-main">
                <div>
                  <span className="batch-modal-badge">{selectedBatch.id} • {selectedBatch.category}</span>
                  <h3 className="batch-modal-title">{selectedBatch.title}</h3>
                  <p className="batch-modal-donor">🏪 <strong>{selectedBatch.restaurant}</strong> • {selectedBatch.restaurantAddress}</p>
                </div>
                <div className="batch-impact-box">
                  <span className="impact-tag"><Leaf size={14} /> {selectedBatch.foodSavedKg} KG Food Saved</span>
                  <span className="impact-tag green"><Award size={14} /> {selectedBatch.co2SavedKg} KG CO₂ Reduced</span>
                </div>
              </div>
            </div>

            {/* MULTI-PARTY OTP VISIBILITY BANNER */}
            <div className="multi-party-otp-banner">
              <div className="otp-banner-header">
                <Key size={18} />
                <span>🔐 Multi-Party Real-Time OTP Visibility & Verification Engine</span>
              </div>
              <div className="otp-visibility-grid">
                <div className="otp-vis-card">
                  <span className="vis-role">🏪 Restaurant Owner Screen:</span>
                  <span className="vis-val">
                    {selectedBatch.pickupOtpVerified ? '✅ Kitchen Pickup Confirmed' : `🔑 Pickup OTP: ${selectedBatch.pickupOtp}`}
                  </span>
                </div>
                
                <div className="otp-vis-card">
                  <span className="vis-role">
                    {selectedBatch.deliveryMode === 'NGO_SELF_PICKUP' ? '🏠 NGO Self-Pickup Screen:' : selectedBatch.recipientType === 'NGO' ? '🏠 NGO Shelter Screen:' : '🛍️ Consumer Screen:'}
                  </span>
                  <span className="vis-val">
                    {selectedBatch.deliveryOtpVerified ? '✅ Handover Confirmed' : `🔑 Delivery OTP: ${selectedBatch.deliveryOtp}`}
                  </span>
                </div>
              </div>
            </div>

            {/* OTP VERIFICATION INTERACTIVE TESTER */}
            {(!selectedBatch.pickupOtpVerified || !selectedBatch.deliveryOtpVerified) && (
              <div className="admin-otp-tester-box">
                <h5>⚡ Test / Verify OTP Live (Super Admin Override Control)</h5>
                {otpNotice && (
                  <div className={`action-feedback-notice ${otpNotice.type}`}>
                    {otpNotice.text}
                  </div>
                )}
                
                <div className="otp-action-buttons-row">
                  {!selectedBatch.pickupOtpVerified && (
                    <form className="otp-mini-form" onSubmit={(e) => handleVerifyOtpAdmin(e, 'PICKUP')}>
                      <input 
                        type="text" 
                        maxLength={4}
                        placeholder={`Enter Kitchen Pickup OTP (${selectedBatch.pickupOtp})`}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="admin-otp-input"
                      />
                      <Button type="submit" size="sm" variant="primary">
                        Verify Kitchen Pickup 🔐
                      </Button>
                    </form>
                  )}

                  {selectedBatch.pickupOtpVerified && !selectedBatch.deliveryOtpVerified && (
                    <form className="otp-mini-form" onSubmit={(e) => handleVerifyOtpAdmin(e, 'DELIVERY')}>
                      <input 
                        type="text" 
                        maxLength={4}
                        placeholder={`Enter Delivery OTP (${selectedBatch.deliveryOtp})`}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="admin-otp-input"
                      />
                      <Button type="submit" size="sm" variant="primary">
                        Verify Doorstep Handover 🔐
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* 5-STEP VISUAL SUPPLY CHAIN TIMELINE PIPELINE */}
            <div className="sc-timeline-stepper">
              
              {/* STEP 1: LISTING & AI AUDIT */}
              <div className={`stepper-node ${selectedBatch.currentStage >= 1 ? 'completed' : ''}`}>
                <div className="node-icon-circle">
                  <Sparkles size={18} />
                </div>
                <div className="node-content">
                  <div className="node-header">
                    <h4>Step 1: Surplus Listing & AI Quality Audit</h4>
                    <span className="node-time">⏰ {selectedBatch.prepTime}</span>
                  </div>
                  <p>Food prepared and listed by {selectedBatch.restaurant}. Automated AI Hygiene Audit Completed.</p>
                  <div className="node-details-grid">
                    <span>✨ Hygiene Score: <strong>{selectedBatch.hygieneScore}%</strong></span>
                    <span>🏅 Quality Grade: <strong>{selectedBatch.aiGrade}</strong></span>
                    <span>🍱 Total Portions: <strong>{selectedBatch.portions} Packages</strong></span>
                    <span>⏳ Freshness Window: <strong>Valid until {selectedBatch.expiryTime}</strong></span>
                  </div>
                </div>
              </div>

              {/* STEP 2: NGO CLAIM / CONSUMER ORDER */}
              <div className={`stepper-node ${selectedBatch.currentStage >= 2 ? 'completed' : ''}`}>
                <div className="node-icon-circle">
                  <Building2 size={18} />
                </div>
                <div className="node-content">
                  <div className="node-header">
                    <h4>Step 2: Tier 1 NGO Allocation / Marketplace Checkout</h4>
                    <span className="node-time">⏰ {selectedBatch.pickupTime || '09:00 PM'}</span>
                  </div>
                  <p>Distributed via 2-Tier Dynamic Allocation system (Free NGO Allocation + Discounted Flash Sale).</p>
                  <div className="node-details-grid">
                    <span>🏠 Destination: <strong>{selectedBatch.recipient}</strong></span>
                    <span>🚘 Transport Mode: <strong>{selectedBatch.deliveryMode === 'NGO_SELF_PICKUP' ? 'NGO Self-Pickup Transport' : 'Volunteer Hero Rider'}</strong></span>
                    <span>🎁 Free Donated Portions: <strong>{selectedBatch.portionsClaimedNgo} Portions</strong></span>
                    <span>🛍️ Consumer Flash Portions: <strong>{selectedBatch.portionsSoldConsumer} Portions</strong></span>
                  </div>
                </div>
              </div>

              {/* STEP 3: PICKUP VERIFICATION & KITCHEN OTP */}
              <div className={`stepper-node ${selectedBatch.currentStage >= 3 ? 'completed' : ''}`}>
                <div className="node-icon-circle">
                  <Truck size={18} />
                </div>
                <div className="node-content">
                  <div className="node-header">
                    <h4>Step 3: Pickup Confirmation & Kitchen OTP Verification</h4>
                    <span className="node-time">⏰ {selectedBatch.pickupTime}</span>
                  </div>
                  <p>
                    {selectedBatch.deliveryMode === 'NGO_SELF_PICKUP' 
                      ? 'NGO representative arrived at kitchen. Verified Kitchen OTP and took handover.' 
                      : 'Rider dispatched to kitchen. Verified food container via encrypted OTP.'}
                  </p>
                  <div className="node-details-grid">
                    <span>🚚 Transport Vehicle: <strong>{selectedBatch.riderName} ({selectedBatch.riderPhone})</strong></span>
                    <span>🔐 Kitchen OTP Status: <strong>{selectedBatch.pickupOtpVerified ? 'Verified & Confirmed ✅' : `Active OTP: ${selectedBatch.pickupOtp}`}</strong></span>
                  </div>
                </div>
              </div>

              {/* STEP 4: GPS TRANSIT & LIVE ROUTE */}
              <div className={`stepper-node ${selectedBatch.currentStage >= 4 ? 'active-step' : selectedBatch.currentStage > 4 ? 'completed' : ''}`}>
                <div className="node-icon-circle">
                  <Navigation size={18} />
                </div>
                <div className="node-content">
                  <div className="node-header">
                    <h4>Step 4: Live OpenStreetMap GPS Transit Tracking</h4>
                    <span className="node-time">⏱️ {selectedBatch.eta}</span>
                  </div>
                  <p>
                    {selectedBatch.deliveryMode === 'NGO_SELF_PICKUP'
                      ? 'NGO own vehicle transporting food batch directly to shelter home.'
                      : 'Rider navigating Dhaka traffic to destination. Cold-chain safety monitor active.'}
                  </p>
                  <div className="node-details-grid">
                    <span>📍 Transit Route: <strong>{selectedBatch.restaurantAddress} ➔ {selectedBatch.recipient}</strong></span>
                    <span>📏 Distance: <strong>{selectedBatch.distanceKm}</strong></span>
                    <span>⚡ Status: <strong>{selectedBatch.eta}</strong></span>
                  </div>
                </div>
              </div>

              {/* STEP 5: HANDOVER & ESG IMPACT */}
              <div className={`stepper-node ${selectedBatch.currentStage >= 5 ? 'completed' : ''}`}>
                <div className="node-icon-circle">
                  <CheckCircle2 size={18} />
                </div>
                <div className="node-content">
                  <div className="node-header">
                    <h4>Step 5: Handover Completed & OTP Confirmation</h4>
                    <span className="node-time">⏰ {selectedBatch.deliveryTime || 'Completed'}</span>
                  </div>
                  <p>Food delivered to beneficiary. Verified via 4-digit recipient OTP or NGO self-pickup code.</p>
                  <div className="node-details-grid">
                    <span>🔑 Recipient OTP Status: <strong>{selectedBatch.deliveryOtpVerified ? 'Verified & Confirmed ✅' : `Active OTP: ${selectedBatch.deliveryOtp}`}</strong></span>
                    <span>🌱 ESG Carbon Impact: <strong>+{selectedBatch.co2SavedKg} KG CO₂ Reduced</strong></span>
                  </div>
                </div>
              </div>

            </div>

            <div className="modal-actions-right" style={{ marginTop: '20px' }}>
              <Button variant="secondary" onClick={() => setIsTimelineModalOpen(false)}>
                Close Supply Chain Radar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
