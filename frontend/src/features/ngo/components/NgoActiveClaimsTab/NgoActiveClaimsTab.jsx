import React, { useState } from 'react';
import { 
  Clock, MapPin, Truck, CheckCircle2, ShieldCheck, PhoneCall, 
  MessageSquare, QrCode, Copy, Check, Sparkles, Search, PackageX, ArrowRight 
} from 'lucide-react';
import Card from '../../../../components/Card/Card';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import Modal from '../../../../components/Modal/Modal';
import InAppChatModal from '../../../restaurant/components/InAppChatModal/InAppChatModal';
import './NgoActiveClaimsTab.css';

export default function NgoActiveClaimsTab({ onSwitchToDiscover }) {
  const [copiedOtp, setCopiedOtp] = useState(null);
  const [selectedQrOtp, setSelectedQrOtp] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeVolunteerName, setActiveVolunteerName] = useState('Tanvir Hossain');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Claims List matching Stitch mockup
  const [claimsList, setClaimsList] = useState([
    {
      id: 'CLM-8091',
      title: 'Spicy Chicken Biryani (20 Portions)',
      donor: 'Star Chef Bistro (Banani - 0.8 km)',
      claimedTime: '6:45 PM Today',
      beneficiaries: 'Feeds ~40 Orphan Children',
      transportMethod: '🛵 Volunteer Rider Assigned',
      volunteerName: 'Tanvir Hossain (Motorcycle)',
      rating: '4.9 ⭐',
      deliveryOTP: '4892',
      statusCategory: 'ON_THE_WAY',
      statusLabel: '🚚 Rider On The Way to Shelter',
      urgency: 'HIGH',
      eta: 'Arrival ETA: 12 minutes away'
    },
    {
      id: 'CLM-8092',
      title: 'Artisan Bread Basket (15 Packs)',
      donor: 'Daily Crust Bakery (Bashundhara)',
      claimedTime: '5:30 PM Today',
      beneficiaries: 'Feeds ~25 Children',
      transportMethod: '🚚 NGO Self Pickup Van',
      volunteerName: 'Shelter Driver Rafiq (NGO Van)',
      rating: '5.0 ⭐',
      deliveryOTP: '9102',
      statusCategory: 'READY_PICKUP',
      statusLabel: '🏪 Ready at Store',
      urgency: 'NORMAL',
      eta: '🚚 NGO Van On The Way for Pickup (ETA 15m)'
    }
  ]);

  const handleCopyOtp = (otp, id) => {
    navigator.clipboard.writeText(otp);
    setCopiedOtp(id);
    setTimeout(() => setCopiedOtp(null), 2000);
  };

  const handleOpenChat = (name) => {
    setActiveVolunteerName(name);
    setIsChatOpen(true);
  };

  const filteredClaims = claimsList.filter(claim => {
    const matchesSearch = claim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          claim.donor.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFilter === 'ALL') return matchesSearch;
    if (selectedFilter === 'ON_THE_WAY') return matchesSearch && claim.statusCategory === 'ON_THE_WAY';
    if (selectedFilter === 'READY_PICKUP') return matchesSearch && claim.statusCategory === 'READY_PICKUP';
    return matchesSearch;
  });

  return (
    <div className="ngo-active-claims-tab">
      {/* Header matching Stitch Mockup */}
      <div className="tab-header">
        <div>
          <h1 className="tab-title">Active Claimed Food Rescues</h1>
          <p className="tab-sub">Manage and track live food pickups claimed by Anjuman Orphanage Shelter.</p>
        </div>
        <Badge theme="ngo">
          <Sparkles size={14} /> {claimsList.length} Active Rescues Live
        </Badge>
      </div>

      {/* Subtle Search & Filter Bar (Handles Many Claims) */}
      {claimsList.length > 0 && (
        <div className="claims-filter-bar">
          <div className="claims-search-input">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search active claims by food item or donor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-chips">
            <button
              className={`filter-chip ${selectedFilter === 'ALL' ? 'chip-active' : ''}`}
              onClick={() => setSelectedFilter('ALL')}
            >
              All Claims ({claimsList.length})
            </button>
            <button
              className={`filter-chip ${selectedFilter === 'ON_THE_WAY' ? 'chip-active' : ''}`}
              onClick={() => setSelectedFilter('ON_THE_WAY')}
            >
              🚚 On The Way ({claimsList.filter(c => c.statusCategory === 'ON_THE_WAY').length})
            </button>
            <button
              className={`filter-chip ${selectedFilter === 'READY_PICKUP' ? 'chip-active' : ''}`}
              onClick={() => setSelectedFilter('READY_PICKUP')}
            >
              🏪 Ready for Pickup ({claimsList.filter(c => c.statusCategory === 'READY_PICKUP').length})
            </button>
          </div>
        </div>
      )}

      {/* ZERO CLAIMS EMPTY STATE VIEW */}
      {claimsList.length === 0 ? (
        <Card hover={false} className="empty-claims-card">
          <div className="empty-state-content">
            <div className="empty-icon-glowing-circle">
              <PackageX size={48} className="empty-icon-green" />
            </div>
            <h2 className="empty-title">No Active Rescue Claims Yet</h2>
            <p className="empty-sub">
              Your shelter currently has no active food rescue claims. Browse nearby restaurant surplus offerings to claim free meals for children in your shelter!
            </p>
            <Button
              variant="emerald"
              size="lg"
              icon={ArrowRight}
              onClick={onSwitchToDiscover}
              className="discover-surplus-btn"
            >
              🔍 Discover Nearby Surplus Food
            </Button>
          </div>
        </Card>
      ) : (
        /* Side-by-side Cards Grid matching Stitch picture */
        <div className="stitch-picture-claims-grid">
          {filteredClaims.map((claim) => (
            <Card key={claim.id} hover={false} className="stitch-style-claim-card">
              {/* Card Top Meta */}
              <div className="claim-card-top-row">
                <span className="claim-id-text">Claim #{claim.id}</span>
                <div className={`status-pill-badge ${claim.urgency === 'HIGH' ? 'urgent-status' : 'normal-status'}`}>
                  <span className="live-dot"></span>
                  <span>{claim.statusLabel}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="claim-item-title">{claim.title}</h3>

              {/* Donor & Time */}
              <div className="claim-info-rows">
                <div className="info-row-item">
                  <MapPin size={15} className="icon-muted" />
                  <span><strong>Donor:</strong> {claim.donor}</span>
                </div>
                <div className="info-row-item">
                  <Clock size={15} className="icon-muted" />
                  <span><strong>Time:</strong> {claim.claimedTime}</span>
                </div>

                {/* Beneficiary Pill */}
                <div className="beneficiary-tag-wrap">
                  <span className="beneficiary-pill">👨‍👩‍👧‍👦 {claim.beneficiaries}</span>
                </div>
              </div>

              {/* Volunteer Driver Box */}
              <div className="driver-profile-box">
                <div className="driver-left-info">
                  <div className="driver-avatar-circle">🛵</div>
                  <div>
                    <span className="driver-name-text">{claim.volunteerName}</span>
                    <span className="driver-rating-sub">{claim.rating} Rating</span>
                  </div>
                </div>

                <div className="driver-icon-btns">
                  <button
                    className="icon-action-btn green-btn"
                    title="Call Driver"
                    onClick={() => alert(`Calling ${claim.volunteerName}...`)}
                  >
                    <PhoneCall size={17} />
                  </button>
                  <button
                    className="icon-action-btn blue-btn"
                    title="In-App Chat"
                    onClick={() => handleOpenChat(claim.volunteerName)}
                  >
                    <MessageSquare size={17} />
                  </button>
                </div>
              </div>

              {/* Footer Verification OTP & Status */}
              <div className="stitch-card-footer">
                <div className="otp-left-box">
                  <ShieldCheck size={16} className="icon-blue" />
                  <span>Handover OTP: <strong className="otp-digits">{claim.deliveryOTP}</strong></span>
                  
                  <button
                    className="copy-otp-sub-btn"
                    title="Copy OTP"
                    onClick={() => handleCopyOtp(claim.deliveryOTP, claim.id)}
                  >
                    {copiedOtp === claim.id ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
                  </button>

                  <button
                    className="qr-otp-sub-btn"
                    title="Show QR Code"
                    onClick={() => setSelectedQrOtp(claim)}
                  >
                    <QrCode size={13} /> QR Code
                  </button>
                </div>

                <div className="eta-status-badge">
                  <span>{claim.eta}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* QR Code Verification Modal */}
      {selectedQrOtp && (
        <Modal isOpen={!!selectedQrOtp} onClose={() => setSelectedQrOtp(null)} className="qr-modal">
          <div className="qr-modal-body">
            <h3 className="qr-modal-title">Handover Verification QR Code</h3>
            <p className="qr-modal-sub">Show this QR code to the volunteer rider to complete delivery verification.</p>

            <div className="qr-image-box">
              <div className="qr-simulated-code">
                <QrCode size={160} className="qr-svg-icon" />
              </div>
              <span className="qr-code-text">OTP CODE: <strong>{selectedQrOtp.deliveryOTP}</strong></span>
            </div>

            <Button variant="secondary" fullWidth onClick={() => setSelectedQrOtp(null)}>
              Close QR Code
            </Button>
          </div>
        </Modal>
      )}

      {/* In-App Chat Modal */}
      <InAppChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        volunteerName={activeVolunteerName}
      />
    </div>
  );
}
