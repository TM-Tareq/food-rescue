import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { 
  Bike, Navigation, ShieldCheck, Clock, MapPin, CheckCircle2, 
  AlertTriangle, PhoneCall, Star, Award, Heart, Sparkles, Zap, 
  ChevronRight, ArrowLeft, RefreshCw, User, Settings, LogOut, 
  Layers, Check, Copy, Bell, Maximize2, Minimize2, CheckSquare,
  TrendingUp, Shield, Flame
} from 'lucide-react';
import Button from '../../components/Button/Button';
import Badge from '../../components/Badge/Badge';
import Modal from '../../components/Modal/Modal';
import 'leaflet/dist/leaflet.css';
import './VolunteerApp.css';

// SVG Vector Marker Generator for Mobile GPS Map
const createRiderSvgPin = (color, emoji) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
      <path d="M20 0C9.0 0 0 9.0 0 20c0 15 20 28 20 28s20-13 20-28C40 9.0 31.0 0 20 0z" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="20" cy="20" r="14" fill="#ffffff" opacity="0.3"/>
      <text x="20" y="22" font-size="18" text-anchor="middle" dominant-baseline="central">${emoji}</text>
    </svg>
  `;
  return L.icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -44]
  });
};

const riderPin = createRiderSvgPin('#2563eb', '🛵');
const restaurantPin = createRiderSvgPin('#e11d48', '🏪');
const shelterPin = createRiderSvgPin('#059669', '🏠');

export default function VolunteerApp() {
  const [activeTab, setActiveTab] = useState('dispatch'); // 'dispatch', 'feed', 'impact', 'profile'
  const [isOnline, setIsOnline] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [vehicleType, setVehicleType] = useState('motorbike'); // 'motorbike', 'bicycle', 'car', 'walk'
  
  // Splash Screen Intro State
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [splashProgress, setSplashProgress] = useState(15);
  const [splashStatusText, setSplashStatusText] = useState('Connecting to Rescue Network...');

  // Splash Timer Effect (Smoother & Slower Cinematic Intro)
  useEffect(() => {
    if (!showSplashScreen) return;

    setSplashProgress(12);
    setSplashStatusText('Connecting to FoodRescue Network...');

    const t1 = setTimeout(() => {
      setSplashProgress(45);
      setSplashStatusText('Scanning Nearby Surplus Dispatches...');
    }, 1200);

    const t2 = setTimeout(() => {
      setSplashProgress(80);
      setSplashStatusText('Verifying Hero Rider Credentials...');
    }, 2600);

    const t3 = setTimeout(() => {
      setSplashProgress(100);
      setSplashStatusText('Welcome back, Tanvir! 🛵');
    }, 3800);

    const t4 = setTimeout(() => {
      setShowSplashScreen(false);
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [showSplashScreen]);

  const handleReplaySplash = () => {
    setShowSplashScreen(true);
  };
  
  // Mission Execution Workflow State
  // 0: idle / dispatch alert available
  // 1: accepted -> en route to restaurant
  // 2: arrived at restaurant -> OTP pickup modal / entry
  // 3: picked up -> en route to shelter
  // 4: arrived at shelter -> handover confirmation
  // 5: completed receipt celebration
  const [missionStep, setMissionStep] = useState(1);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);

  // Active Mission Data
  const [activeMission, setActiveMission] = useState({
    id: 'RESCUE-8091',
    restaurantName: 'Star Kabab & Restaurant',
    restaurantAddress: 'Block D, Banani Road 11, Dhaka',
    restaurantPhone: '+880 1711-987654',
    shelterName: 'Anjuman Orphanage Shelter',
    shelterAddress: 'Plot 4, Road 2, Block B, Bashundhara R/A',
    shelterPhone: '+880 1819-123456',
    foodItem: '35x Mutton Kacchi Biryani Boxes',
    weight: '14.5 kg (Feeds 35 Children)',
    expiryTime: '42 mins left',
    karmaPoints: 50,
    requiredOtp: '4892',
    pickupCoords: [23.7937, 90.4066], // Banani
    dropoffCoords: [23.8103, 90.4125], // Bashundhara
    riderCoords: [23.7900, 90.4020]    // Current Rider
  });

  // Polyline coordinates for map route
  const routePolyline = [
    activeMission.riderCoords,
    activeMission.pickupCoords,
    activeMission.dropoffCoords
  ];

  // Feed Rescues
  const availableRescues = [
    {
      id: 'REC-901',
      title: 'Kacchi Bhai Banani',
      food: '20 Platter Boxes (Kacchi & Borhani)',
      dist: '0.7 km away',
      expiry: '30 mins left',
      karma: 40,
      urgency: 'HIGH'
    },
    {
      id: 'REC-902',
      title: 'Dhakaiya Mezban',
      food: '15 Beef Roast Packages & Naan',
      dist: '1.4 km away',
      expiry: '1.5 hours left',
      karma: 30,
      urgency: 'MEDIUM'
    },
    {
      id: 'REC-903',
      title: 'Takeout Burgers Gulshan',
      food: '12 Gourmet Chicken Burgers & Fries',
      dist: '2.1 km away',
      expiry: '2 hours left',
      karma: 25,
      urgency: 'NORMAL'
    }
  ];

  // OTP Verification Handler
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpInput.trim() === activeMission.requiredOtp) {
      setOtpError('');
      setIsOtpModalOpen(false);
      setMissionStep(3); // Move to En Route to Shelter
    } else {
      setOtpError('Invalid OTP! Please check with the restaurant manager.');
    }
  };

  // Complete Mission Handler
  const handleCompleteMission = () => {
    setMissionStep(5);
    setIsCelebrationModalOpen(true);
  };

  // Reset demo mission
  const handleResetMission = () => {
    setIsCelebrationModalOpen(false);
    setMissionStep(0);
    setOtpInput('');
  };

  // Quick Simulation Jumper
  const handleJumpToStep = (stepNumber) => {
    setActiveTab('dispatch');
    setMissionStep(stepNumber);
    if (stepNumber === 2) {
      setIsOtpModalOpen(true);
    } else {
      setIsOtpModalOpen(false);
    }
    if (stepNumber === 5) {
      setIsCelebrationModalOpen(true);
    } else {
      setIsCelebrationModalOpen(false);
    }
  };

  return (
    <div className={`volunteer-app-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {/* Laptop Preview & Simulation Bar */}
      <div className="laptop-preview-bar">
        <div className="preview-info">
          <span className="live-indicator">● LIVE INTERACTIVE DEMO</span>
          <strong>FoodRescue Volunteer Mobile App</strong>
        </div>
        <div className="simulation-pills">
          <span className="sim-label">Simulate Workflow:</span>
          <button className="sim-btn sim-replay" onClick={handleReplaySplash} title="Replay Splash Screen Intro">
            🎬 Intro Animation
          </button>
          <button className={`sim-btn ${missionStep === 0 ? 'active' : ''}`} onClick={() => handleJumpToStep(0)}>
            ⚡ 1. Alert
          </button>
          <button className={`sim-btn ${missionStep === 1 ? 'active' : ''}`} onClick={() => handleJumpToStep(1)}>
            🏪 2. Pickup
          </button>
          <button className={`sim-btn ${missionStep === 2 ? 'active' : ''}`} onClick={() => handleJumpToStep(2)}>
            🔑 3. OTP
          </button>
          <button className={`sim-btn ${missionStep === 3 ? 'active' : ''}`} onClick={() => handleJumpToStep(3)}>
            🚚 4. Delivery
          </button>
          <button className={`sim-btn ${missionStep === 5 ? 'active' : ''}`} onClick={() => handleJumpToStep(5)}>
            🎉 5. Karma Receipt
          </button>
        </div>
        <div className="preview-actions">
          <button 
            className="toggle-fullscreen-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            {isFullscreen ? ' Exit Fullscreen' : ' Fullscreen Device'}
          </button>
        </div>
      </div>

      {/* Centered Smartphone Device Shell */}
      <div className="smartphone-device-shell">
        {/* Mobile App Splash Screen Intro Animation */}
        {showSplashScreen && (
          <div className="mobile-splash-screen">
            <div className="splash-brand-hero">
              <div className="splash-glow-ring"></div>
              <div className="splash-icon-box">
                <span className="splash-emoji">🛵</span>
              </div>
            </div>

            <div className="splash-text-group">
              <h2 className="splash-app-name">FoodRescue <span className="highlight-hero">Hero</span></h2>
              <p className="splash-tagline">Zero Waste • Feeding Hope</p>
            </div>

            <div className="splash-loader-block">
              <div className="splash-progress-track">
                <div 
                  className="splash-progress-fill" 
                  style={{ width: `${splashProgress}%` }}
                ></div>
              </div>
              <span className="splash-status-lbl">{splashStatusText}</span>
            </div>

            <button 
              className="btn-skip-splash"
              onClick={() => setShowSplashScreen(false)}
            >
              Skip Intro ➔
            </button>
          </div>
        )}

        {/* Speaker Notch */}
        <div className="phone-notch-bar">
          <div className="speaker-slot"></div>
          <div className="camera-lens"></div>
        </div>

        {/* Status Bar */}
        <div className="phone-status-bar">
          <span className="status-time">9:41</span>
          <div className="status-icons">
            <span className="icon-signal">📶</span>
            <span className="icon-wifi">📶</span>
            <span className="icon-battery">🔋 98%</span>
          </div>
        </div>

        {/* Top Profile & Duty Bar */}
        <div className="app-top-header">
          <div className="rider-avatar-box">
            <div className="avatar-circle">
              <span className="avatar-emoji">👨‍🌾</span>
              <span className="badge-online-dot"></span>
            </div>
            <div className="rider-meta">
              <h3 className="rider-name">Tanvir Hossain</h3>
              <p className="rider-rating">⭐ 4.9 (84 Rescues) • <span className="hero-level">Hero Lvl 4</span></p>
            </div>
          </div>

          <div className="duty-toggle-box">
            <button 
              className={`duty-pill ${isOnline ? 'duty-online' : 'duty-offline'}`}
              onClick={() => setIsOnline(!isOnline)}
            >
              <span className="pulse-dot"></span>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </button>
          </div>
        </div>

        {/* Main App Content Viewport */}
        <div className="app-body-content">
          
          {/* TAB 1: MISSIONS & LIVE DISPATCH MAP */}
          {activeTab === 'dispatch' && (
            <div className="tab-pane-dispatch">
              
              {/* Map Canvas Header */}
              <div className="mobile-map-wrapper">
                <MapContainer 
                  center={[23.8000, 90.4080]} 
                  zoom={13} 
                  scrollWheelZoom={true}
                  zoomControl={true}
                  doubleClickZoom={true}
                  dragging={true}
                  touchZoom={true}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap"
                  />
                  <Marker position={activeMission.riderCoords} icon={riderPin}>
                    <Popup>🛵 You (Rider Tanvir)</Popup>
                  </Marker>
                  <Marker position={activeMission.pickupCoords} icon={restaurantPin}>
                    <Popup>🏪 Pickup: {activeMission.restaurantName}</Popup>
                  </Marker>
                  <Marker position={activeMission.dropoffCoords} icon={shelterPin}>
                    <Popup>🏠 Dropoff: {activeMission.shelterName}</Popup>
                  </Marker>
                  <Polyline positions={routePolyline} color="#2563eb" weight={4} dashArray="6, 8" />
                </MapContainer>

                <div className="map-overlay-badge">
                  <Navigation size={14} /> Live GPS Route: <strong>Banani ➔ Bashundhara</strong>
                </div>
              </div>

              {/* Mission Dispatch Sheet */}
              <div className="mission-sheet-card">
                {missionStep === 0 && (
                  <div className="idle-dispatch-alert">
                    <div className="alert-header-row">
                      <span className="radar-ping">⚡ NEW RESCUE NEARBY</span>
                      <span className="timer-tag">⏳ 42m Expiry</span>
                    </div>

                    <h4 className="alert-food-title">🍲 35x Mutton Biryani Packets</h4>
                    <p className="alert-restaurant">🏪 <strong>Star Kabab & Restaurant</strong> (Banani - 0.8 km)</p>
                    <p className="alert-shelter">🏠 Deliver to: <strong>Anjuman Orphanage Shelter</strong></p>

                    <div className="karma-reward-banner">
                      <Sparkles size={16} color="#d97706" />
                      <span>Earn <strong>+50 Karma Points</strong> on Completion</span>
                    </div>

                    <div className="dispatch-action-grid">
                      <button 
                        className="btn-accept-dispatch"
                        onClick={() => setMissionStep(1)}
                      >
                        ✅ Accept Rescue Mission
                      </button>
                    </div>
                  </div>
                )}

                {missionStep > 0 && missionStep < 5 && (
                  <div className="active-workflow-container">
                    {/* Stepper Header */}
                    <div className="workflow-stepper-bar">
                      <div className={`step-item ${missionStep >= 1 ? 'step-active' : ''}`}>
                        <div className="step-num">1</div>
                        <span>To Resto</span>
                      </div>
                      <div className="step-line"></div>
                      <div className={`step-item ${missionStep >= 2 ? 'step-active' : ''}`}>
                        <div className="step-num">2</div>
                        <span>OTP</span>
                      </div>
                      <div className="step-line"></div>
                      <div className={`step-item ${missionStep >= 3 ? 'step-active' : ''}`}>
                        <div className="step-num">3</div>
                        <span>To Shelter</span>
                      </div>
                      <div className="step-line"></div>
                      <div className={`step-item ${missionStep >= 4 ? 'step-active' : ''}`}>
                        <div className="step-num">4</div>
                        <span>Deliver</span>
                      </div>
                    </div>

                    {/* Step Content */}
                    {missionStep === 1 && (
                      <div className="step-card-body">
                        <div className="location-pin-group">
                          <span className="pin-icon red">🏪</span>
                          <div>
                            <div className="pin-label">PICKUP LOCATION</div>
                            <div className="pin-title">{activeMission.restaurantName}</div>
                            <div className="pin-sub">{activeMission.restaurantAddress}</div>
                          </div>
                        </div>

                        <div className="contact-actions-row">
                          <a href={`tel:${activeMission.restaurantPhone}`} className="btn-phone-call">
                            <PhoneCall size={14} /> Call Manager
                          </a>
                        </div>

                        <button 
                          className="btn-primary-action"
                          onClick={() => {
                            setMissionStep(2);
                            setIsOtpModalOpen(true);
                          }}
                        >
                          📍 Arrived at Restaurant ➔
                        </button>
                      </div>
                    )}

                    {missionStep === 2 && (
                      <div className="step-card-body">
                        <div className="otp-pickup-notice">
                          <ShieldCheck size={28} className="otp-icon" />
                          <div>
                            <h5>Restaurant Handover Verification</h5>
                            <p>Ask restaurant staff for the 4-Digit Security OTP to confirm pickup.</p>
                          </div>
                        </div>

                        <button 
                          className="btn-primary-action btn-otp-action"
                          onClick={() => setIsOtpModalOpen(true)}
                        >
                          🔑 Enter Handover OTP ({activeMission.requiredOtp})
                        </button>
                      </div>
                    )}

                    {missionStep === 3 && (
                      <div className="step-card-body">
                        <div className="location-pin-group">
                          <span className="pin-icon green">🏠</span>
                          <div>
                            <div className="pin-label">DELIVERY DESTINATION</div>
                            <div className="pin-title">{activeMission.shelterName}</div>
                            <div className="pin-sub">{activeMission.shelterAddress}</div>
                          </div>
                        </div>

                        <div className="contact-actions-row">
                          <a href={`tel:${activeMission.shelterPhone}`} className="btn-phone-call">
                            <PhoneCall size={14} /> Call Shelter Contact
                          </a>
                        </div>

                        <button 
                          className="btn-primary-action btn-green"
                          onClick={() => setMissionStep(4)}
                        >
                          🛵 Arrived at Shelter ➔
                        </button>
                      </div>
                    )}

                    {missionStep === 4 && (
                      <div className="step-card-body">
                        <div className="handover-confirm-box">
                          <Heart size={28} className="heart-icon" />
                          <h5>Handover Surplus Food to Shelter</h5>
                          <p>Hand over 35x Biryani boxes to orphanage manager.</p>
                        </div>

                        <button 
                          className="btn-primary-action btn-emerald"
                          onClick={handleCompleteMission}
                        >
                          🤝 Confirm Food Delivered (+50 Karma)
                        </button>
                      </div>
                    )}

                  </div>
                )}

                {missionStep >= 5 && (
                  <div className="completed-mission-banner">
                    <div className="celebration-badge">🎉 Mission Complete</div>
                    <h4>Fed 35 Children at Anjuman Shelter</h4>
                    <p className="completed-sub">Earned +50 Karma Points • Rescue #RESCUE-8091</p>
                    <button className="btn-primary-action btn-emerald" onClick={() => setMissionStep(0)}>
                      ⚡ Find Next Rescue Mission
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 2: AVAILABLE RESCUES FEED */}
          {activeTab === 'feed' && (
            <div className="tab-pane-feed">
              <div className="feed-header-bar">
                <h4>Nearby Surplus Rescues</h4>
                <span className="active-count-tag">3 Available</span>
              </div>

              <div className="filter-chips-row">
                <button className="chip chip-active">All (3)</button>
                <button className="chip">⚡ Urgent (&lt;1h)</button>
                <button className="chip">📍 Near Me (&lt;2km)</button>
              </div>

              <div className="feed-cards-stack">
                {availableRescues.map((item) => (
                  <div key={item.id} className="feed-rescue-card">
                    <div className="card-top-row">
                      <span className="donor-name">{item.title}</span>
                      <span className={`urgency-badge ${item.urgency.toLowerCase()}`}>{item.expiry}</span>
                    </div>
                    <div className="food-details">{item.food}</div>
                    <div className="card-bottom-row">
                      <span className="dist-text">📍 {item.dist}</span>
                      <button 
                        className="btn-claim-feed"
                        onClick={() => {
                          setActiveTab('dispatch');
                          setMissionStep(1);
                        }}
                      >
                        Claim (+{item.karma} pts)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RIDER IMPACT & KARMA */}
          {activeTab === 'impact' && (
            <div className="tab-pane-impact">
              <div className="impact-hero-banner">
                <div className="karma-circle">
                  <Sparkles size={24} color="#f59e0b" />
                  <span className="karma-num">4,850</span>
                  <span className="karma-lbl">Karma Points</span>
                </div>
                <div className="leaderboard-rank">
                  🏆 Rank #3 in Dhaka District
                </div>
              </div>

              <div className="impact-kpi-grid">
                <div className="impact-mini-card">
                  <span className="kpi-icon">📦</span>
                  <span className="kpi-val">42</span>
                  <span className="kpi-lbl">Rescues</span>
                </div>
                <div className="impact-mini-card">
                  <span className="kpi-icon">🍲</span>
                  <span className="kpi-val">3,500</span>
                  <span className="kpi-lbl">Meals</span>
                </div>
                <div className="impact-mini-card">
                  <span className="kpi-icon">🌱</span>
                  <span className="kpi-val">1,250kg</span>
                  <span className="kpi-lbl">Food Saved</span>
                </div>
                <div className="impact-mini-card">
                  <span className="kpi-icon">⭐</span>
                  <span className="kpi-val">4.9</span>
                  <span className="kpi-lbl">Rating</span>
                </div>
              </div>

              <div className="achievements-section">
                <h5>Rider Badges</h5>
                <div className="badges-flex">
                  <div className="badge-pill active"><Zap size={14} /> Swift Responder</div>
                  <div className="badge-pill active"><Award size={14} /> Eco Hero</div>
                  <div className="badge-pill active"><Flame size={14} /> 50 Rescues</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RIDER PROFILE & VEHICLE */}
          {activeTab === 'profile' && (
            <div className="tab-pane-profile">
              <div className="profile-card">
                <div className="profile-avatar">👨‍🌾</div>
                <h4 className="profile-name">Tanvir Hossain</h4>
                <p className="profile-id">Verified Hero #V-9042 • Dhaka East Zone</p>
              </div>

              <div className="vehicle-selection-box">
                <h5>My Vehicle Mode</h5>
                <div className="vehicle-grid">
                  <button 
                    className={`vehicle-card ${vehicleType === 'motorbike' ? 'v-active' : ''}`}
                    onClick={() => setVehicleType('motorbike')}
                  >
                    <span>🛵 Motorbike</span>
                  </button>
                  <button 
                    className={`vehicle-card ${vehicleType === 'bicycle' ? 'v-active' : ''}`}
                    onClick={() => setVehicleType('bicycle')}
                  >
                    <span>🚲 Bicycle</span>
                  </button>
                  <button 
                    className={`vehicle-card ${vehicleType === 'car' ? 'v-active' : ''}`}
                    onClick={() => setVehicleType('car')}
                  >
                    <span>🚗 Car</span>
                  </button>
                  <button 
                    className={`vehicle-card ${vehicleType === 'walk' ? 'v-active' : ''}`}
                    onClick={() => setVehicleType('walk')}
                  >
                    <span>🚶 Walking</span>
                  </button>
                </div>
              </div>

              <div className="settings-list">
                <div className="setting-item">
                  <span>📍 Operating Zone</span>
                  <strong>Banani & Bashundhara</strong>
                </div>
                <div className="setting-item">
                  <span>🔔 SMS Dispatch Alerts</span>
                  <strong>Enabled</strong>
                </div>
                <div className="setting-item">
                  <span>🛡️ Emergency Support</span>
                  <a href="tel:999" className="emergency-link">Dial 999 / Helpline</a>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* PICTURE 1 MOCKUP: CURVED NOTCH BOTTOM NAVIGATION BAR */}
        <div className="curved-notch-navbar">
          <svg 
            className="notch-svg-background" 
            viewBox="0 0 100 64" 
            preserveAspectRatio="none"
            fill="none"
          >
            <path 
              d="M0,0 L38,0 C42,0 44.5,8 45.8,16 C47.5,32 52.5,32 54.2,16 C55.5,8 58,0 62,0 L100,0 L100,64 L0,64 Z" 
              fill="#0f172a" 
            />
          </svg>

          {/* Floating Center Action Button (🛵) */}
          <button 
            className={`center-fab-button ${activeTab === 'dispatch' ? 'fab-active' : ''}`}
            onClick={() => {
              setActiveTab('dispatch');
              if (missionStep === 0) setMissionStep(1);
            }}
            title="Live Missions"
          >
            <span className="fab-emoji">🛵</span>
          </button>

          {/* Nav Items */}
          <div className="nav-items-grid">
            <button 
              className={`nav-btn ${activeTab === 'dispatch' ? 'active' : ''}`}
              onClick={() => setActiveTab('dispatch')}
            >
              <Navigation size={18} />
              <span>Missions</span>
            </button>

            <button 
              className={`nav-btn ${activeTab === 'feed' ? 'active' : ''}`}
              onClick={() => setActiveTab('feed')}
            >
              <Layers size={18} />
              <span>Rescues</span>
            </button>

            {/* Empty Spacer for Center Notch */}
            <div className="notch-spacer"></div>

            <button 
              className={`nav-btn ${activeTab === 'impact' ? 'active' : ''}`}
              onClick={() => setActiveTab('impact')}
            >
              <Award size={18} />
              <span>Impact</span>
            </button>

            <button 
              className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              <span>Profile</span>
            </button>
          </div>
        </div>

      </div>

      {/* MODAL 1: OTP PICKUP VERIFICATION */}
      <Modal 
        isOpen={isOtpModalOpen} 
        onClose={() => setIsOtpModalOpen(false)}
        title="🔑 Enter Handover Verification OTP"
      >
        <form onSubmit={handleVerifyOtp} className="otp-modal-form">
          <p className="otp-instructions">
            Enter the 4-digit code provided by <strong>Star Kabab & Restaurant</strong> staff to confirm food pickup.
          </p>

          <div className="demo-otp-hint">
            💡 Demo Verification OTP: <strong>{activeMission.requiredOtp}</strong>
          </div>

          <div className="otp-input-group">
            <input 
              type="text" 
              maxLength="4" 
              className="otp-code-input"
              placeholder="0 0 0 0"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              autoFocus
            />
          </div>

          {otpError && <div className="otp-error-msg">{otpError}</div>}

          <div className="otp-btn-row">
            <button 
              type="button" 
              className="btn-quick-autofill"
              onClick={() => setOtpInput(activeMission.requiredOtp)}
            >
              Autofill {activeMission.requiredOtp}
            </button>
            <Button type="submit" variant="primary">
              Verify Pickup 📦
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: MISSION CELEBRATION RECEIPT */}
      <Modal 
        isOpen={isCelebrationModalOpen} 
        onClose={() => setIsCelebrationModalOpen(false)}
        title="🎉 Rescue Mission Completed!"
      >
        <div className="celebration-content-box">
          <div className="confetti-badge">
            <Sparkles size={36} color="#d97706" />
          </div>

          <h3>+50 Karma Points Earned!</h3>
          <p className="celebration-sub">
            Thank you, Tanvir! You successfully fed 35 children at Anjuman Orphanage Shelter.
          </p>

          <div className="receipt-summary-card">
            <div className="r-line"><span>Mission ID:</span> <strong>#RESCUE-8091</strong></div>
            <div className="r-line"><span>Donor:</span> <strong>Star Kabab Banani</strong></div>
            <div className="r-line"><span>Recipient:</span> <strong>Anjuman Orphanage Shelter</strong></div>
            <div className="r-line"><span>Food Item:</span> <strong>35x Mutton Biryani Packets</strong></div>
            <div className="r-line"><span>Distance Covered:</span> <strong>4.2 km</strong></div>
          </div>

          <Button 
            variant="primary" 
            size="lg" 
            fullWidth 
            onClick={handleResetMission}
          >
            Awesome! Back to Missions 🛵
          </Button>
        </div>
      </Modal>

    </div>
  );
}
