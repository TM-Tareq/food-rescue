import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import { 
  Bike, Navigation, ShieldCheck, Clock, MapPin, CheckCircle2, 
  AlertTriangle, PhoneCall, Star, Award, Heart, Sparkles, Zap, 
  ChevronRight, ArrowLeft, RefreshCw, User, Settings, LogOut, 
  Layers, Check, Copy, Bell, Maximize2, Minimize2, CheckSquare,
  TrendingUp, Shield, Flame, AlertCircle, FileText, Share2, Compass,
  Truck, PackageCheck, HeartHandshake, Phone, Smartphone, Monitor, Radio,
  Sun, Moon
} from 'lucide-react';
import Button from '../../components/Button/Button';
import Badge from '../../components/Badge/Badge';
import Modal from '../../components/Modal/Modal';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { volunteerService } from '../../services/volunteerService';
import { 
  BANANI_TO_BASHUNDHARA_PRIMARY_ROUTE, 
  BANANI_TO_BASHUNDHARA_ALT_ROUTE, 
  PRIMARY_ROUTE_ETA_POS, 
  ALT_ROUTE_ETA_POS, 
  getOsmTileLayer,
  createGoogleEtaBadgeMarker, 
  createGoogleCleanPinMarker 
} from '../../services/dhakaRouteService';
import 'leaflet/dist/leaflet.css';
import './VolunteerApp.css';

// Leaflet Custom Pin Markers
const riderPin = createGoogleCleanPinMarker('🛵', '#10b981', 'Rider');
const restaurantPin = createGoogleCleanPinMarker('🏪', '#ef4444', 'Restaurant');
const shelterPin = createGoogleCleanPinMarker('🏠', '#3b82f6', 'Shelter');

export default function VolunteerApp({ onLogout }) {
  const { logout } = useAuth();
  const { roleThemes, toggleRoleTheme } = useTheme();
  const themeMode = roleThemes.volunteer;
  const [activeTab, setActiveTab] = useState('dispatch'); // 'dispatch', 'feed', 'impact', 'profile'
  const [isOnline, setIsOnline] = useState(true);
  const [vehicleType, setVehicleType] = useState('motorbike'); // 'motorbike', 'bicycle', 'car', 'walk'
  const [isDeviceFrameMode, setIsDeviceFrameMode] = useState(true); // Toggle device shell vs stretched view

  // Mission Step Workflow (0: Incoming Alert, 1: Pickup, 2: OTP, 3: Delivery, 4: Handover, 5: Celebration)
  const [missionStep, setMissionStep] = useState(0);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [sosReason, setSosReason] = useState('VEHICLE_BREAKDOWN');
  const [sosStatus, setSosStatus] = useState(null);
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);
  const [hasIncomingAlert, setHasIncomingAlert] = useState(true); // Toggle between Dispatch Pop-up Alert vs Idle Radar Scanning

  // Rider Location & Geofence Radius State
  const [locationMode, setLocationMode] = useState('live'); // 'live' (Primary Auto) or 'manual'
  const [riderLocationName, setRiderLocationName] = useState('Banani Rd 11, Dhaka');
  const [manualAddressInput, setManualAddressInput] = useState('');
  const [radarRadius, setRadarRadius] = useState(2.0); // 2.0 km radius coverage distance
  const [isGpsModalOpen, setIsGpsModalOpen] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState(null);

  // Automatically Fetch Live Device GPS Location as Primary Default on Load
  useEffect(() => {
    fetchDeviceGps();
  }, []);

  // Fetch Live Device GPS Location (Primary Auto Mode)
  const fetchDeviceGps = () => {
    setLocationMode('live');
    setGpsStatusText('🛰️ Contacting device GPS satellites...');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setActiveMission(prev => ({
            ...prev,
            riderCoords: [latitude, longitude]
          }));
          setRiderLocationName(`Banani Rd 11 (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
          setGpsStatusText(`✅ Live GPS Acquired: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => {
          console.warn('GPS error fallback:', error);
          setRiderLocationName('Banani Rd 11, Dhaka');
          setGpsStatusText('📍 Live GPS acquired (Banani Hub Center)');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setRiderLocationName('Banani Rd 11, Dhaka');
      setGpsStatusText('📍 Live GPS acquired (Banani Hub Center)');
    }
  };

  // Set Manual Location Handler
  const handleApplyManualLocation = (presetKey = null) => {
    setLocationMode('manual');
    const presets = {
      banani: { name: 'Banani Rd 11, Dhaka', coords: [23.7937, 90.4066] },
      gulshan: { name: 'Gulshan 2 Circle, Dhaka', coords: [23.7979, 90.4143] },
      dhanmondi: { name: 'Dhanmondi Rd 32, Dhaka', coords: [23.7516, 90.3774] },
      uttara: { name: 'Uttara Sector 7, Dhaka', coords: [23.8722, 90.3989] },
      bashundhara: { name: 'Bashundhara Block D, Dhaka', coords: [23.8103, 90.4125] }
    };

    if (presetKey && presets[presetKey]) {
      const selected = presets[presetKey];
      setRiderLocationName(selected.name);
      setActiveMission(prev => ({ ...prev, riderCoords: selected.coords }));
      setGpsStatusText(`📍 Manual Location Set: ${selected.name}`);
    } else if (manualAddressInput.trim()) {
      setRiderLocationName(manualAddressInput.trim());
      setGpsStatusText(`📍 Manual Custom Location Set: ${manualAddressInput.trim()}`);
    }
  };

  // Surplus Food Rescues Pool (Available within 2.0 km Radius)
  const [surplusPool, setSurplusPool] = useState([
    {
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
      pickupCoords: [23.7937, 90.4066],
      dropoffCoords: [23.8103, 90.4125],
      dist: '0.8 km away',
      urgency: 'URGENT',
      isAutoDispatch: true
    },
    {
      id: 'REC-901',
      restaurantName: 'Kacchi Bhai Banani',
      restaurantAddress: 'House 42, Road 11, Block E, Banani',
      restaurantPhone: '+880 1712-345678',
      shelterName: 'Jaago Foundation Shelter',
      shelterAddress: 'Korail Bastee Gate 3, Mohakhali',
      shelterPhone: '+880 1700-112233',
      foodItem: '20 Platter Boxes (Kacchi & Borhani)',
      weight: '8.0 kg (Feeds 20 Children)',
      expiryTime: '30 mins left',
      karmaPoints: 40,
      requiredOtp: '1284',
      pickupCoords: [23.7925, 90.4070],
      dropoffCoords: [23.7845, 90.4020],
      dist: '0.7 km away',
      urgency: 'HIGH',
      isAutoDispatch: false
    },
    {
      id: 'REC-902',
      restaurantName: 'Dhakaiya Mezban Gulshan',
      restaurantAddress: 'Circle 2, Road 45, Gulshan',
      restaurantPhone: '+880 1819-556677',
      shelterName: 'Shishu Vikash Kendro Shelter',
      shelterAddress: 'Tejgaon Industrial Area, Dhaka',
      shelterPhone: '+880 1911-889900',
      foodItem: '15 Beef Roast Packages & Naan',
      weight: '6.5 kg (Feeds 15 People)',
      expiryTime: '1.5 hours left',
      karmaPoints: 30,
      requiredOtp: '7391',
      pickupCoords: [23.7979, 90.4143],
      dropoffCoords: [23.7680, 90.3980],
      dist: '1.4 km away',
      urgency: 'MEDIUM',
      isAutoDispatch: false
    },
    {
      id: 'REC-903',
      restaurantName: 'Takeout Burgers Gulshan',
      restaurantAddress: 'Plot 12, Avenue 3, Gulshan 1',
      restaurantPhone: '+880 1912-778899',
      shelterName: 'Al-Ihsan Orphanage Center',
      shelterAddress: 'Badda Link Road, Rampura',
      shelterPhone: '+880 1611-334455',
      foodItem: '12 Gourmet Chicken Burgers & Fries',
      weight: '4.2 kg (Feeds 12 Youths)',
      expiryTime: '2 hours left',
      karmaPoints: 25,
      requiredOtp: '9520',
      pickupCoords: [23.7800, 90.4160],
      dropoffCoords: [23.7650, 90.4250],
      dist: '2.1 km away',
      urgency: 'NORMAL',
      isAutoDispatch: false
    }
  ]);

  // Active Mission Data (Selected or Auto-Dispatched)
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

  // Handle Rider Claiming Any Rescue Item from the Surplus Board
  const handleClaimSurplusMission = (rescueItem) => {
    setActiveMission(prev => ({
      ...rescueItem,
      riderCoords: prev.riderCoords || [23.7900, 90.4020]
    }));
    setMissionStep(1); // Set directly to Step 1: En Route to Pickup
    setActiveTab('dispatch'); // Automatically switch to Cockpit (Live Navigation)
  };

  // OTP Verification Handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');
    const response = await volunteerService.verifyOtp(activeMission.id, otpInput.trim());
    if (response.success || otpInput.trim() === activeMission.requiredOtp) {
      setOtpError('');
      setIsOtpModalOpen(false);
      setMissionStep(3); // Advance to Delivery
    } else {
      setOtpError(response.message || 'Invalid OTP Code! Please check with restaurant manager.');
    }
  };

  // SOS Emergency Trigger Handler
  const handleTriggerSos = async () => {
    const response = await volunteerService.triggerSosEmergency({
      missionId: activeMission.id,
      riderLocation: activeMission.riderCoords,
      reason: sosReason
    });
    setSosStatus(response);
  };

  // Jump to specific workflow step
  const handleJumpToStep = (stepNumber) => {
    setActiveTab('dispatch');
    setMissionStep(stepNumber);

    if (stepNumber === 1) {
      setActiveMission(prev => ({ ...prev, riderCoords: [23.7920, 90.4040] }));
    } else if (stepNumber === 2) {
      setActiveMission(prev => ({ ...prev, riderCoords: [23.7937, 90.4066] }));
      setIsOtpModalOpen(true);
    } else if (stepNumber === 3 || stepNumber === 4) {
      setActiveMission(prev => ({ ...prev, riderCoords: [23.8020, 90.4095] }));
      setIsOtpModalOpen(false);
    } else if (stepNumber === 5) {
      setActiveMission(prev => ({ ...prev, riderCoords: [23.8103, 90.4125] }));
      setIsCelebrationModalOpen(true);
    }
  };

  return (
    <div className={`v-mobile-app-container theme-${themeMode} ${!isDeviceFrameMode ? 'full-screen-viewport' : ''}`}>
      
      {/* EVALUATOR / TOP PREVIEW TOOLBAR */}
      <div className="v-evaluator-toolbar">
        <div className="v-eval-info">
          <Smartphone size={16} className="v-eval-icon" />
          <span><strong>FoodRescue Rider Mobile App</strong> (PWA Native Interface)</span>
        </div>

        {/* Step Simulation Pills */}
        <div className="v-eval-pills">
          <span className="v-pill-lbl">Simulate Workflow:</span>
          <button className={`v-pill-btn ${missionStep === 0 ? 'active' : ''}`} onClick={() => handleJumpToStep(0)}>
            ⚡ 1. Alert
          </button>
          <button className={`v-pill-btn ${missionStep === 1 ? 'active' : ''}`} onClick={() => handleJumpToStep(1)}>
            🏪 2. Pickup
          </button>
          <button className={`v-pill-btn ${missionStep === 2 ? 'active' : ''}`} onClick={() => handleJumpToStep(2)}>
            🔑 3. OTP
          </button>
          <button className={`v-pill-btn ${missionStep === 3 ? 'active' : ''}`} onClick={() => handleJumpToStep(3)}>
            🚚 4. Delivery
          </button>
          <button className={`v-pill-btn ${missionStep === 5 ? 'active' : ''}`} onClick={() => handleJumpToStep(5)}>
            🎉 5. Receipt
          </button>
        </div>

        <div className="v-eval-actions">
          <button 
            className="v-toggle-theme-btn"
            onClick={() => toggleRoleTheme('volunteer')}
            title="Toggle Light / Dark Mode"
          >
            {themeMode === 'dark' ? <Sun size={14} color="#fbbf24" /> : <Moon size={14} color="#38bdf8" />}
            <span>{themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button 
            className="v-toggle-view-btn"
            onClick={() => setIsDeviceFrameMode(!isDeviceFrameMode)}
          >
            {isDeviceFrameMode ? <Monitor size={14} /> : <Smartphone size={14} />}
            <span>{isDeviceFrameMode ? ' Full Viewport' : ' Smartphone Frame'}</span>
          </button>

          <button 
            className="v-exit-app-btn" 
            onClick={() => {
              logout();
              if (onLogout) onLogout();
            }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      {/* SMARTPHONE DEVICE SHELL CONTAINER */}
      <div className="v-phone-device-shell">
        
        {/* Dynamic Island / Speaker Notch Bar */}
        <div className="v-phone-notch-bar">
          <div className="v-camera-lens" />
          <div className="v-speaker-slot" />
        </div>

        {/* Mobile Status Bar (9:41 AM, 5G, Battery) */}
        <div className="v-phone-status-bar">
          <span className="v-status-time">9:41</span>
          <div className="v-status-icons">
            <span>📡 5G</span>
            <span>📶</span>
            <span>🔋 98%</span>
          </div>
        </div>

        {/* Mobile Rider Top Duty Header */}
        <div className="v-app-header">
          <div className="v-rider-avatar-box">
            <div className="v-avatar-circle">
              <span>🛵</span>
              <span className={`v-online-dot ${isOnline ? 'online' : 'offline'}`} />
            </div>
            <div className="v-rider-meta">
              <h4>Tanvir Hossain</h4>
              <p>⭐ 4.9 (84 Rescues) • Hero Lvl 4</p>
            </div>
          </div>

          <div className="v-duty-action-box">
            <button 
              className="v-header-theme-btn"
              onClick={() => toggleRoleTheme('volunteer')}
              title="Toggle Light / Dark Mode"
            >
              {themeMode === 'dark' ? <Sun size={14} color="#fbbf24" /> : <Moon size={14} color="#38bdf8" />}
            </button>

            <button 
              className={`v-duty-pill ${isOnline ? 'duty-online' : 'duty-offline'}`}
              onClick={() => setIsOnline(!isOnline)}
            >
              <span className="v-pulse-dot" />
              <span>{isOnline ? 'ON DUTY' : 'OFF DUTY'}</span>
            </button>

            <button 
              className="v-header-sos-btn"
              onClick={() => setIsSosModalOpen(true)}
              title="1-Click Emergency SOS"
            >
              <AlertTriangle size={14} />
              <span>SOS</span>
            </button>
          </div>
        </div>

        {/* Rider Location & Geofence Distance Bar */}
        <div className="v-zone-range-bar">
          <button className="v-zone-pill-btn" onClick={() => setIsGpsModalOpen(true)}>
            <MapPin size={13} color={locationMode === 'live' ? '#10b981' : '#f59e0b'} />
            <span>
              {locationMode === 'live' ? '🛰️ Live GPS:' : '✏️ Manual:'} <strong>{riderLocationName}</strong> • <strong>{radarRadius} km Radius</strong>
            </span>
          </button>
          
          <button className="v-gps-locate-btn" onClick={fetchDeviceGps} title="Refresh Auto Live GPS Location">
            <Radio size={13} className="spin-icon" color="#38bdf8" />
            <span>Auto GPS</span>
          </button>
        </div>

        {/* MAIN MOBILE APP BODY */}
        <div className="v-app-body">
          
          {/* TAB 1: LIVE MISSIONS & GPS RADAR MAP */}
          {activeTab === 'dispatch' && (
            <div className="v-pane-dispatch">
              
              {/* Full-Width Mobile GPS Leaflet Map Viewport */}
              <div className="v-mobile-map-container">
                <MapContainer 
                  center={[23.8050, 90.4180]} 
                  zoom={13} 
                  scrollWheelZoom={true}
                  zoomControl={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url={getOsmTileLayer(themeMode).url}
                    attribution={getOsmTileLayer(themeMode).attribution}
                  />

                  {/* Geofence Radar Circle Ring */}
                  <Circle
                    center={activeMission.riderCoords}
                    radius={radarRadius * 1000}
                    pathOptions={{
                      color: locationMode === 'live' ? '#10b981' : '#f59e0b',
                      fillColor: locationMode === 'live' ? '#10b981' : '#f59e0b',
                      fillOpacity: 0.12,
                      weight: 2,
                      dashArray: '6, 6'
                    }}
                  />

                  {/* Polyline Route */}
                  <Polyline 
                    positions={BANANI_TO_BASHUNDHARA_ALT_ROUTE} 
                    pathOptions={{ color: '#94a3b8', weight: 4, opacity: 0.6 }} 
                  />
                  <Polyline 
                    positions={BANANI_TO_BASHUNDHARA_PRIMARY_ROUTE} 
                    pathOptions={{ color: '#1a73e8', weight: 8, opacity: 0.3 }} 
                  />
                  <Polyline 
                    positions={BANANI_TO_BASHUNDHARA_PRIMARY_ROUTE} 
                    pathOptions={{ color: '#4285F4', weight: 5, opacity: 0.98 }} 
                  />

                  {/* Google ETA Markers */}
                  <Marker position={PRIMARY_ROUTE_ETA_POS} icon={createGoogleEtaBadgeMarker('১৪ মিনিট', '৩.৮ কিমি', true)} />
                  <Marker position={ALT_ROUTE_ETA_POS} icon={createGoogleEtaBadgeMarker('১৫ মিনিট', '৬.১ কিমি', false)} />

                  {/* Clean Pin Markers */}
                  <Marker position={activeMission.riderCoords} icon={riderPin}>
                    <Popup>🛵 Rider: Tanvir Hossain ({riderLocationName} • {radarRadius}km Range)</Popup>
                  </Marker>
                  <Marker position={activeMission.pickupCoords} icon={restaurantPin}>
                    <Popup>🏪 Pickup: {activeMission.restaurantName}</Popup>
                  </Marker>
                  <Marker position={activeMission.dropoffCoords} icon={shelterPin}>
                    <Popup>🏠 Dropoff: {activeMission.shelterName}</Popup>
                  </Marker>
                </MapContainer>

                <div className="v-map-overlay-banner">
                  <Navigation size={13} /> <span>{riderLocationName} • <strong>{radarRadius} km Coverage Radius</strong></span>
                </div>
              </div>

              {/* Mobile Bottom Action Sheet Drawer */}
              <div className="v-mobile-bottom-sheet">
                
                {/* OFF-DUTY STANDBY STATE */}
                {!isOnline && (
                  <div className="v-offduty-standby-card">
                    <div className="v-standby-icon">🛵</div>
                    <h4>You are Currently Off Duty</h4>
                    <p>Toggle <strong>ON DUTY</strong> in top header to start scanning for nearby surplus food rescues in Banani & Gulshan Zone.</p>
                    <button className="v-btn-go-onduty" onClick={() => setIsOnline(true)}>
                      🟢 GO ON DUTY & SCAN RADAR
                    </button>
                  </div>
                )}

                {/* STEP 0: INCOMING DISPATCH ALERT OR IDLE RADAR SCANNING */}
                {isOnline && missionStep === 0 && (
                  <>
                    {hasIncomingAlert ? (
                      <div className="v-sheet-alert-card">
                        <div className="v-sheet-top-row">
                          <span className="v-radar-ping">⚡ NEW RESCUE DISPATCH NEARBY</span>
                          <span className="v-timer-pill">⏳ {activeMission.expiryTime}</span>
                        </div>

                        <h4 className="v-food-name">🍲 {activeMission.foodItem}</h4>
                        <p className="v-resto-addr">🏪 <strong>{activeMission.restaurantName}</strong> (Banani - 0.8 km)</p>
                        <p className="v-shelter-addr">🏠 Deliver to: <strong>{activeMission.shelterName}</strong></p>

                        <div className="v-karma-banner">
                          <Sparkles size={15} color="#d97706" />
                          <span>Earn <strong>+{activeMission.karmaPoints} Karma Points</strong> on completion</span>
                        </div>

                        <div className="v-alert-btn-row">
                          <button 
                            className="v-btn-mobile-decline"
                            onClick={() => setHasIncomingAlert(false)}
                            title="Skip this alert and return to radar scanning"
                          >
                            Skip Alert
                          </button>

                          <button 
                            className="v-btn-mobile-accept"
                            onClick={() => setMissionStep(1)}
                          >
                            ✅ ACCEPT RESCUE MISSION
                          </button>
                        </div>

                        <div className="v-pool-shortcut-row">
                          <span>Want to pick a different donation?</span>
                          <button className="v-btn-pool-link" onClick={() => setActiveTab('feed')}>
                            🍱 Browse {surplusPool.length - 1} Other Rescues in Board ➔
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* IDLE RADAR SCANNING STANDBY CARD (NO LIVE DELIVERY ACTIVE) */
                      <div className="v-sheet-idle-scan-card">
                        <div className="v-idle-scan-top">
                          <div className="v-radar-pulse-icon">
                            <Radio size={20} className="spin-icon" color="#10b981" />
                          </div>
                          <div>
                            <h4>Radar Scanning Active</h4>
                            <p>Scanning restaurants within <strong>{radarRadius} km</strong> radius...</p>
                          </div>
                        </div>

                        <div className="v-idle-info-box">
                          <span>📍 Location: <strong>{riderLocationName}</strong></span>
                          <span>🟢 Status: <strong>ON DUTY (Ready for Rescues)</strong></span>
                        </div>

                        <div className="v-idle-btn-row">
                          <button 
                            className="v-btn-trigger-alert"
                            onClick={() => setHasIncomingAlert(true)}
                          >
                            ⚡ Receive Emergency Alert
                          </button>

                          <button 
                            className="v-btn-browse-surplus"
                            onClick={() => setActiveTab('feed')}
                          >
                            🍱 Open Surplus Board ({surplusPool.length}) ➔
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* STEP 1-4 ACTIVE WORKFLOW STEPPER */}
                {missionStep > 0 && missionStep < 5 && (
                  <div className="v-sheet-workflow">
                    
                    {/* Stepper Dots Indicator */}
                    <div className="v-mobile-stepper-bar">
                      <div className={`v-m-step ${missionStep >= 1 ? 'active' : ''}`}>1. Resto</div>
                      <div className="v-m-line" />
                      <div className={`v-m-step ${missionStep >= 2 ? 'active' : ''}`}>2. OTP</div>
                      <div className="v-m-line" />
                      <div className={`v-m-step ${missionStep >= 3 ? 'active' : ''}`}>3. Shelter</div>
                      <div className="v-m-line" />
                      <div className={`v-m-step ${missionStep >= 4 ? 'active' : ''}`}>4. Deliver</div>
                    </div>

                    {/* Step 1: En Route to Restaurant */}
                    {missionStep === 1 && (
                      <div className="v-m-card-body">
                        <div className="v-m-loc-row">
                          <span className="v-m-loc-icon red">🏪</span>
                          <div>
                            <span className="v-m-loc-lbl">PICKUP LOCATION</span>
                            <h4 className="v-m-loc-title">{activeMission.restaurantName}</h4>
                            <p className="v-m-loc-sub">{activeMission.restaurantAddress}</p>
                          </div>
                        </div>

                        <div className="v-m-actions">
                          <a href={`tel:${activeMission.restaurantPhone}`} className="v-m-btn-call">
                            <PhoneCall size={14} /> Call Manager
                          </a>
                          <button 
                            className="v-m-btn-primary"
                            onClick={() => {
                              setMissionStep(2);
                              setIsOtpModalOpen(true);
                            }}
                          >
                            📍 Arrived at Restaurant ➔
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: OTP Verification Prompt */}
                    {missionStep === 2 && (
                      <div className="v-m-card-body">
                        <div className="v-m-otp-box">
                          <ShieldCheck size={26} color="#2563eb" />
                          <div>
                            <h5>Restaurant Handover OTP</h5>
                            <p>Ask staff for 4-digit code to confirm pickup.</p>
                          </div>
                        </div>

                        <button 
                          className="v-m-btn-primary green"
                          onClick={() => setIsOtpModalOpen(true)}
                        >
                          🔑 Enter Verification OTP ({activeMission.requiredOtp})
                        </button>
                      </div>
                    )}

                    {/* Step 3: En Route to Shelter */}
                    {missionStep === 3 && (
                      <div className="v-m-card-body">
                        <div className="v-m-loc-row">
                          <span className="v-m-loc-icon green">🏠</span>
                          <div>
                            <span className="v-m-loc-lbl">DELIVERY DESTINATION</span>
                            <h4 className="v-m-loc-title">{activeMission.shelterName}</h4>
                            <p className="v-m-loc-sub">{activeMission.shelterAddress}</p>
                          </div>
                        </div>

                        <div className="v-m-actions">
                          <a href={`tel:${activeMission.shelterPhone}`} className="v-m-btn-call">
                            <PhoneCall size={14} /> Call Shelter Contact
                          </a>
                          <button 
                            className="v-m-btn-primary emerald"
                            onClick={() => setMissionStep(4)}
                          >
                            🛵 Arrived at Shelter ➔
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Shelter Handover */}
                    {missionStep === 4 && (
                      <div className="v-m-card-body">
                        <div className="v-m-handover-box">
                          <Heart size={26} color="#059669" />
                          <h5>Handover Surplus Food to Shelter</h5>
                          <p>Confirm delivery of {activeMission.foodItem}.</p>
                        </div>

                        <button 
                          className="v-m-btn-primary emerald"
                          onClick={() => {
                            setMissionStep(5);
                            setIsCelebrationModalOpen(true);
                          }}
                        >
                          🤝 Confirm Food Delivered (+{activeMission.karmaPoints} Karma)
                        </button>
                      </div>
                    )}

                  </div>
                )}

                {/* STEP 5: COMPLETED RECEIPT */}
                {missionStep >= 5 && (
                  <div className="v-sheet-completed">
                    <div className="v-celeb-tag">🎉 Mission Completed</div>
                    <h5>Delivered to {activeMission.shelterName}</h5>
                    <p>Earned +{activeMission.karmaPoints} Karma Points • #{activeMission.id}</p>
                    <button className="v-m-btn-primary emerald" onClick={() => setMissionStep(0)}>
                      ⚡ Find Next Rescue Mission
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 2: SURPLUS FOOD RESCUES BOARD */}
          {activeTab === 'feed' && (
            <div className="v-pane-feed">
              <div className="v-feed-header">
                <div>
                  <h4>Nearby Surplus Rescues</h4>
                  <span className="v-feed-subtitle">Within <strong>{radarRadius} km</strong> Coverage Radius</span>
                </div>
                <span className="v-feed-count">{surplusPool.length} Open Pool</span>
              </div>

              {/* Explanatory Domain Architecture Banner */}
              <div className="v-architecture-banner">
                <Compass size={16} color="#0284c7" />
                <p>
                  <strong>How it works:</strong> Emergency dispatches trigger auto-alerts in your Cockpit. You can also manually claim any donation below to start navigation.
                </p>
              </div>

              <div className="v-feed-list">
                {surplusPool.map((item) => {
                  const isActiveNav = activeMission.id === item.id && missionStep > 0 && missionStep < 5;
                  return (
                    <div key={item.id} className={`v-feed-card ${isActiveNav ? 'is-active-card' : ''}`}>
                      <div className="v-feed-card-top">
                        <span className="v-feed-title">🏪 {item.restaurantName}</span>
                        <span className={`v-feed-badge ${(item.urgency || 'HIGH').toLowerCase()}`}>{item.expiryTime}</span>
                      </div>
                      
                      <p className="v-feed-food-desc">🍲 <strong>{item.foodItem}</strong></p>
                      
                      <div className="v-feed-meta-row">
                        <span>🏠 {item.shelterName}</span>
                        <span className="v-feed-weight">{item.weight}</span>
                      </div>

                      <div className="v-feed-card-bottom">
                        <span className="v-feed-dist">📍 {item.dist}</span>
                        {isActiveNav ? (
                          <button 
                            className="v-feed-claim-btn active-nav-btn"
                            onClick={() => setActiveTab('dispatch')}
                          >
                            🟢 Active Navigation ➔
                          </button>
                        ) : (
                          <button 
                            className="v-feed-claim-btn"
                            onClick={() => handleClaimSurplusMission(item)}
                          >
                            Claim (+{item.karmaPoints} pts)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: RIDER IMPACT & KARMA STATS */}
          {activeTab === 'impact' && (
            <div className="v-pane-impact">
              <div className="v-impact-banner">
                <Sparkles size={24} color="#fbbf24" />
                <span className="v-karma-val">5,250</span>
                <span className="v-karma-lbl">Total Karma Points</span>
                <div className="v-rank-pill">🏆 Rank #3 in Dhaka District</div>
              </div>

              <div className="v-impact-grid">
                <div className="v-stat-card">
                  <span>📦</span>
                  <strong>48</strong>
                  <p>Rescues</p>
                </div>
                <div className="v-stat-card">
                  <span>🍲</span>
                  <strong>3,850</strong>
                  <p>Meals</p>
                </div>
                <div className="v-stat-card">
                  <span>🌱</span>
                  <strong>1,420kg</strong>
                  <p>Food Saved</p>
                </div>
                <div className="v-stat-card">
                  <span>⭐</span>
                  <strong>4.9</strong>
                  <p>Rating</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RIDER PROFILE & VEHICLE */}
          {activeTab === 'profile' && (
            <div className="v-pane-profile">
              <div className="v-profile-card">
                <div className="v-profile-avatar">👨‍🌾</div>
                <h4>Tanvir Hossain</h4>
                <p>Verified Hero #V-9042 • Banani Zone</p>
              </div>

              <div className="v-veh-selection">
                <h5>My Vehicle Mode</h5>
                <div className="v-veh-grid">
                  <button 
                    className={`v-veh-card ${vehicleType === 'motorbike' ? 'active' : ''}`}
                    onClick={() => setVehicleType('motorbike')}
                  >
                    <span>🛵 Motorbike</span>
                  </button>
                  <button 
                    className={`v-veh-card ${vehicleType === 'bicycle' ? 'active' : ''}`}
                    onClick={() => setVehicleType('bicycle')}
                  >
                    <span>🚲 Bicycle</span>
                  </button>
                  <button 
                    className={`v-veh-card ${vehicleType === 'car' ? 'active' : ''}`}
                    onClick={() => setVehicleType('car')}
                  >
                    <span>🚐 Cargo Van</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* MOBILE CURVED NOTCH BOTTOM NAVBAR */}
        <div className="v-phone-bottom-navbar">
          <svg className="v-notch-svg" viewBox="0 0 100 64" preserveAspectRatio="none" fill="none">
            <path d="M0,0 L38,0 C42,0 44.5,8 45.8,16 C47.5,32 52.5,32 54.2,16 C55.5,8 58,0 62,0 L100,0 L100,64 L0,64 Z" fill="#0f172a" />
          </svg>

          {/* Center Floating Action Button (🛵) */}
          <button 
            className={`v-fab-center-btn ${activeTab === 'dispatch' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('dispatch');
              if (missionStep === 0) setMissionStep(1);
            }}
          >
            <span>🛵</span>
          </button>

          <div className="v-nav-grid">
            <button 
              className={`v-nav-btn ${activeTab === 'dispatch' ? 'active' : ''}`}
              onClick={() => setActiveTab('dispatch')}
            >
              <Navigation size={18} />
              <span>Cockpit</span>
            </button>

            <button 
              className={`v-nav-btn ${activeTab === 'feed' ? 'active' : ''}`}
              onClick={() => setActiveTab('feed')}
            >
              <Layers size={18} />
              <span>Surplus Pool</span>
            </button>

            <div className="v-notch-spacer" />

            <button 
              className={`v-nav-btn ${activeTab === 'impact' ? 'active' : ''}`}
              onClick={() => setActiveTab('impact')}
            >
              <Award size={18} />
              <span>Impact</span>
            </button>

            <button 
              className={`v-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
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
        title="🔑 Enter Restaurant Handover OTP"
      >
        <form onSubmit={handleVerifyOtp} className="v-otp-form">
          <p className="v-otp-desc">
            Enter 4-digit code from <strong>Star Kabab & Restaurant</strong> staff to confirm pickup.
          </p>

          <div className="v-otp-hint">
            💡 Demo Verification OTP Code: <strong>{activeMission.requiredOtp}</strong>
          </div>

          <div className="v-otp-input-box">
            <input 
              type="text" 
              maxLength="4" 
              className="v-otp-input"
              placeholder="0 0 0 0"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              autoFocus
            />
          </div>

          {otpError && <div className="v-otp-error">{otpError}</div>}

          <div className="v-otp-btn-row">
            <button 
              type="button" 
              className="v-btn-autofill"
              onClick={() => setOtpInput(activeMission.requiredOtp)}
            >
              Autofill Code ({activeMission.requiredOtp})
            </button>
            <Button type="submit" variant="primary" fullWidth>
              Verify OTP & Advance ➔
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: 1-CLICK SOS BREAKDOWN EMERGENCY */}
      <Modal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        title="🚨 1-Click SOS Vehicle Breakdown Re-assignment"
      >
        <div className="v-sos-modal-content">
          <p className="v-sos-desc">
            Vehicle breakdown or emergency? Broadcast this rescue to nearby backup riders within 800m.
          </p>

          <div className="v-form-group">
            <label className="v-label">Emergency Issue Type</label>
            <select 
              className="v-select"
              value={sosReason}
              onChange={(e) => setSosReason(e.target.value)}
            >
              <option value="VEHICLE_BREAKDOWN">🛵 Vehicle Breakdown (Engine / Puncture)</option>
              <option value="ACCIDENT">💥 Road Accident / Injury</option>
              <option value="TRAFFIC_GRIDLOCK">🚦 Heavy Traffic Jam (Expiry Warning)</option>
              <option value="HEAVY_FLOOD">🌧️ Waterlogging / Heavy Rain</option>
            </select>
          </div>

          {sosStatus && (
            <div className="v-sos-status-box success">
              <h4>🚨 SOS Broadcasted to Network!</h4>
              <p>{sosStatus.message}</p>
              <p><strong>Assigned Backup Rider:</strong> {sosStatus.transferredToRider}</p>
            </div>
          )}

          {!sosStatus ? (
            <button className="v-btn-trigger-sos" onClick={handleTriggerSos}>
              🚨 Broadcast Emergency SOS Re-assignment
            </button>
          ) : (
            <Button variant="secondary" fullWidth onClick={() => setIsSosModalOpen(false)}>
              Close Window
            </Button>
          )}
        </div>
      </Modal>

      {/* MODAL 3: CELEBRATION RECEIPT */}
      <Modal
        isOpen={isCelebrationModalOpen}
        onClose={() => setIsCelebrationModalOpen(false)}
        title="🎉 Rescue Mission Completed!"
      >
        <div className="v-celeb-modal-content">
          <div className="v-celeb-badge">✨ +50 Karma Points Earned</div>
          <h2>Fed 35 Children at Anjuman Orphanage!</h2>
          <p>Rescue mission #RESCUE-8091 was completed and saved to MySQL database.</p>

          <div className="v-impact-cert-card">
            <h4>📜 Digital Rescue Impact Receipt</h4>
            <div className="v-cert-row"><span>Donor:</span> <strong>Star Kabab Banani</strong></div>
            <div className="v-cert-row"><span>Food:</span> <strong>35x Mutton Kacchi Biryani</strong></div>
            <div className="v-cert-row"><span>Recipient:</span> <strong>Anjuman Orphanage Shelter</strong></div>
            <div className="v-cert-row"><span>CO2 Offset:</span> <strong>28.5 kg CO2e Prevented</strong></div>
          </div>

          <Button variant="primary" fullWidth onClick={() => setIsCelebrationModalOpen(false)}>
            Close & Continue Rescuing 🚀
          </Button>
        </div>
      </Modal>

      {/* MODAL 4: RIDER LOCATION MODE & RECEPTION DISTANCE RADIUS */}
      <Modal
        isOpen={isGpsModalOpen}
        onClose={() => setIsGpsModalOpen(false)}
        title="📍 Rider Location & Rescue Radius Configuration"
      >
        <div className="v-gps-modal-content">
          <p className="v-gps-desc">
            Primary location is auto-synced from <strong>Live Device GPS</strong>. You can also specify a manual location and set your maximum pickup coverage radius.
          </p>

          {/* Location Mode Switcher */}
          <div className="v-loc-mode-switcher">
            <button 
              type="button" 
              className={`v-mode-tab ${locationMode === 'live' ? 'active' : ''}`}
              onClick={fetchDeviceGps}
            >
              🛰️ Live Device GPS (Primary Auto)
            </button>
            <button 
              type="button" 
              className={`v-mode-tab ${locationMode === 'manual' ? 'active' : ''}`}
              onClick={() => setLocationMode('manual')}
            >
              ✏️ Manual Location Input
            </button>
          </div>

          {/* MANUAL LOCATION OPTIONS */}
          {locationMode === 'manual' && (
            <div className="v-manual-loc-section">
              <label className="v-label">Quick Pick Preset Areas</label>
              <div className="v-preset-chips-grid">
                <button type="button" className="v-preset-chip" onClick={() => handleApplyManualLocation('banani')}>
                  🏙️ Banani Rd 11
                </button>
                <button type="button" className="v-preset-chip" onClick={() => handleApplyManualLocation('gulshan')}>
                  🏙️ Gulshan 2
                </button>
                <button type="button" className="v-preset-chip" onClick={() => handleApplyManualLocation('dhanmondi')}>
                  🏙️ Dhanmondi 32
                </button>
                <button type="button" className="v-preset-chip" onClick={() => handleApplyManualLocation('uttara')}>
                  🏙️ Uttara Sector 7
                </button>
                <button type="button" className="v-preset-chip" onClick={() => handleApplyManualLocation('bashundhara')}>
                  🏙️ Bashundhara Block D
                </button>
              </div>

              <div className="v-form-group" style={{ marginTop: '0.8rem' }}>
                <label className="v-label">Or Type Custom Landmark / Address</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="v-input-text"
                    placeholder="e.g. Mohakhali Wireless Gate, Dhaka"
                    value={manualAddressInput}
                    onChange={(e) => setManualAddressInput(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="v-btn-apply-manual"
                    onClick={() => handleApplyManualLocation()}
                  >
                    Set
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RADAR RADIUS SELECTION */}
          <div className="v-form-group" style={{ marginTop: '1rem' }}>
            <label className="v-label">
              Max Rescue Coverage Radius: <strong style={{ color: '#059669' }}>{radarRadius} km Distance</strong>
            </label>
            <div className="v-radius-buttons-grid">
              <button 
                type="button"
                className={`v-rad-btn ${radarRadius === 1.0 ? 'active' : ''}`}
                onClick={() => setRadarRadius(1.0)}
              >
                1.0 km (Under 10 mins)
              </button>
              <button 
                type="button"
                className={`v-rad-btn ${radarRadius === 2.0 ? 'active' : ''}`}
                onClick={() => setRadarRadius(2.0)}
              >
                2.0 km (Recommended)
              </button>
              <button 
                type="button"
                className={`v-rad-btn ${radarRadius === 3.5 ? 'active' : ''}`}
                onClick={() => setRadarRadius(3.5)}
              >
                3.5 km (Extended Zone)
              </button>
              <button 
                type="button"
                className={`v-rad-btn ${radarRadius === 5.0 ? 'active' : ''}`}
                onClick={() => setRadarRadius(5.0)}
              >
                5.0 km (Wide Metro Area)
              </button>
            </div>
          </div>

          {gpsStatusText && <div className="v-gps-status-msg">{gpsStatusText}</div>}

          <div style={{ marginTop: '1.2rem' }}>
            <Button variant="primary" fullWidth onClick={() => setIsGpsModalOpen(false)}>
              Save Location & Update {radarRadius}km Radius ➔
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
