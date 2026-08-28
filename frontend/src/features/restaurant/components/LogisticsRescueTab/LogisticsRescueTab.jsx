import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { PhoneCall, MessageSquare, ShieldCheck, Clock, MapPin, Search, CheckCircle2, PackageCheck, AlertCircle, Plus } from 'lucide-react';
import Card from '../../../../components/Card/Card';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import InAppChatModal from '../InAppChatModal/InAppChatModal';
import 'leaflet/dist/leaflet.css';
import './LogisticsRescueTab.css';

// Helper function to generate Google Maps Markers
const createGoogleMarker = (emoji, colorBg, labelText, isSelected = false) => {
  return L.divIcon({
    className: 'custom-google-marker',
    html: `
      <div className="gmap-pin-container ${isSelected ? 'selected-pin-active' : ''}">
        <div className="gmap-tooltip-bubble ${isSelected ? 'tooltip-highlight' : ''}">
          <span className="gmap-tooltip-title">${labelText}</span>
        </div>
        <div className="gmap-pin-bubble" style="background-color: ${colorBg};">
          <span className="gmap-emoji">${emoji}</span>
        </div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 45]
  });
};

export default function LogisticsRescueTab() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mapSearchText, setMapSearchText] = useState('প্রগতি সরণি, ঢাকা');

  // State for Corner Case Demonstrations
  const [demoState, setDemoState] = useState('MULTIPLE'); // 'SINGLE', 'MULTIPLE', 'EMPTY'
  const [selectedMissionId, setSelectedMissionId] = useState('RES-8041');

  // Mock Active Missions Data
  const mockMissions = [
    {
      id: 'RES-8041',
      item: 'Spicy Chicken Biryani (20 Portions)',
      volunteer: 'Tanvir Hossain',
      rating: '4.9 ⭐',
      vehicle: 'Motorcycle (DHAKA-METRO-HA-4819)',
      phone: '+880 1712-345678',
      pickupETA: '21 mins away (Progati Sarani)',
      destination: 'Anjuman Orphanage Shelter (Bashundhara)',
      otpRequired: '4892',
      urgency: 'HIGH',
      coordinates: {
        restPos: [23.7937, 90.4047],
        riderPos: [23.8120, 90.4230],
        ngoPos: [23.8220, 90.4270]
      }
    },
    {
      id: 'RES-8042',
      item: 'Assorted Pastries Package (15 Packs)',
      volunteer: 'Rahim Uddin',
      rating: '4.8 ⭐',
      vehicle: 'Bicycle (Dhaka North)',
      phone: '+880 1819-987654',
      pickupETA: '8 mins away (Gulshan 2)',
      destination: 'Dhaka Community Food Bank (Gulshan 1)',
      otpRequired: '7103',
      urgency: 'NORMAL',
      coordinates: {
        restPos: [23.7980, 90.4150],
        riderPos: [23.7950, 90.4180],
        ngoPos: [23.7880, 90.4120]
      }
    }
  ];

  // Determine active missions based on selected Demo State
  const activeMissions = demoState === 'EMPTY' 
    ? [] 
    : demoState === 'SINGLE' 
    ? [mockMissions[0]] 
    : mockMissions;

  // Selected Mission object for map focusing (First Load defaults to Most Urgent)
  const currentSelectedMission = activeMissions.find(m => m.id === selectedMissionId) || activeMissions[0];

  const centerPos = currentSelectedMission ? currentSelectedMission.coordinates.riderPos : [23.8050, 90.4180];

  return (
    <div className="logistics-tab">
      {/* Corner Case Demo Control Bar */}
      <div className="corner-case-demo-bar">
        <span className="demo-label">🧪 Test Order States:</span>
        <button
          className={`case-btn ${demoState === 'MULTIPLE' ? 'case-active' : ''}`}
          onClick={() => { setDemoState('MULTIPLE'); setSelectedMissionId('RES-8041'); }}
        >
          2️⃣ Multiple Active Orders (Multi-Rescue)
        </button>
        <button
          className={`case-btn ${demoState === 'SINGLE' ? 'case-active' : ''}`}
          onClick={() => { setDemoState('SINGLE'); setSelectedMissionId('RES-8041'); }}
        >
          1️⃣ Single Active Order (Auto-Focused)
        </button>
        <button
          className={`case-btn ${demoState === 'EMPTY' ? 'case-active' : ''}`}
          onClick={() => { setDemoState('EMPTY'); }}
        >
          0️⃣ No Active Orders (Empty State)
        </button>
      </div>

      <div className="tab-header">
        <div>
          <h1 className="tab-title">Logistics & Live Rescue Tracking</h1>
          <p className="tab-sub">
            {demoState === 'EMPTY' 
              ? 'No active rescue missions in progress. System is ready for new listings.'
              : `Tracking ${activeMissions.length} active rescue mission${activeMissions.length > 1 ? 's' : ''} across Dhaka City.`}
          </p>
        </div>
        {demoState !== 'EMPTY' && (
          <Badge theme={activeMissions.length > 1 ? 'flash' : 'ngo'}>
            {activeMissions.length} Active Live Rescue{activeMissions.length > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* CORNER CASE 1: EMPTY STATE VIEW (No Active Orders) */}
      {demoState === 'EMPTY' ? (
        <div className="empty-state-container">
          <Card hover={false} className="empty-state-card">
            <div className="empty-icon-wrapper">
              <PackageCheck size={48} className="empty-icon" />
            </div>
            <h2 className="empty-title">All Caught Up! No Active Rescue Missions</h2>
            <p className="empty-desc">
              All surplus food donations are currently completed or waiting for new donor listings. When a volunteer or NGO claims food, live tracking will appear here automatically.
            </p>
            <div className="empty-actions">
              <Button variant="primary" icon={Plus} onClick={() => alert('Opening Create Surplus Post form...')}>
                Post Surplus Food Now
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        /* CORNER CASE 2 & 3: ACTIVE & MULTI-ORDER STATE VIEW */
        <div className="logistics-split-grid">
          {/* Left Column: Active Mission Cards List */}
          <div className="missions-list">
            <div className="multi-order-notice">
              <span>💡 Select a mission card to focus map tracking</span>
            </div>

            {activeMissions.map((mission) => {
              const isSelected = mission.id === currentSelectedMission?.id;

              return (
                <Card
                  key={mission.id}
                  hover={true}
                  className={`mission-card ${isSelected ? 'card-focused-active' : ''}`}
                  onClick={() => setSelectedMissionId(mission.id)}
                >
                  <div className="mission-top">
                    <div>
                      <span className="mission-id">Mission #{mission.id}</span>
                      <h3 className="mission-item-title">{mission.item}</h3>
                    </div>
                    
                    {/* Readable Status Badge */}
                    <div className={`readable-status-badge ${mission.urgency === 'HIGH' ? 'urgent-badge' : ''}`}>
                      <span className="live-dot"></span>
                      <span>🚚 On The Way ({mission.pickupETA.split('(')[1]?.replace(')', '') || 'Dhaka'})</span>
                    </div>
                  </div>

                  {/* Volunteer Details Box */}
                  <div className="volunteer-info-box">
                    <div className="volunteer-profile">
                      <div className="v-avatar">🛵</div>
                      <div>
                        <span className="v-name">{mission.volunteer}</span>
                        <span className="v-meta">{mission.vehicle} • {mission.rating}</span>
                      </div>
                    </div>

                    <div className="contact-actions-row">
                      <button
                        className="action-circle-btn green-call-btn"
                        title="Call Volunteer"
                        onClick={(e) => { e.stopPropagation(); alert(`Calling ${mission.volunteer}...`); }}
                      >
                        <PhoneCall size={18} />
                      </button>

                      <button
                        className="action-circle-btn message-chat-btn"
                        title="In-App Chat"
                        onClick={(e) => { e.stopPropagation(); setIsChatOpen(true); }}
                      >
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="logistics-details-list">
                    <div className="detail-row">
                      <Clock size={16} className="icon-emerald" />
                      <span>Pickup ETA: <strong>{mission.pickupETA}</strong></span>
                    </div>
                    <div className="detail-row">
                      <MapPin size={16} className="icon-orange" />
                      <span>Destination: <strong>{mission.destination}</strong></span>
                    </div>
                    <div className="detail-row otp-row">
                      <ShieldCheck size={16} className="icon-blue" />
                      <span>Verification Code: <strong className="otp-code">{mission.otpRequired}</strong></span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Right Column: Google Maps Container */}
          <div className="map-widget-container">
            <Card hover={false} className="google-map-card">
              <div className="google-map-wrapper">
                <div className="gmaps-search-bar">
                  <Search size={16} className="gmaps-search-icon" />
                  <input
                    type="text"
                    value={mapSearchText}
                    onChange={(e) => setMapSearchText(e.target.value)}
                    className="gmaps-search-input"
                  />
                  <span className="gmaps-live-dot">● LIVE GPS</span>
                </div>

                <MapContainer
                  center={centerPos}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="leaflet-map-canvas"
                  key={currentSelectedMission?.id || 'map'}
                >
                  <TileLayer
                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
                  />

                  {/* Render Markers & Routes for Active Missions */}
                  {activeMissions.map((m) => {
                    const isSelected = m.id === currentSelectedMission?.id;
                    const restIcon = createGoogleMarker('🏪', '#ea4335', `Rest: ${m.item.split('(')[0]}`, isSelected);
                    const riderIcon = createGoogleMarker('🛵', isSelected ? '#1a73e8' : '#64748b', `Rider: ${m.volunteer}`, isSelected);
                    const ngoIcon = createGoogleMarker('🏢', '#34a853', `NGO: ${m.destination.split('(')[0]}`, isSelected);

                    return (
                      <React.Fragment key={m.id}>
                        <Polyline
                          positions={[m.coordinates.restPos, m.coordinates.riderPos, m.coordinates.ngoPos]}
                          pathOptions={{
                            color: isSelected ? '#1a73e8' : '#94a3b8',
                            weight: isSelected ? 6 : 4,
                            opacity: isSelected ? 0.9 : 0.5,
                            dashArray: '8, 6'
                          }}
                        />
                        <Marker position={m.coordinates.restPos} icon={restIcon} />
                        <Marker position={m.coordinates.riderPos} icon={riderIcon} />
                        <Marker position={m.coordinates.ngoPos} icon={ngoIcon} />
                      </React.Fragment>
                    );
                  })}
                </MapContainer>

                <div className="gmaps-watermark-logo">
                  <span className="gmaps-google-text">Google</span> <span className="gmaps-sub-text">Maps Live</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* In-App Chat Modal */}
      <InAppChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        volunteerName={currentSelectedMission?.volunteer || 'Tanvir Hossain'}
      />
    </div>
  );
}
