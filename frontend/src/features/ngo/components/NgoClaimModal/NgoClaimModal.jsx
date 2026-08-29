import React, { useState } from 'react';
import { Bike, Truck, CheckCircle2, ShieldCheck, Clock, MapPin, AlertCircle } from 'lucide-react';
import Modal from '../../../../components/Modal/Modal';
import Button from '../../../../components/Button/Button';
import './NgoClaimModal.css';

/**
 * NGO Claim Modal: Choose Transport Method (Volunteer Rider Dispatch vs Self Pickup)
 */
export default function NgoClaimModal({ isOpen, onClose, foodItem, onConfirmClaim }) {
  const [transportChoice, setTransportChoice] = useState('VOLUNTEER'); // 'VOLUNTEER' or 'SELF_PICKUP'

  if (!isOpen || !foodItem) return null;

  const handleConfirm = () => {
    onConfirmClaim({
      foodId: foodItem.id,
      transportChoice,
      claimedAt: new Date().toLocaleTimeString()
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="ngo-claim-modal">
      <div className="claim-modal-header">
        <div className="claim-header-badge">🤝 Free NGO Claim</div>
        <h2 className="claim-title">Confirm Food Rescue Claim</h2>
        <p className="claim-sub">Select how your shelter will collect this surplus food donation.</p>
      </div>

      {/* Selected Item Summary Card */}
      <div className="food-summary-box">
        <img src={foodItem.image} alt={foodItem.title} className="summary-food-img" />
        <div className="summary-food-info">
          <h4 className="summary-title">{foodItem.title}</h4>
          <span className="summary-donor">🏪 {foodItem.donor} ({foodItem.distance})</span>
          <div className="summary-meta-chips">
            <span className="summary-chip feed-chip">👨‍👩‍👧‍👦 {foodItem.beneficiaries}</span>
            <span className="summary-chip expiry-chip">🔥 {foodItem.expiry}</span>
          </div>
        </div>
      </div>

      {/* Choice Selector Section */}
      <div className="transport-selection-section">
        <h4 className="selection-label">Select Transportation Method:</h4>

        <div className="transport-options-grid">
          {/* Choice A: Volunteer Rider Dispatch */}
          <div
            className={`transport-card ${transportChoice === 'VOLUNTEER' ? 'transport-selected' : ''}`}
            onClick={() => setTransportChoice('VOLUNTEER')}
          >
            <div className="option-radio-circle">
              {transportChoice === 'VOLUNTEER' && <span className="inner-dot"></span>}
            </div>
            <div className="transport-icon-box volunteer-bg">
              <Bike size={24} />
            </div>
            <div className="transport-details">
              <h4 className="option-title">🛵 Dispatch Volunteer Rider</h4>
              <p className="option-desc">Broadcast to nearby volunteer bike riders for free pickup & delivery.</p>
              <span className="option-badge green-badge">Recommended • Free Delivery</span>
            </div>
          </div>

          {/* Choice B: Self Pickup by NGO Van */}
          <div
            className={`transport-card ${transportChoice === 'SELF_PICKUP' ? 'transport-selected' : ''}`}
            onClick={() => setTransportChoice('SELF_PICKUP')}
          >
            <div className="option-radio-circle">
              {transportChoice === 'SELF_PICKUP' && <span className="inner-dot"></span>}
            </div>
            <div className="transport-icon-box self-bg">
              <Truck size={24} />
            </div>
            <div className="transport-details">
              <h4 className="option-title">🚚 Self Pickup by NGO Vehicle</h4>
              <p className="option-desc">Our NGO team will send our own van/vehicle directly to restaurant.</p>
              <span className="option-badge orange-badge">Direct Pickup • 15m Arrival</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="claim-modal-actions">
        <Button variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" size="md" icon={CheckCircle2} onClick={handleConfirm}>
          Confirm & Claim Food
        </Button>
      </div>
    </Modal>
  );
}
