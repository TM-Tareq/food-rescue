import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { 
  Search, Sliders, ShieldCheck, MapPin, Clock, Users, Flame, 
  Utensils, CheckCircle2, Navigation, HeartHandshake, Layers, 
  Package, History, Settings, LogOut, ArrowRight, Leaf, Route 
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Badge from '../../components/Badge/Badge';
import NgoClaimModal from './components/NgoClaimModal/NgoClaimModal';
import NgoActiveClaimsTab from './components/NgoActiveClaimsTab/NgoActiveClaimsTab';
import NgoLogisticsTab from './components/NgoLogisticsTab/NgoLogisticsTab';
import NgoImpactHistoryTab from './components/NgoImpactHistoryTab/NgoImpactHistoryTab';
import NgoSettingsTab from './components/NgoSettingsTab/NgoSettingsTab';
import 'leaflet/dist/leaflet.css';
import './NgoDashboard.css';

// Pure Vector SVG Google Map Pin Generator
const createSvgPinMarker = (color, emoji) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
      <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.059 27.941 0 18 0z" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="18" cy="18" r="12" fill="#ffffff" opacity="0.2"/>
      <text x="18" y="20" font-size="16" text-anchor="middle" dominant-baseline="central">${emoji}</text>
    </svg>
  `;
  return L.icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`,
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -42]
  });
};

export default function NgoDashboard() {
  const [activeTab, setActiveTab] = useState('DISCOVER');
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState(3.0);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [focusedFoodId, setFocusedFoodId] = useState('FOOD-101');
  
  // Claim Modal State
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  // Active Claims Counter State
  const [claimedItems, setClaimedItems] = useState([
    {
      id: 'CLAIM-901',
      title: 'Assorted Fresh Bakery Pack (15 Packs)',
      donor: 'Green Bistro Cafe (Gulshan 2)',
      claimedAt: '10:45 AM',
      status: 'RIDER_EN_ROUTE',
      eta: '12 mins'
    }
  ]);

  // Surplus Food Mock Data with Real Road Coordinates & Road Distance
  const surplusFeed = [
    {
      id: 'FOOD-101',
      title: 'Spicy Chicken Biryani (20 Portions)',
      donor: 'Star Chef Bistro',
      area: 'Banani, Dhaka',
      distance: '1.2 km via Kemal Ataturk & Progati Sarani',
      beneficiaries: 'Feeds ~40 Children',
      expiry: 'Expires in 35 mins',
      urgency: 'HIGH',
      safetyTags: ['Halal Certified', 'Hot Sealed Package'],
      category: 'COOKED',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      coordinates: [23.7937, 90.4047], // Banani
      // Real Road Waypoints (Following Kemal Ataturk Ave -> Progati Sarani Rd -> Anjuman Shelter)
      roadPath: [
        [23.7937, 90.4047], // Banani Kemal Ataturk Start
        [23.7937, 90.4200], // Kemal Ataturk & Progati Sarani Intersection
        [23.8050, 90.4210], // Progati Sarani North
        [23.8150, 90.4210]  // Anjuman Shelter Destination
      ]
    },
    {
      id: 'FOOD-102',
      title: 'Mixed Vegetable Curry & Parathas (35 Packs)',
      donor: 'Harbor Cafe & Diner',
      area: 'Gulshan 1, Dhaka',
      distance: '2.4 km via Gulshan Ave & Progati Sarani',
      beneficiaries: 'Feeds ~50 People',
      expiry: 'Expires in 1h 45m',
      urgency: 'NORMAL',
      safetyTags: ['Vegetarian', 'Warm Pack'],
      category: 'COOKED',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
      coordinates: [23.7880, 90.4120], // Gulshan 1
      // Real Road Waypoints (Gulshan 1 -> Gulshan 2 -> Progati Sarani -> Anjuman Shelter)
      roadPath: [
        [23.7880, 90.4120], // Gulshan 1 Circle
        [23.7980, 90.4150], // Gulshan 2 Circle
        [23.8050, 90.4180], // Connecting Avenue
        [23.8150, 90.4210]  // Anjuman Shelter Destination
      ]
    },
    {
      id: 'FOOD-103',
      title: 'Fresh Artisan Bread & Croissant Basket',
      donor: 'Daily Crust Bakery',
      area: 'Bashundhara R/A, Dhaka',
      distance: '1.1 km via Bashundhara Main Rd',
      beneficiaries: 'Feeds ~25 Children',
      expiry: 'Expires in 3h 10m',
      urgency: 'NORMAL',
      safetyTags: ['Bakery Fresh', 'Room Temp'],
      category: 'BAKERY',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      coordinates: [23.8220, 90.4270], // Bashundhara R/A
      // Real Road Waypoints (Bashundhara Main Rd -> Anjuman Shelter)
      roadPath: [
        [23.8220, 90.4270], // Bashundhara Main Rd
        [23.8180, 90.4230], // Gate Entrance
        [23.8150, 90.4210]  // Anjuman Shelter Destination
      ]
    }
  ];

  // Map Coordinates & NGO Location
  const ngoShelterPos = [23.8150, 90.4210]; // Anjuman Shelter Center (Bashundhara / Progati Sarani)

  const focusedItem = surplusFeed.find(f => f.id === focusedFoodId) || surplusFeed[0];

  // Category Color & Emoji Map
  const getCategoryColor = (item) => {
    if (item.category === 'BAKERY') return '#d97706'; // Amber Gold
    if (item.category === 'DRY') return '#8b5cf6';    // Purple
    if (item.urgency === 'HIGH') return '#ea4335';     // Google Red
    return '#f97316';                                  // Warm Orange
  };

  const getCategoryEmoji = (item) => {
    if (item.category === 'BAKERY') return '🍞';
    if (item.category === 'DRY') return '📦';
    if (item.urgency === 'HIGH') return '🔥';
    return '🍲';
  };

  const handleOpenClaimModal = (item) => {
    setSelectedFoodItem(item);
    setIsClaimModalOpen(true);
  };

  const handleConfirmClaim = (claimDetails) => {
    if (!selectedFoodItem) return;

    setClaimedItems([
      {
        id: `CLAIM-${Date.now().toString().slice(-3)}`,
        title: selectedFoodItem.title,
        donor: selectedFoodItem.donor,
        claimedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: claimDetails.transportChoice === 'VOLUNTEER' ? 'DISPATCHING_RIDER' : 'SELF_PICKUP_ASSIGNED',
        eta: '15 mins'
      },
      ...claimedItems
    ]);

    alert(`Success! Surplus Food "${selectedFoodItem.title}" claimed for Anjuman Shelter.`);
  };

  return (
    <div className="ngo-portal-container">
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="ngo-sidebar">
        <div className="ngo-brand">
          <div className="ngo-logo-icon">
            <Leaf size={22} />
          </div>
          <div>
            <span className="brand-name">Food<span className="brand-highlight">Rescue</span></span>
            <span className="brand-sub">NGO Recipient Portal</span>
          </div>
        </div>

        {/* Verified NGO Profile Box */}
        <div className="ngo-profile-card">
          <div className="ngo-avatar">🏢</div>
          <div className="ngo-profile-info">
            <span className="ngo-name">Anjuman Shelter</span>
            <span className="ngo-tier-badge">
              <ShieldCheck size={12} /> Tier-1 Verified NGO
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="ngo-nav">
          <button
            className={`ngo-nav-item ${activeTab === 'DISCOVER' ? 'nav-active' : ''}`}
            onClick={() => setActiveTab('DISCOVER')}
          >
            <Search size={18} />
            <span>Discover Surplus</span>
          </button>

          <button
            className={`ngo-nav-item ${activeTab === 'CLAIMS' ? 'nav-active' : ''}`}
            onClick={() => setActiveTab('CLAIMS')}
          >
            <Package size={18} />
            <span>Active Claims</span>
            <span className="nav-badge-count">{claimedItems.length}</span>
          </button>

          <button
            className={`ngo-nav-item ${activeTab === 'LOGISTICS' ? 'nav-active' : ''}`}
            onClick={() => setActiveTab('LOGISTICS')}
          >
            <Navigation size={18} />
            <span>Rescue Logistics</span>
          </button>

          <button
            className={`ngo-nav-item ${activeTab === 'HISTORY' ? 'nav-active' : ''}`}
            onClick={() => setActiveTab('HISTORY')}
          >
            <History size={18} />
            <span>Impact History</span>
          </button>

          <button
            className={`ngo-nav-item ${activeTab === 'SETTINGS' ? 'nav-active' : ''}`}
            onClick={() => setActiveTab('SETTINGS')}
          >
            <Settings size={18} />
            <span>Shelter Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="ngo-footer-btn">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="ngo-main-content">
        {activeTab === 'DISCOVER' && (
          <div className="discovery-split-layout">
            {/* MIDDLE COLUMN: SURPLUS DISCOVERY FEED */}
            <div className="discovery-feed-panel">
              <div className="feed-header">
                <div>
                  <h1 className="feed-title">Nearby Surplus Food Feed</h1>
                  <p className="feed-sub">Claim free surplus meals for orphanages & shelters within your radius.</p>
                </div>
              </div>

              {/* Filter & Radius Control Card */}
              <div className="filter-controls-card">
                <div className="search-input-box">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search donor restaurants, area, food items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="feed-search-input"
                  />
                </div>

                <div className="radius-slider-row">
                  <div className="radius-label-box">
                    <Sliders size={14} />
                    <span>Rescue Radius: <strong>{radiusKm} km</strong></span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="10.0"
                    step="0.5"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
                    className="radius-range-slider"
                  />
                </div>

                <div className="category-chips-row">
                  <button
                    className={`chip-btn ${selectedCategory === 'ALL' ? 'chip-active' : ''}`}
                    onClick={() => setSelectedCategory('ALL')}
                  >
                    All Foods
                  </button>
                  <button
                    className={`chip-btn ${selectedCategory === 'URGENT' ? 'chip-active' : ''}`}
                    onClick={() => setSelectedCategory('URGENT')}
                  >
                    🔥 Urgent (&lt; 45m)
                  </button>
                  <button
                    className={`chip-btn ${selectedCategory === 'COOKED' ? 'chip-active' : ''}`}
                    onClick={() => setSelectedCategory('COOKED')}
                  >
                    🍲 Hot Cooked
                  </button>
                  <button
                    className={`chip-btn ${selectedCategory === 'BAKERY' ? 'chip-active' : ''}`}
                    onClick={() => setSelectedCategory('BAKERY')}
                  >
                    🍞 Bakery & Bread
                  </button>
                </div>
              </div>

              {/* Food Listings Feed Grid */}
              <div className="food-cards-feed">
                {surplusFeed.map((food) => {
                  const isFocused = food.id === focusedFoodId;

                  return (
                    <Card
                      key={food.id}
                      hover={true}
                      className={`food-feed-card ${isFocused ? 'food-card-focused' : ''}`}
                      onClick={() => setFocusedFoodId(food.id)}
                    >
                      <div className="card-image-wrap">
                        <img src={food.image} alt={food.title} className="food-card-img" />
                        <div className={`expiry-floating-badge ${food.urgency === 'HIGH' ? 'urgent-bg' : ''}`}>
                          <Flame size={14} /> {food.expiry}
                        </div>
                      </div>

                      <div className="card-content-body">
                        <div className="donor-meta-row">
                          <span className="donor-name">🏪 {food.donor}</span>
                          <span className="donor-dist"><Route size={13} /> {food.distance}</span>
                        </div>

                        <h3 className="food-item-title">{food.title}</h3>

                        {/* Beneficiaries & Safety Tags */}
                        <div className="tags-row">
                          <span className="tag-chip feed-count-chip">
                            <Users size={13} /> {food.beneficiaries}
                          </span>
                          {food.safetyTags.map((tag, idx) => (
                            <span key={idx} className="tag-chip safety-chip">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Claim Action Bar */}
                        <div className="card-action-bar">
                          <Button
                            variant="emerald"
                            size="md"
                            icon={HeartHandshake}
                            onClick={(e) => { e.stopPropagation(); handleOpenClaimModal(food); }}
                            className="claim-primary-btn"
                          >
                            🤝 Claim Surplus Food
                          </Button>
                          <Button variant="outline" size="md">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: REAL GOOGLE MAPS TILE CANVAS */}
            <div className="ngo-map-panel">
              <Card hover={false} className="ngo-map-card">
                <div className="ngo-map-wrapper">
                  {/* Floating Active Route Distance Badge */}
                  <div className="map-top-status-pill">
                    <Route size={15} className="icon-blue" />
                    <span>Active Route: <strong>{focusedItem.distance}</strong></span>
                  </div>

                  <MapContainer
                    center={focusedItem.coordinates}
                    zoom={13}
                    scrollWheelZoom={true}
                    className="leaflet-map-canvas"
                    key={focusedFoodId}
                  >
                    <TileLayer
                      url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                      attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
                    />

                    {/* NGO Shelter Destination Vector SVG Pin */}
                    <Marker
                      position={ngoShelterPos}
                      icon={createSvgPinMarker('#059669', '🏢')}
                    >
                      <Popup className="gmaps-clean-popup">
                        <div className="popup-card-content">
                          <div className="popup-badge green-badge">🏢 NGO Shelter Destination</div>
                          <strong className="popup-title">Anjuman Orphanage Shelter</strong>
                          <p className="popup-sub">Verified Recipient Center (Bashundhara)</p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Donor Vector SVG Pins & Real Road Polylines */}
                    {surplusFeed.map((item) => {
                      const isFocused = item.id === focusedFoodId;
                      const pinColor = getCategoryColor(item);
                      const pinEmoji = getCategoryEmoji(item);

                      const markerIcon = createSvgPinMarker(pinColor, pinEmoji);

                      return (
                        <React.Fragment key={item.id}>
                          {/* REAL ROAD NETWORK POLYLINE (Following Dhaka Avenues instead of straight lines) */}
                          <Polyline
                            positions={item.roadPath}
                            pathOptions={{
                              color: isFocused ? '#2563eb' : '#cbd5e1',
                              weight: isFocused ? 6 : 3,
                              opacity: isFocused ? 0.95 : 0.4,
                              lineCap: 'round',
                              lineJoin: 'round'
                            }}
                          />

                          <Marker position={item.coordinates} icon={markerIcon}>
                            <Popup className="gmaps-clean-popup">
                              <div className="popup-card-content">
                                <strong className="popup-title">{item.title}</strong>
                                <p className="popup-sub">🏪 {item.donor} ({item.distance})</p>
                                <span className="popup-feed-count">{item.beneficiaries}</span>

                                <button
                                  className="popup-claim-btn"
                                  onClick={() => handleOpenClaimModal(item)}
                                >
                                  🤝 Claim Food Now
                                </button>
                              </div>
                            </Popup>
                          </Marker>
                        </React.Fragment>
                      );
                    })}
                  </MapContainer>

                  {/* MAP LEGEND OVERLAY BAR (Clean UX Explanation) */}
                  <div className="map-legend-overlay">
                    <span className="legend-title">Map Pin Legend:</span>
                    <div className="legend-items-list">
                      <span className="legend-item"><span className="dot red-dot"></span> 🔴 🔥 Urgent (&lt;45m)</span>
                      <span className="legend-item"><span className="dot orange-dot"></span> 🟠 🍲 Cooked Meal</span>
                      <span className="legend-item"><span className="dot gold-dot"></span> 🟡 🍞 Bakery Fresh</span>
                      <span className="legend-item"><span className="dot green-dot"></span> 🟢 🏢 NGO Shelter</span>
                    </div>
                  </div>

                  <div className="gmaps-watermark-logo">
                    <span className="gmaps-google-text">Google</span> <span className="gmaps-sub-text">Maps Live</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'CLAIMS' && (
          <NgoActiveClaimsTab onSwitchToDiscover={() => setActiveTab('DISCOVER')} />
        )}

        {activeTab === 'LOGISTICS' && (
          <NgoLogisticsTab onSwitchToDiscover={() => setActiveTab('DISCOVER')} />
        )}

        {activeTab === 'HISTORY' && (
          <NgoImpactHistoryTab />
        )}

        {activeTab === 'SETTINGS' && (
          <NgoSettingsTab />
        )}
      </main>

      {/* Claim Transport Choice Modal */}
      <NgoClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        foodItem={selectedFoodItem}
        onConfirmClaim={handleConfirmClaim}
      />
    </div>
  );
}
