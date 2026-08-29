import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { 
  Search, Sliders, ShieldCheck, MapPin, Clock, Users, Flame, 
  Utensils, CheckCircle2, Navigation, HeartHandshake, Layers, 
  Package, History, Settings, LogOut, ArrowRight 
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Badge from '../../components/Badge/Badge';
import NgoClaimModal from './components/NgoClaimModal/NgoClaimModal';
import 'leaflet/dist/leaflet.css';
import './NgoDashboard.css';

// Custom Marker Generator for Leaflet Google Maps
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

export default function NgoDashboard() {
  const [activeTab, setActiveTab] = useState('DISCOVER');
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState(3.0);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
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

  // Surplus Food Mock Data
  const surplusFeed = [
    {
      id: 'FOOD-101',
      title: 'Spicy Chicken Biryani (20 Portions)',
      donor: 'Star Chef Bistro',
      area: 'Banani, Dhaka',
      distance: '0.8 km away',
      beneficiaries: 'Feeds ~40 Children',
      expiry: 'Expires in 35 mins',
      urgency: 'HIGH',
      safetyTags: ['Halal Certified', 'Hot Sealed Package'],
      category: 'COOKED',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      coordinates: [23.7937, 90.4047]
    },
    {
      id: 'FOOD-102',
      title: 'Mixed Vegetable Curry & Parathas (35 Packs)',
      donor: 'Harbor Cafe & Diner',
      area: 'Gulshan 1, Dhaka',
      distance: '1.4 km away',
      beneficiaries: 'Feeds ~50 People',
      expiry: 'Expires in 1h 45m',
      urgency: 'NORMAL',
      safetyTags: ['Vegetarian', 'Warm Pack'],
      category: 'COOKED',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
      coordinates: [23.7880, 90.4120]
    },
    {
      id: 'FOOD-103',
      title: 'Fresh Artisan Bread & Croissant Basket',
      donor: 'Daily Crust Bakery',
      area: 'Bashundhara R/A, Dhaka',
      distance: '2.1 km away',
      beneficiaries: 'Feeds ~25 Children',
      expiry: 'Expires in 3h 10m',
      urgency: 'NORMAL',
      safetyTags: ['Bakery Fresh', 'Room Temp'],
      category: 'BAKERY',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      coordinates: [23.8220, 90.4270]
    }
  ];

  // Map Coordinates & Markers
  const dhakaCenter = [23.8050, 90.4180];
  const ngoShelterPos = [23.8150, 90.4210]; // Anjuman Shelter

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
          <div className="ngo-logo-icon">🌿</div>
          <div>
            <span className="brand-name">FoodRescue</span>
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

        {/* Footer Help & Logout */}
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
                {surplusFeed.map((food) => (
                  <Card key={food.id} hover={false} className="food-feed-card">
                    <div className="card-image-wrap">
                      <img src={food.image} alt={food.title} className="food-card-img" />
                      <div className={`expiry-floating-badge ${food.urgency === 'HIGH' ? 'urgent-bg' : ''}`}>
                        <Flame size={14} /> {food.expiry}
                      </div>
                    </div>

                    <div className="card-content-body">
                      <div className="donor-meta-row">
                        <span className="donor-name">🏪 {food.donor}</span>
                        <span className="donor-dist"><MapPin size={13} /> {food.distance}</span>
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
                          onClick={() => handleOpenClaimModal(food)}
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
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: REAL GOOGLE MAPS TILE CANVAS */}
            <div className="ngo-map-panel">
              <Card hover={false} className="ngo-map-card">
                <div className="ngo-map-wrapper">
                  {/* Floating Map Status Overlay */}
                  <div className="map-top-status-pill">
                    <span className="live-pulse-dot"></span>
                    <span>● {surplusFeed.length} Donor Posts Available Nearby</span>
                  </div>

                  <MapContainer
                    center={dhakaCenter}
                    zoom={13}
                    scrollWheelZoom={true}
                    className="leaflet-map-canvas"
                  >
                    <TileLayer
                      url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                      attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
                    />

                    {/* NGO Shelter Marker */}
                    <Marker
                      position={ngoShelterPos}
                      icon={createGoogleMarker('🏢', '#059669', 'Anjuman Shelter (Destination)', true)}
                    >
                      <Popup>
                        <strong>Anjuman Orphanage Shelter</strong><br />Verified Recipient Destination
                      </Popup>
                    </Marker>

                    {/* Food Donors Markers */}
                    {surplusFeed.map((item) => (
                      <Marker
                        key={item.id}
                        position={item.coordinates}
                        icon={createGoogleMarker(
                          item.category === 'BAKERY' ? '🍞' : '🍲',
                          item.urgency === 'HIGH' ? '#ea4335' : '#f97316',
                          `${item.donor} (${item.expiry})`
                        )}
                      >
                        <Popup>
                          <div className="map-popup-card">
                            <strong>{item.title}</strong>
                            <p>{item.donor} • {item.distance}</p>
                            <span className="popup-badge">{item.beneficiaries}</span>
                            <button
                              className="popup-claim-btn"
                              onClick={() => handleOpenClaimModal(item)}
                            >
                              Quick Claim
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>

                  <div className="gmaps-watermark-logo">
                    <span className="gmaps-google-text">Google</span> <span className="gmaps-sub-text">Maps Live</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'CLAIMS' && (
          <div className="active-claims-view">
            <div className="feed-header">
              <h1 className="feed-title">Active Claimed Rescues</h1>
              <p className="feed-sub">Track active pickups dispatched to your shelter.</p>
            </div>

            <div className="claims-grid">
              {claimedItems.map((claim) => (
                <Card key={claim.id} hover={false} className="claim-card">
                  <div className="claim-card-top">
                    <Badge theme="fresh">🚚 {claim.status}</Badge>
                    <span className="claim-time">Claimed at {claim.claimedAt}</span>
                  </div>
                  <h3 className="claim-food-title">{claim.title}</h3>
                  <p className="claim-donor-text">🏪 {claim.donor}</p>
                  <div className="claim-eta-box">
                    <Clock size={16} className="icon-blue" />
                    <span>Rider Arrival ETA: <strong>{claim.eta}</strong></span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
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
