import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { PhoneCall, MessageSquare, ShieldCheck, Clock, MapPin, Search, CheckCircle2, PackageCheck, AlertCircle, Plus } from 'lucide-react';
import Card from '../../../../components/Card/Card';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import InAppChatModal from '../InAppChatModal/InAppChatModal';
import { useTheme } from '../../../../context/ThemeContext';
import { surplusService } from '../../../../services/surplusService';
import { supplyChainService } from '../../../../services/supplyChainService';
import { 
  BANANI_TO_BASHUNDHARA_PRIMARY_ROUTE, 
  BASHUNDHARA_LOCAL_RESCUE_ROUTE,
  PRIMARY_ROUTE_ETA_POS, 
  getOsmTileLayer,
  createGoogleEtaBadgeMarker, 
  createGoogleCleanPinMarker 
} from '../../../../services/dhakaRouteService';
import 'leaflet/dist/leaflet.css';
import './LogisticsRescueTab.css';

const restIcon = createGoogleCleanPinMarker('🏪', '#ea4335', 'Restaurant');
const riderIcon = createGoogleCleanPinMarker('🛵', '#1a73e8', 'Rider');
const ngoIcon = createGoogleCleanPinMarker('🏢', '#34a853', 'NGO Shelter');

export default function LogisticsRescueTab() {
  const { roleThemes } = useTheme();
  const themeMode = roleThemes.restaurant;
  const tileLayer = getOsmTileLayer(themeMode);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mapSearchText, setMapSearchText] = useState('প্রগতি সরণি, ঢাকা');

  // Filter State: 'ALL', 'RIDER_ACCEPTED', 'SEARCHING_RIDER', 'AWAITING_CLAIM'
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Real Stored Surplus Listings State
  const [storedListings, setStoredListings] = useState(surplusService.getStoredListings());
  const [selectedMissionId, setSelectedMissionId] = useState(null);

  useEffect(() => {
    const refresh = () => setStoredListings(surplusService.getStoredListings());
    window.addEventListener('foodrescue_surplus_updated', refresh);
    window.addEventListener('foodrescue_supply_chain_updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('foodrescue_surplus_updated', refresh);
      window.removeEventListener('foodrescue_supply_chain_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const supplyBatches = supplyChainService.getBatches();

  // Format active surplus listings and supply chain batches into dynamic Logistics Missions
  const allMissions = [
    ...supplyBatches.filter(b => b.status !== 'DELIVERED').map((b) => {
      const isAssigned = b.riderName && !b.riderName.includes('Pending') && !b.riderName.includes('Searching');
      return {
        id: `SC-${b.id}`,
        originalId: b.id,
        item: `${b.title || b.name} (${b.portions || 1} Portions)`,
        category: b.category || 'COOKED',
        volunteer: isAssigned ? b.riderName : 'Assigning Volunteer Rider...',
        rating: isAssigned ? '4.9 ⭐' : 'N/A',
        vehicle: isAssigned ? 'Motorcycle (DHAKA-METRO-HA-4819)' : 'Auto Dispatch Engine',
        phone: b.riderPhone || '+880 1711-987654',
        pickupETA: isAssigned ? (b.eta || '12 mins away') : 'Awaiting Rider Acceptance',
        destination: b.recipient || b.customerAddress || 'Banani, Dhaka',
        otpRequired: b.pickupOtp || '1794',
        urgency: 'HIGH',
        missionStatus: isAssigned ? 'RIDER_ACCEPTED' : 'SEARCHING_RIDER',
        readableStatusText: isAssigned 
          ? `🛵 ${b.riderName} is Coming to Pick Up Food (${b.eta || 'ETA 12m'})`
          : '🟡 🔎 Order Confirmed! Searching Nearby Volunteer Rider...',
        statusBadgeClass: isAssigned ? 'readable-status-badge' : 'badge-searching',
        route: BANANI_TO_BASHUNDHARA_PRIMARY_ROUTE,
        coordinates: {
          restPos: b.pickupCoords || [23.7937, 90.4047],
          riderPos: b.riderCoords || [23.8110, 90.4200],
          ngoPos: b.dropoffCoords || [23.8103, 90.4310]
        }
      };
    }),
    ...storedListings.filter(item => !supplyBatches.some(b => b.id === item.id || b.title === item.name)).map((item, index) => {
      const isClaimed = Boolean(item.claimedByNgo || item.claimedByConsumer);
      const isVolunteerAssigned = isClaimed && Boolean(item.riderAssigned);

      let missionStatus = 'AWAITING_CLAIM';
      let readableStatusText = '⏳ Listed (Awaiting NGO / Consumer Claim)';
      let statusBadgeClass = 'badge-waiting';

      if (isVolunteerAssigned) {
        missionStatus = 'RIDER_ACCEPTED';
        readableStatusText = `🛵 ${item.riderName || 'Rider Tanvir Hossain'} is Coming to Pick Up Food (ETA 12m)`;
        statusBadgeClass = 'readable-status-badge';
      } else if (isClaimed) {
        missionStatus = 'SEARCHING_RIDER';
        readableStatusText = '🟡 🔎 Claim Confirmed! Searching Nearby Volunteer Rider...';
        statusBadgeClass = 'badge-searching';
      }

      return {
        id: `RES-${item.id}`,
        originalId: item.id,
        item: `${item.name} (${item.quantity})`,
        category: item.category || 'COOKED',
        volunteer: isVolunteerAssigned ? (item.riderName || 'Tanvir Hossain') : (isClaimed ? 'Assigning Volunteer Rider...' : 'N/A (Unclaimed)'),
        rating: isVolunteerAssigned ? '4.9 ⭐' : 'N/A',
        vehicle: isVolunteerAssigned ? 'Motorcycle (DHAKA-METRO-HA-4819)' : (isClaimed ? 'Auto Dispatch Engine' : 'N/A'),
        phone: isVolunteerAssigned ? '+880 1712-345678' : 'N/A',
        pickupETA: isVolunteerAssigned ? '12 mins away (Progati Sarani)' : (isClaimed ? 'Awaiting Rider Acceptance' : 'N/A (Pending Claim)'),
        destination: isClaimed ? (item.claimedByNgoName || item.customerAddress || 'Anjuman Orphanage Shelter (Bashundhara)') : 'NGO Shelter / B2C Buyer (Pending Claim)',
        otpRequired: isClaimed ? `${4000 + (item.id % 5000)}` : 'N/A (Pending Claim)',
        urgency: item.expiryType === 'urgent' ? 'HIGH' : 'NORMAL',
        missionStatus,
        readableStatusText,
        statusBadgeClass,
        route: index % 2 === 0 ? BANANI_TO_BASHUNDHARA_PRIMARY_ROUTE : BASHUNDHARA_LOCAL_RESCUE_ROUTE,
        coordinates: {
          restPos: [23.7937, 90.4047],
          riderPos: isVolunteerAssigned ? [23.8110, 90.4200] : (isClaimed ? [23.7980, 90.4120] : [23.7937, 90.4047]),
          ngoPos: [23.8103, 90.4310]
        }
      };
    })
  ];

  // Apply status filter
  const filteredMissions = statusFilter === 'ALL' 
    ? allMissions 
    : allMissions.filter(m => m.missionStatus === statusFilter);

  // Default focus to selected or first mission
  const activeSelectedMission = filteredMissions.find(m => m.id === selectedMissionId) || filteredMissions[0] || allMissions[0];
  const centerPos = activeSelectedMission ? activeSelectedMission.coordinates.riderPos : [23.8050, 90.4180];

  return (
    <div className="logistics-tab">
      {/* Dynamic Lifecycle State Filter Bar */}
      <div className="corner-case-demo-bar">
        <span className="demo-label">📌 Supply Chain State Filter:</span>
        <button
          className={`case-btn ${statusFilter === 'ALL' ? 'case-active' : ''}`}
          onClick={() => setStatusFilter('ALL')}
        >
          All Listings ({allMissions.length})
        </button>
        <button
          className={`case-btn ${statusFilter === 'RIDER_ACCEPTED' ? 'case-active' : ''}`}
          onClick={() => setStatusFilter('RIDER_ACCEPTED')}
        >
          🛵 Rider Assigned & Heading to Pickup ({allMissions.filter(m => m.missionStatus === 'RIDER_ACCEPTED').length})
        </button>
        <button
          className={`case-btn ${statusFilter === 'SEARCHING_RIDER' ? 'case-active' : ''}`}
          onClick={() => setStatusFilter('SEARCHING_RIDER')}
        >
          🟡 Searching Rider ({allMissions.filter(m => m.missionStatus === 'SEARCHING_RIDER').length})
        </button>
        <button
          className={`case-btn ${statusFilter === 'AWAITING_CLAIM' ? 'case-active' : ''}`}
          onClick={() => setStatusFilter('AWAITING_CLAIM')}
        >
          ⏳ Waiting for Claim ({allMissions.filter(m => m.missionStatus === 'AWAITING_CLAIM').length})
        </button>
      </div>

      <div className="tab-header">
        <div>
          <h1 className="tab-title">Logistics & Live Rescue Tracking</h1>
          <p className="tab-sub">
            {allMissions.length === 0 
              ? 'No active rescue missions in progress. System is ready for new listings.'
              : `Tracking ${allMissions.length} active surplus food listings across Dhaka City.`}
          </p>
        </div>
        {allMissions.length > 0 && (
          <Badge theme="ngo">
            {allMissions.length} Active Surplus Listing{allMissions.length > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* EMPTY STATE */}
      {allMissions.length === 0 ? (
        <div className="empty-state-container">
          <Card hover={false} className="empty-state-card">
            <div className="empty-icon-wrapper">
              <PackageCheck size={48} className="empty-icon" />
            </div>
            <h2 className="empty-title">All Caught Up! No Active Surplus Listings</h2>
            <p className="empty-desc">
              All surplus food donations are currently completed or waiting for new donor listings. When a restaurant posts food, tracking options will appear here automatically.
            </p>
          </Card>
        </div>
      ) : (
        /* ACTIVE & MULTI-ORDER STATE VIEW */
        <div className="logistics-split-grid">
          {/* Left Column: Active Mission Cards List */}
          <div className="missions-list">
            <div className="multi-order-notice">
              <span>💡 Click a mission card to focus Leaflet Live GPS map tracking</span>
            </div>

            {filteredMissions.map((mission) => {
              const isSelected = mission.id === activeSelectedMission?.id;

              return (
                <Card
                  key={mission.id}
                  hover={true}
                  className={`mission-card ${isSelected ? 'card-focused-active' : ''}`}
                  onClick={() => setSelectedMissionId(mission.id)}
                >
                  <div className="mission-top">
                    <div>
                      <span className="mission-id">Listing ID #{mission.id}</span>
                      <h3 className="mission-item-title">{mission.item}</h3>
                    </div>
                    
                    {/* Readable Status Badge */}
                    <div className={`readable-status-badge ${mission.statusBadgeClass}`}>
                      <span className="live-dot"></span>
                      <span>{mission.readableStatusText}</span>
                    </div>
                  </div>

                  {/* Rider / Supply Chain Subtext Explanation */}
                  {mission.missionStatus === 'AWAITING_CLAIM' && (
                    <div className="logistics-notice-box waiting-notice">
                      <span>⏳ Listed in NGO Priority Window. Live GPS tracking will activate as soon as an NGO or buyer claims this item.</span>
                    </div>
                  )}

                  {mission.missionStatus === 'SEARCHING_RIDER' && (
                    <div className="logistics-notice-box searching-notice">
                      <span>🟡 Claim confirmed by NGO! Finding nearest volunteer rider within 2 km...</span>
                    </div>
                  )}

                  {/* Volunteer Details Box (Active when Rider Accepted) */}
                  {mission.missionStatus === 'RIDER_ACCEPTED' && (
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
                  )}

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
                    {mission.missionStatus === 'RIDER_ACCEPTED' && (
                      <div className="detail-row otp-row">
                        <ShieldCheck size={16} className="icon-blue" />
                        <span>Verification Code: <strong className="otp-code">{mission.otpRequired}</strong></span>
                      </div>
                    )}
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
                  key={activeSelectedMission?.id || 'map'}
                >
                  <TileLayer
                    url={tileLayer.url}
                    attribution={tileLayer.attribution}
                    subdomains={tileLayer.subdomains || '0123'}
                  />

                  {/* Active Selected Mission Route Polyline */}
                  {activeSelectedMission && activeSelectedMission.missionStatus === 'RIDER_ACCEPTED' && (
                    <>
                      <Polyline
                        positions={activeSelectedMission.route}
                        pathOptions={{ color: '#059669', weight: 8, opacity: 0.4, lineCap: 'round', lineJoin: 'round' }}
                      />
                      <Polyline
                        positions={activeSelectedMission.route}
                        pathOptions={{ color: '#10b981', weight: 5, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }}
                      />
                    </>
                  )}

                  {/* Floating OpenStreetMap ETA Badges */}
                  {activeSelectedMission && activeSelectedMission.missionStatus === 'RIDER_ACCEPTED' && (
                    <Marker position={PRIMARY_ROUTE_ETA_POS} icon={createGoogleEtaBadgeMarker('১৪ মিনিট', '৩.৮ কিমি', true)} />
                  )}

                  {/* Clean Marker Pins */}
                  {filteredMissions.map((m) => (
                    <React.Fragment key={m.id}>
                      <Marker position={m.coordinates.restPos} icon={restIcon}>
                        <Popup>🏪 Restaurant: {m.item.split('(')[0]}</Popup>
                      </Marker>
                      {m.missionStatus === 'RIDER_ACCEPTED' && (
                        <Marker position={m.coordinates.riderPos} icon={riderIcon}>
                          <Popup>🛵 Rider: {m.volunteer}</Popup>
                        </Marker>
                      )}
                      {(m.missionStatus === 'RIDER_ACCEPTED' || m.missionStatus === 'SEARCHING_RIDER') && (
                        <Marker position={m.coordinates.ngoPos} icon={ngoIcon}>
                          <Popup>🏢 Destination: {m.destination}</Popup>
                        </Marker>
                      )}
                    </React.Fragment>
                  ))}
                </MapContainer>

                <div className="gmaps-watermark-logo">
                  <span className="gmaps-google-text">OpenStreetMap</span> <span className="gmaps-sub-text">+ Leaflet Live</span>
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
        volunteerName={activeSelectedMission?.volunteer || 'Tanvir Hossain'}
      />
    </div>
  );
}
