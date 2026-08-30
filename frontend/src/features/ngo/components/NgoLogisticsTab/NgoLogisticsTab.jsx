import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { 
  Truck, MapPin, Clock, PhoneCall, MessageSquare, ShieldCheck, 
  CheckCircle2, AlertCircle, Navigation, HeartHandshake, Leaf, Sparkles,
  FileCheck, Copy, Check, Star, RefreshCw, PackageX, ArrowRight, Layers
} from 'lucide-react';
import Card from '../../../../components/Card/Card';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import Modal from '../../../../components/Modal/Modal';
import InAppChatModal from '../../../restaurant/components/InAppChatModal/InAppChatModal';
import 'leaflet/dist/leaflet.css';
import './NgoLogisticsTab.css';

// SVG Vector Marker Generator for Logistics Map
const createLogisticsSvgPin = (color, emoji) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="48" viewBox="0 0 38 48">
      <path d="M19 0C8.507 0 0 8.507 0 19c0 14.25 19 29 19 29s19-14.75 19-29C38 8.507 29.493 0 19 0z" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="19" cy="19" r="13" fill="#ffffff" opacity="0.25"/>
      <text x="19" y="21" font-size="17" text-anchor="middle" dominant-baseline="central">${emoji}</text>
    </svg>
  `;
  return L.icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`,
    iconSize: [38, 48],
    iconAnchor: [19, 48],
    popupAnchor: [0, -44]
  });
};

export default function NgoLogisticsTab({ onSwitchToDiscover }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Active Rescue Missions Array
  const [activeMissionsList, setActiveMissionsList] = useState([
    {
      id: '8091',
      foodTitle: 'Spicy Chicken Biryani (20 Portions)',
      donor: 'Star Chef Bistro (Banani - 0.8 km)',
      destination: 'Anjuman Orphanage Shelter (Bashundhara)',
      volunteerName: 'Tanvir Hossain',
      vehicle: 'Motorcycle',
      plateNumber: 'DHAKA-METRO-HA-4819',
      rating: '4.9 ⭐',
      phone: '+880 1712-345678',
      currentLocationText: '🚚 Rider Tanvir Hossain is currently on Progati Sarani Rd',
      eta: '8 mins remaining',
      claimedAt: '6:45 PM Today',
      otp: '4892',
      beneficiaries: 'Feeds 40 Children',
      isConfirmed: false,
      path: [
        [23.7937, 90.4047],
        [23.7937, 90.4200],
        [23.8050, 90.4210],
        [23.8150, 90.4210]
      ],
      riderPos: [23.8050, 90.4210],
      restaurantPos: [23.7937, 90.4047],
      shelterPos: [23.8150, 90.4210]
    },
    {
      id: '8092',
      title: 'Artisan Bread Basket (15 Packs)',
      foodTitle: 'Fresh Artisan Bread & Pastry Basket (15 Packs)',
      donor: 'Daily Crust Bakery (Bashundhara - 1.5 km)',
      destination: 'Anjuman Orphanage Shelter (Bashundhara)',
      volunteerName: 'Shelter Driver Rafiq',
      vehicle: 'NGO Van',
      plateNumber: 'DHAKA-METRO-GA-1102',
      rating: '5.0 ⭐',
      phone: '+880 1819-112233',
      currentLocationText: '🚚 Driver Rafiq is returning via Bashundhara Main Rd',
      eta: '14 mins remaining',
      claimedAt: '5:30 PM Today',
      otp: '9102',
      beneficiaries: 'Feeds 25 Children',
      isConfirmed: false,
      path: [
        [23.8220, 90.4270],
        [23.8180, 90.4230],
        [23.8150, 90.4210]
      ],
      riderPos: [23.8180, 90.4230],
      restaurantPos: [23.8220, 90.4270],
      shelterPos: [23.8150, 90.4210]
    }
  ]);

  const [activeMissionId, setActiveMissionId] = useState('8091');

  const activeMission = activeMissionsList.find(m => m.id === activeMissionId) || activeMissionsList[0];

  const handleCopyOtp = () => {
    if (!activeMission) return;
    navigator.clipboard.writeText(activeMission.otp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleConfirmDelivery = () => {
    if (!activeMission) return;

    setActiveMissionsList(prev => prev.map(m => 
      m.id === activeMission.id ? { ...m, isConfirmed: true } : m
    ));

    setIsReceiptModalOpen(true);
  };

  return (
    <div className="ngo-logistics-tab">
      {/* Header Row */}
      <div className="tab-header">
        <div>
          <h1 className="tab-title">Live Rescue Logistics & Driver Tracking</h1>
          <p className="tab-sub">Track active volunteer riders en-route to Anjuman Orphanage Shelter in real-time.</p>
        </div>
        <div className="header-actions">
          <Badge theme="ngo">
            <Sparkles size={14} /> {activeMissionsList.length} Active Missions Live
          </Badge>
          <button 
            className="empty-state-toggle-btn"
            onClick={() => setActiveMissionsList(activeMissionsList.length > 0 ? [] : [
              {
                id: 'RESCUE-9821',
                foodTitle: 'Spicy Chicken Biryani (20 Portions)',
                donor: 'Star Chef Bistro (Banani - 0.8 km)',
                destination: 'Anjuman Orphanage Shelter (Bashundhara)',
                volunteerName: 'Tanvir Hossain',
                vehicle: 'Motorcycle',
                plateNumber: 'DHAKA-METRO-HA-4819',
                rating: '4.9 ⭐',
                phone: '+880 1712-345678',
                currentLocationText: '🚚 Rider Tanvir Hossain is currently on Progati Sarani Rd',
                eta: '8 mins remaining',
                claimedAt: '6:45 PM Today',
                otp: '4892',
                beneficiaries: 'Feeds ~40 Children',
                isConfirmed: false,
                path: [
                  [23.7937, 90.4047],
                  [23.7937, 90.4200],
                  [23.8050, 90.4210],
                  [23.8150, 90.4210]
                ],
                riderPos: [23.8050, 90.4210],
                restaurantPos: [23.7937, 90.4047],
                shelterPos: [23.8150, 90.4210]
              }
            ])}
          >
            {activeMissionsList.length > 0 ? '🧪 Test 0 Missions Empty View' : '🧪 Restore Missions View'}
          </button>
        </div>
      </div>

      {/* ZERO MISSIONS IN-TRANSIT EMPTY STATE VIEW */}
      {activeMissionsList.length === 0 ? (
        <Card hover={false} className="empty-logistics-card">
          <div className="empty-state-content">
            <div className="empty-icon-glowing-circle">
              <Navigation size={48} className="empty-icon-blue" />
            </div>
            <h2 className="empty-title">No Active Rescue Missions In-Transit</h2>
            <p className="empty-sub">
              There are currently no riders on the road delivering food to your shelter. Browse nearby surplus offerings to claim free meals for children in your shelter!
            </p>
            <Button
              variant="emerald"
              size="lg"
              icon={ArrowRight}
              onClick={onSwitchToDiscover}
              className="discover-surplus-btn"
            >
              🔍 Claim Surplus Food
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* MULTI-MISSION SELECTOR TABS BAR */}
          {activeMissionsList.length > 1 && (
            <div className="multi-mission-bar">
              <span className="multi-mission-title"><Layers size={15} /> Select In-Transit Mission:</span>
              <div className="mission-tabs-list">
                {activeMissionsList.map((m) => (
                  <button
                    key={m.id}
                    className={`mission-tab-btn ${m.id === activeMissionId ? 'mission-active' : ''}`}
                    onClick={() => setActiveMissionId(m.id)}
                  >
                    <span>🛵 Mission #{m.id} ({m.volunteerName})</span>
                    <span className="mini-eta-pill">{m.eta}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="logistics-split-layout">
            {/* LEFT PANEL: MISSION & DRIVER CONTROL CARD */}
            <div className="logistics-info-panel">
              <Card hover={false} className="mission-summary-card">
                {/* Mission Header */}
                <div className="mission-card-header">
                  <span className="mission-id-pill">Rescue Mission #{activeMission.id}</span>
                  <div className="status-badge-pulse">
                    <span className="live-pulse-dot"></span>
                    <span>{activeMission.isConfirmed ? '✓ Delivery Completed' : '🚚 Rider On The Way to Shelter'}</span>
                  </div>
                </div>

                {/* Food Title & Donor */}
                <h2 className="mission-food-title">{activeMission.foodTitle}</h2>
                <p className="mission-donor-sub">🏪 Donor: <strong>{activeMission.donor}</strong></p>

                {/* Uber-Style 4-Stage Visual Progress Stepper */}
                <div className="logistics-stepper-box">
                  <div className="stepper-item completed">
                    <div className="stepper-node">✓</div>
                    <span className="stepper-label">Claimed</span>
                  </div>
                  <div className="stepper-line active"></div>
                  <div className="stepper-item completed">
                    <div className="stepper-node">✓</div>
                    <span className="stepper-label">Assigned</span>
                  </div>
                  <div className="stepper-line active"></div>
                  <div className={`stepper-item ${activeMission.isConfirmed ? 'completed' : 'active'}`}>
                    <div className="stepper-node">{activeMission.isConfirmed ? '✓' : '🛵'}</div>
                    <span className="stepper-label">On The Way</span>
                  </div>
                  <div className={`stepper-line ${activeMission.isConfirmed ? 'active' : ''}`}></div>
                  <div className={`stepper-item ${activeMission.isConfirmed ? 'completed' : ''}`}>
                    <div className="stepper-node">{activeMission.isConfirmed ? '✓' : '🏢'}</div>
                    <span className="stepper-label">Delivered</span>
                  </div>
                </div>

                {/* Live Location Alert Box */}
                <div className="live-status-alert-box">
                  <div className="status-icon-wrap">
                    <Truck size={18} className="text-blue" />
                  </div>
                  <div className="status-alert-text">
                    <strong>{activeMission.currentLocationText}</strong>
                    <span className="eta-sub-text">Estimated Arrival: <strong>{activeMission.eta}</strong></span>
                  </div>
                </div>

                {/* Verified Driver Courier Card */}
                <div className="verified-driver-card">
                  <div className="driver-avatar-wrap">
                    <div className="driver-avatar-circle">🛵</div>
                    <span className="driver-online-dot"></span>
                  </div>

                  <div className="driver-meta">
                    <div className="driver-name-row">
                      <span className="driver-name-bold">{activeMission.volunteerName}</span>
                      <span className="rating-pill"><Star size={11} className="fill-gold" /> {activeMission.rating}</span>
                    </div>
                    <div className="vehicle-plate-tag">
                      <span>{activeMission.vehicle}</span>
                      <span className="plate-num">{activeMission.plateNumber}</span>
                    </div>
                  </div>

                  <div className="driver-btn-group">
                    <button
                      className="action-circle-btn green-btn"
                      title="Call Driver"
                      onClick={() => alert(`Calling Volunteer ${activeMission.volunteerName} at ${activeMission.phone}...`)}
                    >
                      <PhoneCall size={17} />
                    </button>
                    <button
                      className="action-circle-btn blue-btn"
                      title="In-App Chat"
                      onClick={() => setIsChatOpen(true)}
                    >
                      <MessageSquare size={17} />
                    </button>
                  </div>
                </div>

                {/* Mission Metrics Grid */}
                <div className="mission-metrics-grid">
                  <div className="metric-box">
                    <span className="metric-label">Handover OTP</span>
                    <div className="otp-value-row">
                      <span className="otp-digit-text">{activeMission.otp}</span>
                      <button className="copy-icon-btn" title="Copy OTP" onClick={handleCopyOtp}>
                        {copiedOtp ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  <div className="metric-box">
                    <span className="metric-label">Beneficiaries</span>
                    <span className="metric-value-text">{activeMission.beneficiaries}</span>
                  </div>

                  <div className="metric-box">
                    <span className="metric-label">Claim Time</span>
                    <span className="metric-value-text">{activeMission.claimedAt}</span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="confirm-action-wrap">
                  {!activeMission.isConfirmed ? (
                    <Button
                      variant="emerald"
                      size="lg"
                      fullWidth
                      icon={HeartHandshake}
                      onClick={handleConfirmDelivery}
                      className="confirm-received-btn"
                    >
                      🤝 Confirm Food Received at Shelter
                    </Button>
                  ) : (
                    <div className="confirmed-success-banner">
                      <CheckCircle2 size={20} className="text-emerald" />
                      <span>Food Package Verified & Received Cleanly!</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* RIGHT PANEL: REAL GOOGLE MAPS GPS CANVAS FOR ACTIVE SELECTED MISSION */}
            <div className="logistics-map-panel">
              <Card hover={false} className="logistics-map-card">
                <div className="logistics-map-wrapper">
                  <div className="map-top-rider-pill">
                    <span className="live-pulse-dot"></span>
                    <span>🛵 Tracking Rider {activeMission.volunteerName} ({activeMission.eta})</span>
                  </div>

                  <MapContainer
                    center={activeMission.riderPos}
                    zoom={13}
                    scrollWheelZoom={true}
                    className="leaflet-map-canvas"
                    key={activeMission.id}
                  >
                    <TileLayer
                      url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                      attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
                    />

                    <Polyline
                      positions={activeMission.path}
                      pathOptions={{
                        color: '#2563eb',
                        weight: 6,
                        opacity: 0.95,
                        lineCap: 'round',
                        lineJoin: 'round'
                      }}
                    />

                    <Marker position={activeMission.restaurantPos} icon={createLogisticsSvgPin('#ea580c', '🍲')}>
                      <Popup className="gmaps-clean-popup">
                        <strong>{activeMission.donor}</strong><br />Pickup Origin Point
                      </Popup>
                    </Marker>

                    <Marker position={activeMission.riderPos} icon={createLogisticsSvgPin('#2563eb', '🛵')}>
                      <Popup className="gmaps-clean-popup">
                        <strong>🛵 Rider {activeMission.volunteerName}</strong><br />{activeMission.currentLocationText}
                      </Popup>
                    </Marker>

                    <Marker position={activeMission.shelterPos} icon={createLogisticsSvgPin('#059669', '🏢')}>
                      <Popup className="gmaps-clean-popup">
                        <strong>Anjuman Orphanage Shelter</strong><br />Delivery Destination
                      </Popup>
                    </Marker>
                  </MapContainer>

                  <div className="gmaps-watermark-logo">
                    <span className="gmaps-google-text">Google</span> <span className="gmaps-sub-text">Maps Live</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Digital Impact Receipt Modal */}
      {isReceiptModalOpen && activeMission && (
        <Modal isOpen={isReceiptModalOpen} onClose={() => setIsReceiptModalOpen(false)} className="receipt-modal">
          <div className="receipt-modal-body">
            <div className="success-icon-badge">
              <FileCheck size={44} className="text-emerald" />
            </div>
            <h2 className="receipt-title">Food Rescue Receipt Confirmed!</h2>
            <p className="receipt-sub">Receipt #{activeMission.id} logged cleanly. Food delivered to Anjuman Shelter.</p>

            <div className="receipt-summary-box">
              <div className="receipt-row">
                <span>Food Package:</span>
                <strong>{activeMission.foodTitle}</strong>
              </div>
              <div className="receipt-row">
                <span>Donor Restaurant:</span>
                <strong>{activeMission.donor}</strong>
              </div>
              <div className="receipt-row">
                <span>Delivered By:</span>
                <strong>{activeMission.volunteerName} ({activeMission.plateNumber})</strong>
              </div>
              <div className="receipt-row highlight-row">
                <span>Impact Metric Added:</span>
                <strong className="text-emerald">+40 Children Fed • +8.5 kg CO₂ Saved</strong>
              </div>
            </div>

            <Button variant="emerald" fullWidth onClick={() => setIsReceiptModalOpen(false)}>
              Done & Close Receipt
            </Button>
          </div>
        </Modal>
      )}

      {/* In-App Chat Modal */}
      <InAppChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        volunteerName={activeMission ? activeMission.volunteerName : 'Volunteer Rider'}
      />
    </div>
  );
}
