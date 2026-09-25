import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import { 
  Users, Leaf, Clock, MapPin, Navigation, Truck, Sparkles, 
  AlertTriangle, ShieldCheck, ArrowUpRight, Activity, Flame, Zap, 
  CheckCircle2, RefreshCw, ExternalLink
} from 'lucide-react';
import Card from '../../../../components/Card/Card';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';
import Modal from '../../../../components/Modal/Modal';
import 'leaflet/dist/leaflet.css';

// SVG Vector Marker Generator for Admin Heatmap
const createAdminSvgPin = (color, emoji) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <path d="M18 0C8.0 0 0 8.0 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8.0 28.0 0 18 0z" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="18" cy="18" r="12" fill="#ffffff" opacity="0.3"/>
      <text x="18" y="20" font-size="16" text-anchor="middle" dominant-baseline="central">${emoji}</text>
    </svg>
  `;
  return L.icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40]
  });
};

const riderPin = createAdminSvgPin('#2563eb', '🛵');
const restaurantPin = createAdminSvgPin('#e11d48', '🏪');
const shelterPin = createAdminSvgPin('#059669', '🏠');

export default function SystemOverviewTab({ theme = 'light' }) {
  const [selectedUrgentMission, setSelectedUrgentMission] = useState(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState('');

  // Emergency Urgent Expiry Radar Feed (<30m)
  const urgentExpiries = [
    {
      id: 'URG-8091',
      title: '35x Mutton Kacchi Biryani Boxes',
      donor: 'Star Kabab & Restaurant (Banani)',
      destination: 'Anjuman Orphanage Shelter (Bashundhara)',
      expiry: '24 mins left',
      portionCount: 35,
      weight: '14.5 kg',
      status: 'UNASSIGNED',
      pickupCoords: [23.7937, 90.4066],
      dropoffCoords: [23.8103, 90.4125]
    },
    {
      id: 'URG-8092',
      title: '20x Chicken Polao & Borhani Packages',
      donor: 'Kacchi Bhai (Banani Road 11)',
      destination: 'Chhoto Moni Nibash (Tejgaon)',
      expiry: '18 mins left',
      portionCount: 20,
      weight: '8.2 kg',
      status: 'UNASSIGNED',
      pickupCoords: [23.7925, 90.4070],
      dropoffCoords: [23.7600, 90.3950]
    }
  ];

  // Map tile URL depending on active Theme
  const mapTileUrl = theme === 'dark' 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const handleManualDispatch = (mission) => {
    setSelectedUrgentMission(mission);
    setIsDispatchModalOpen(true);
    setDispatchStatus('');
  };

  const handleConfirmAutoDispatch = () => {
    setDispatchStatus('Rider Tanvir Hossain (0.4km away) auto-assigned via Priority Dispatch algorithm! 🛵');
    setTimeout(() => {
      setIsDispatchModalOpen(false);
    }, 2000);
  };

  return (
    <div className="tab-pane-system-overview">
      {/* TOP KPI STATS BAR (4 CARDS) */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="kpi-icon-box green">
            <Sparkles size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">TOTAL FOOD SAVED TODAY</span>
            <div className="kpi-value-row">
              <span className="kpi-number">4,850 kg</span>
              <span className="badge-trend green">+18% vs yesterday</span>
            </div>
            <span className="kpi-subtext">Feeds ~9,700 People</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-box blue">
            <Activity size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">ACTIVE RESCUE MISSIONS</span>
            <div className="kpi-value-row">
              <span className="kpi-number">34 Live</span>
              <span className="badge-trend blue">● 28 En-Route</span>
            </div>
            <span className="kpi-subtext">Average Pickup Time: 14m</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-box purple">
            <Users size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">VERIFIED ECOSYSTEM PARTNERS</span>
            <div className="kpi-value-row">
              <span className="kpi-number">500 Total</span>
              <span className="badge-trend purple">148 Restos • 42 NGOs • 310 Riders</span>
            </div>
            <span className="kpi-subtext">12 Applications Pending Verification</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-box emerald">
            <Leaf size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">CO2 EMISSIONS PREVENTED</span>
            <div className="kpi-value-row">
              <span className="kpi-number">12.8 Tons</span>
              <span className="badge-trend emerald">Eco Rank #1 Dhaka</span>
            </div>
            <span className="kpi-subtext">85,000 Liters Water Saved</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID (SPLIT PANE 65% MAP / 35% ESCALATION) */}
      <div className="overview-split-grid">
        
        {/* LEFT PANE (65%): DHAKA REAL-TIME MAP & HEATMAP */}
        <div className="admin-map-card">
          <div className="map-card-header">
            <div className="title-group">
              <Activity size={18} className="live-icon-blue" />
              <h4>Dhaka Ecosystem Heatmap & Live Dispatch Radar</h4>
            </div>
            <div className="map-legend-row">
              <span className="legend-item"><span className="dot red"></span> High Surplus (Banani/Gulshan)</span>
              <span className="legend-item"><span className="dot blue"></span> Active Riders (34)</span>
              <span className="legend-item"><span className="dot green"></span> Shelters (42)</span>
            </div>
          </div>

          <div className="admin-map-viewport">
            <MapContainer 
              center={[23.7950, 90.4070]} 
              zoom={13} 
              scrollWheelZoom={true}
              zoomControl={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                attribution="&copy; Google Maps"
              />

              {/* Heatmap density circles */}
              <Circle center={[23.7937, 90.4066]} radius={600} pathOptions={{ color: '#e11d48', fillColor: '#e11d48', fillOpacity: 0.3 }} />
              <Circle center={[23.8103, 90.4125]} radius={800} pathOptions={{ color: '#059669', fillColor: '#059669', fillOpacity: 0.2 }} />

              {/* Markers */}
              <Marker position={[23.7900, 90.4020]} icon={riderPin}>
                <Popup>🛵 Rider Tanvir Hossain (Online)</Popup>
              </Marker>
              <Marker position={[23.7937, 90.4066]} icon={restaurantPin}>
                <Popup>🏪 Star Kabab Banani (35x Biryani Available)</Popup>
              </Marker>
              <Marker position={[23.8103, 90.4125]} icon={shelterPin}>
                <Popup>🏠 Anjuman Orphanage Shelter (Capacity: 120 Children)</Popup>
              </Marker>

              <Polyline 
                positions={[[23.7900, 90.4020], [23.7937, 90.4066], [23.8103, 90.4125]]} 
                color="#2563eb" 
                weight={4} 
                dashArray="6, 8" 
              />
            </MapContainer>
          </div>
        </div>

        {/* RIGHT PANE (35%): URGENT EXPIRY ESCALATION RADAR */}
        <div className="escalation-card">
          <div className="escalation-header">
            <div className="radar-title-group">
              <span className="pulsing-red-ping"></span>
              <h4>Urgent Expiry Radar (&lt;30m)</h4>
            </div>
            <span className="badge-count-red">{urgentExpiries.length} Critical</span>
          </div>

          <p className="escalation-subtitle">
            Unclaimed food surplus reaching expiry limit. Requires manual priority auto-dispatch.
          </p>

          <div className="urgent-feed-stack">
            {urgentExpiries.map((item) => (
              <div key={item.id} className="urgent-item-card">
                <div className="item-top-bar">
                  <span className="item-id">{item.id}</span>
                  <span className="expiry-tag">⏳ {item.expiry}</span>
                </div>

                <h5 className="food-name">{item.title}</h5>
                <p className="location-line">🏪 {item.donor}</p>
                <p className="location-line">🏠 {item.destination}</p>

                <div className="item-meta-row">
                  <span className="meta-pill">{item.portionCount} Portions</span>
                  <span className="meta-pill">{item.weight}</span>
                </div>

                <button 
                  className="btn-dispatch-escalate"
                  onClick={() => handleManualDispatch(item)}
                >
                  ⚡ Priority Auto-Dispatch Rider
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* MODAL: MANUAL PRIORITY AUTO-DISPATCH */}
      <Modal 
        isOpen={isDispatchModalOpen} 
        onClose={() => setIsDispatchModalOpen(false)}
        title="⚡ Emergency Priority Rider Auto-Dispatch"
      >
        {selectedUrgentMission && (
          <div className="dispatch-modal-content">
            <div className="urgent-summary-banner">
              <AlertTriangle size={24} color="#dc2626" />
              <div>
                <h4>{selectedUrgentMission.title}</h4>
                <p>Donor: {selectedUrgentMission.donor} • Expiring in {selectedUrgentMission.expiry}</p>
              </div>
            </div>

            <div className="rider-match-box">
              <h5>Recommended Nearby Available Rider:</h5>
              <div className="rider-card-mini">
                <div className="r-avatar">👨‍🌾</div>
                <div className="r-info">
                  <strong>Tanvir Hossain (Rider #V-9042)</strong>
                  <p>⭐ 4.9 Rating • Banani Sector • 0.4 km from Star Kabab</p>
                </div>
                <span className="badge-online">🟢 Idle & Ready</span>
              </div>
            </div>

            {dispatchStatus && (
              <div className="dispatch-success-notice">
                <CheckCircle2 size={18} /> {dispatchStatus}
              </div>
            )}

            <div className="modal-actions-right">
              <Button variant="secondary" onClick={() => setIsDispatchModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmAutoDispatch}>
                Confirm Priority Dispatch 🛵
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
