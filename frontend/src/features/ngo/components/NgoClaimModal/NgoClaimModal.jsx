import React, { useState } from 'react';
import { Bike, Truck, CheckCircle2, ShieldCheck, Clock, MapPin, AlertCircle } from 'lucide-react';
import Modal from '../../../../components/Modal/Modal';
import Button from '../../../../components/Button/Button';
import { ngoService } from '../../../../services/ngoService';
import { supplyChainService } from '../../../../services/supplyChainService';
import { surplusService } from '../../../../services/surplusService';
import './NgoClaimModal.css';

/**
 * NGO Claim Modal: Choose Transport Method (Volunteer Rider Dispatch vs Self Pickup)
 */
export default function NgoClaimModal({ isOpen, onClose, foodItem, onConfirmClaim }) {
  const [transportChoice, setTransportChoice] = useState('VOLUNTEER'); // 'VOLUNTEER' or 'SELF_PICKUP'

  if (!isOpen || !foodItem) return null;

  const getModalExpiryDisplay = (item) => {
    const parseTarget = (val) => {
      if (!val) return null;
      if (typeof val === 'number') return val;
      const parsed = new Date(val).getTime();
      return isNaN(parsed) ? null : parsed;
    };
    const now = Date.now();
    const ngoEndMs = parseTarget(item.ngoEndAt || item.ngoPriorityUntil);
    const expiresAtMs = parseTarget(item.expiresAt || item.consumerEndAt);

    if (ngoEndMs && now < ngoEndMs) {
      const diffMs = ngoEndMs - now;
      const mins = Math.max(0, Math.ceil(diffMs / 60000));
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return hrs > 0 ? `NGO Priority: ${hrs}h ${remMins}m left` : `NGO Priority: ${remMins}m left`;
    }

    if (expiresAtMs && now < expiresAtMs) {
      const diffMs = expiresAtMs - now;
      const mins = Math.max(0, Math.ceil(diffMs / 60000));
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return hrs > 0 ? `Expires in ${hrs}h ${remMins}m` : `Expires in ${remMins}m`;
    }

    return item.expiry || 'Expires Soon';
  };

  const handleConfirm = async () => {
    const pickupCode = Math.floor(1000 + Math.random() * 9000).toString();
    const deliveryCode = Math.floor(1000 + Math.random() * 9000).toString();

    const batchId = `BATCH-${Math.floor(8000 + Math.random() * 999)}`;
    const foodTitle = foodItem.title || foodItem.name || 'Royal Mutton Kacchi Biryani & Borhani Combo';
    const restaurantName = foodItem.donor || foodItem.restaurant || foodItem.restaurantName || 'Star Chef Bistro';
    const restaurantAddr = foodItem.area || foodItem.address || foodItem.restaurantAddress || 'Kemal Ataturk & Progati Sarani, Banani';
    const expiryStr = getModalExpiryDisplay(foodItem) || foodItem.expiry || 'Expires in 45 mins';
    const portionsCount = parseInt(foodItem.quantity || foodItem.portions || '25', 10) || 25;

    const newBatch = {
      id: batchId,
      title: foodTitle,
      name: foodTitle,
      restaurant: restaurantName,
      donor: restaurantName,
      restaurantAddress: restaurantAddr,
      area: restaurantAddr,
      category: foodItem.category || 'COOKED_MEAL',
      portions: portionsCount,
      portionsClaimedNgo: portionsCount,
      portionsSoldConsumer: 0,
      hygieneScore: 96,
      aiGrade: 'GRADE_A_PREMIUM',
      prepTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiryTime: expiryStr,
      expiresAt: foodItem.expiresAt || foodItem.ngoEndAt || (Date.now() + 45 * 60 * 1000),
      currentStage: 2, // Claimed / Allocated Pending Pickup
      status: 'CLAIMED_PENDING_PICKUP',
      deliveryMode: transportChoice === 'VOLUNTEER' ? 'VOLUNTEER_RIDER' : 'NGO_SELF_PICKUP',
      recipient: 'Anjuman Orphanage Shelter (Bashundhara)',
      recipientType: 'NGO',
      riderName: transportChoice === 'VOLUNTEER' ? 'Pending Volunteer Claim' : 'NGO Self-Pickup Van',
      riderPhone: transportChoice === 'VOLUNTEER' ? '+880 1711-987654' : '+880 1819-445566',
      riderAvatar: transportChoice === 'VOLUNTEER' ? '🛵' : '🚐',
      pickupOtp: pickupCode,
      pickupOtpVerified: false,
      pickupOtpStatus: 'ACTIVE_VISIBLE',
      deliveryOtp: deliveryCode,
      deliveryOtpVerified: false,
      deliveryOtpStatus: 'ACTIVE_VISIBLE',
      eta: transportChoice === 'VOLUNTEER' ? 'Awaiting Volunteer Rider' : 'NGO Self-Pickup',
      distanceKm: foodItem.distance || foodItem.dist || '1.2 km',
      pickupCoords: foodItem.pickupCoords || [23.7937, 90.4066],
      dropoffCoords: foodItem.dropoffCoords || [23.8103, 90.4125],
      foodSavedKg: Math.round(portionsCount * 0.5 * 10) / 10,
      co2SavedKg: Math.round(portionsCount * 0.75 * 10) / 10,
      createdAt: Date.now()
    };

    supplyChainService.addOrUpdateBatch(newBatch);

    const claimPayload = {
      foodId: foodItem.id,
      title: foodTitle,
      donor: restaurantName,
      beneficiaries: foodItem.beneficiaries || `Feeds ~${portionsCount} People`,
      transportChoice,
      pickupOtp: pickupCode,
      deliveryOtp: deliveryCode,
      claimedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today'
    };
    
    surplusService.claimStoredListing(foodItem.id, claimPayload);
    const result = await ngoService.claimTier1Food(claimPayload);

    onConfirmClaim({
      id: batchId,
      title: foodTitle,
      donor: restaurantName,
      claimedAt: new Date().toLocaleTimeString(),
      status: result.status || (transportChoice === 'VOLUNTEER' ? 'DISPATCHING_RIDER' : 'SELF_PICKUP_ASSIGNED'),
      eta: '15 mins',
      pickupOtp: pickupCode,
      deliveryOtp: deliveryCode
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
            <span className="summary-chip expiry-chip">🔥 {getModalExpiryDisplay(foodItem)}</span>
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
