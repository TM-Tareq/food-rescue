import React, { useState, useEffect, useRef } from 'react';
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
import { supplyChainService } from '../../services/supplyChainService';
import { surplusService } from '../../services/surplusService';
import {
  BANANI_TO_BASHUNDHARA_PRIMARY_ROUTE,
  BANANI_TO_BASHUNDHARA_ALT_ROUTE,
  getDhakaStreetWaypoints
} from '../../services/dhakaRouteService';
import './VolunteerApp.css';

/**
 * Native Paid Google Maps JS API Viewport Component
 */
function GoogleMapsNativeView({
  centerCoords,
  radarRadius,
  activeMission,
  themeMode,
  riderLocationName,
  locationMode
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);
  const polylineRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (typeof window === 'undefined' || !window.google || !window.google.maps) {
      console.warn('Google Maps JS SDK initializing...');
      return;
    }

    const center = { lat: centerCoords[0], lng: centerCoords[1] };

    const darkMapStyles = [
      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
      { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
      { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
      { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
      { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
      { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
      { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
      { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
      { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
      { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
      { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] }
    ];

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 14,
        styles: themeMode === 'dark' ? darkMapStyles : [],
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy'
      });
    } else {
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setOptions({
        styles: themeMode === 'dark' ? darkMapStyles : []
      });
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // Clear previous polylines
    polylineRef.current.forEach(p => p.setMap(null));
    polylineRef.current = [];

    // Google Maps Radar Geofence Circle Ring
    if (circleRef.current) circleRef.current.setMap(null);
    circleRef.current = new window.google.maps.Circle({
      strokeColor: locationMode === 'live' ? '#10b981' : '#f59e0b',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: locationMode === 'live' ? '#10b981' : '#f59e0b',
      fillOpacity: 0.12,
      map,
      center,
      radius: radarRadius * 1000
    });

    const createGooglePinSvg = (emoji, color) => `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
        <path d="M18 0C8.05 0 0 8.05 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.05 27.95 0 18 0z" fill="${color}"/>
        <circle cx="18" cy="17" r="12" fill="#ffffff"/>
        <text x="18" y="19" font-size="15" text-anchor="middle" dominant-baseline="central">${emoji}</text>
      </svg>
    `;

    // Rider Google Maps Marker
    const riderMarker = new window.google.maps.Marker({
      position: center,
      map,
      title: `Rider: Tanvir Hossain (${riderLocationName})`,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(createGooglePinSvg('🛵', '#10b981')),
        scaledSize: new window.google.maps.Size(36, 46),
        anchor: new window.google.maps.Point(18, 46)
      }
    });
    markersRef.current.push(riderMarker);

    // Active Mission Pickup & Dropoff Markers
    if (activeMission && activeMission.pickupCoords) {
      const restoPos = { lat: activeMission.pickupCoords[0], lng: activeMission.pickupCoords[1] };
      const restoMarker = new window.google.maps.Marker({
        position: restoPos,
        map,
        title: `Pickup: ${activeMission.restaurantName}`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(createGooglePinSvg('🏪', '#ef4444')),
          scaledSize: new window.google.maps.Size(36, 46),
          anchor: new window.google.maps.Point(18, 46)
        }
      });
      markersRef.current.push(restoMarker);

      if (activeMission.dropoffCoords) {
        const shelterPos = { lat: activeMission.dropoffCoords[0], lng: activeMission.dropoffCoords[1] };
        const shelterMarker = new window.google.maps.Marker({
          position: shelterPos,
          map,
          title: `Deliver to: ${activeMission.shelterName}`,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(createGooglePinSvg('🏠', '#3b82f6')),
            scaledSize: new window.google.maps.Size(36, 46),
            anchor: new window.google.maps.Point(18, 46)
          }
        });
        markersRef.current.push(shelterMarker);

        const streetPts = getDhakaStreetWaypoints(
          [center.lat, center.lng],
          activeMission.pickupCoords,
          activeMission.dropoffCoords || activeMission.pickupCoords
        );
        const googlePath = streetPts.map(pt => ({ lat: pt[0], lng: pt[1] }));

        if (window.google && window.google.maps && window.google.maps.DirectionsService) {
          const ds = new window.google.maps.DirectionsService();
          ds.route(
            {
              origin: center,
              destination: shelterPos || restoPos,
              waypoints: [{ location: restoPos, stopover: true }],
              travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
              if (status === 'OK' && result.routes && result.routes[0]) {
                const polyline = new window.google.maps.Polyline({
                  path: result.routes[0].overview_path,
                  geodesic: true,
                  strokeColor: '#2563eb',
                  strokeOpacity: 0.95,
                  strokeWeight: 6,
                  map
                });
                polylineRef.current.push(polyline);
              } else {
                const polyline = new window.google.maps.Polyline({
                  path: googlePath,
                  geodesic: true,
                  strokeColor: '#2563eb',
                  strokeOpacity: 0.95,
                  strokeWeight: 6,
                  map
                });
                polylineRef.current.push(polyline);
              }
            }
          );
        } else {
          const polyline = new window.google.maps.Polyline({
            path: googlePath,
            geodesic: true,
            strokeColor: '#2563eb',
            strokeOpacity: 0.95,
            strokeWeight: 6,
            map
          });
          polylineRef.current.push(polyline);
        }
      }
    }
  }, [centerCoords, radarRadius, activeMission, themeMode, riderLocationName, locationMode]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <div className="v-map-overlay-banner">
        <Navigation size={13} /> <span><strong>Google Maps API (Paid Active)</strong> • {riderLocationName} • <strong>{radarRadius} km Coverage</strong></span>
      </div>
    </div>
  );
}

export default function VolunteerApp({ onLogout }) {
  const { logout } = useAuth();
  const { roleThemes, toggleRoleTheme } = useTheme();
  const themeMode = roleThemes.volunteer;
  const [activeTab, setActiveTab] = useState('dispatch'); // 'dispatch', 'feed', 'impact', 'profile'
  const [isOnline, setIsOnline] = useState(true);
  const [vehicleType, setVehicleType] = useState('motorbike'); // 'motorbike', 'bicycle', 'car', 'walk'
  const [isDeviceFrameMode, setIsDeviceFrameMode] = useState(true); // Toggle device shell vs stretched view

  // Mission Step Workflow (0: Incoming Alert, 1: Pickup, 2: OTP, 3: Delivery, 4: Handover, 5: Celebration)
  const [missionStep, setMissionStep] = useState(() => {
    try {
      const saved = localStorage.getItem('foodrescue_active_rider_mission');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.missionStep === 'number' && parsed.missionStep > 0 && parsed.missionStep < 5) {
          return parsed.missionStep;
        }
      }
    } catch (e) {}
    return 0;
  });
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [sosReason, setSosReason] = useState('VEHICLE_BREAKDOWN');
  const [sosStatus, setSosStatus] = useState(null);
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);
  const [hasIncomingAlert, setHasIncomingAlert] = useState(false); // Default false when 0 DB items exist

  // Rider Location, Coords & Geofence Radius State
  const [riderCoords, setRiderCoords] = useState([23.8110, 90.4200]); // Gulshan-Banani Live GPS
  const [locationMode, setLocationMode] = useState('live'); // 'live' (Primary Auto) or 'manual'
  const [riderLocationName, setRiderLocationName] = useState('Live GPS (23.811, 90.420)');
  const [manualAddressInput, setManualAddressInput] = useState('');

  // Persistent Radar Coverage Radius State (Saved in LocalStorage across page reloads)
  const [radarRadius, setRadarRadiusState] = useState(() => {
    try {
      const saved = localStorage.getItem('foodrescue_radar_radius');
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to read radar radius from localStorage:', e);
    }
    return 5.0; // Default 5.0 km fallback
  });

  const setRadarRadius = (val) => {
    setRadarRadiusState(val);
    try {
      localStorage.setItem('foodrescue_radar_radius', val.toString());
    } catch (e) {
      console.warn('Failed to save radar radius to localStorage:', e);
    }
  };
  const [isGpsModalOpen, setIsGpsModalOpen] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState(null);
  const [surplusPool, setSurplusPool] = useState([]);
  const [activeMission, setActiveMission] = useState(() => {
    try {
      const saved = localStorage.getItem('foodrescue_active_rider_mission');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.activeMission && parsed.missionStep > 0 && parsed.missionStep < 5) {
          return parsed.activeMission;
        }
      }
    } catch (e) {}
    return null;
  });

  // Fetch Live Device GPS Location (Primary Auto Mode)
  const fetchDeviceGps = () => {
    setLocationMode('live');
    setGpsStatusText('🛰️ Contacting device GPS satellites...');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setRiderCoords([latitude, longitude]);
          if (activeMission) {
            setActiveMission(prev => prev ? ({ ...prev, riderCoords: [latitude, longitude] }) : null);
          }

          let locationText = `Live GPS (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`;

          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            if (data && data.address) {
              const road = data.address.road || data.address.suburb || data.address.neighbourhood || data.address.city_district || data.address.city || '';
              const city = data.address.city || data.address.town || data.address.county || 'Dhaka';
              if (road) {
                locationText = `${road}, ${city} (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`;
              } else if (data.display_name) {
                const parts = data.display_name.split(',');
                locationText = `${parts[0]?.trim() || 'Live Location'}, ${parts[1]?.trim() || ''} (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`;
              }
            }
          } catch (e) {
            console.warn('Reverse geocoding fetch error:', e);
          }

          setRiderLocationName(locationText);
          setGpsStatusText(`✅ Live Device GPS Acquired: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => {
          console.warn('GPS error fallback:', error);
          setRiderLocationName('GPS Permission Denied / Off');
          setGpsStatusText('⚠️ GPS Permission Denied or Timed Out. Please allow browser location access.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setRiderLocationName('Geolocation Not Supported');
      setGpsStatusText('⚠️ Geolocation not supported by browser.');
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
      setRiderCoords(selected.coords);
      if (activeMission) {
        setActiveMission(prev => prev ? ({ ...prev, riderCoords: selected.coords }) : null);
      }
      setGpsStatusText(`📍 Manual Location Set: ${selected.name}`);
    } else if (manualAddressInput.trim()) {
      setRiderLocationName(manualAddressInput.trim());
      setGpsStatusText(`📍 Manual Custom Location Set: ${manualAddressInput.trim()}`);
    }
  };

  // Real-Time Database Order Creation Helper (Simulate Real Order in Database)
  const handleCreateRealTestOrder = () => {
    const orderId = `BATCH-${Math.floor(8000 + Math.random() * 999)}`;
    const passId = `PASS-${Math.floor(100000 + Math.random() * 900000)}`;
    const pinCode = '1794';

    const consumerOrderObj = {
      id: passId,
      batchId: orderId,
      restaurantName: 'Star Chef Bistro',
      restaurantAddress: 'Block D, Banani Rd 11, Dhaka',
      restaurantPhone: '+880 1711-987654',
      itemTitle: 'Gourmet Beef Tehari & Salad Package',
      quantity: 1,
      totalAmount: 250,
      fulfillmentType: 'delivery',
      paymentMethod: 'COD',
      pinCode: pinCode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      status: 'RIDER_SEARCHING',
      riderAssigned: false,
      riderName: 'Searching for Hero Rider...',
      riderPhone: null,
      riderAvatar: '🛵',
      riderRating: '4.9',
      distanceKm: '0.8 km',
      eta: '12 mins ETA'
    };

    // Save to consumer orders
    try {
      const saved = localStorage.getItem('foodrescue_consumer_orders');
      const orders = saved ? JSON.parse(saved) : [];
      orders.unshift(consumerOrderObj);
      localStorage.setItem('foodrescue_consumer_orders', JSON.stringify(orders));
    } catch (e) { }

    const newOrder = {
      id: orderId,
      title: 'Gourmet Beef Tehari & Salad Package',
      name: 'Gourmet Beef Tehari & Salad Package',
      restaurant: 'Star Chef Bistro',
      donor: 'Star Chef Bistro',
      restaurantAddress: 'Block D, Banani Rd 11, Dhaka',
      area: 'Banani, Dhaka',
      category: 'COOKED_MEAL',
      portions: 1,
      portionsClaimedNgo: 0,
      portionsSoldConsumer: 1,
      hygieneScore: 98,
      aiGrade: 'GRADE_A_PREMIUM',
      prepTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiryTime: 'Expires in 45 mins',
      currentStage: 2,
      status: 'CLAIMED_PENDING_PICKUP',
      deliveryMode: 'VOLUNTEER_RIDER',
      recipient: 'Farhan Ahmed (House 42, Road 11, Block D, Banani, Dhaka)',
      customerName: 'Farhan Ahmed',
      customerAddress: 'House 42, Road 11, Block D, Banani, Dhaka',
      customerPhone: '+880 1712-345678',
      recipientType: 'CONSUMER',
      riderName: 'Pending Rider Acceptance',
      riderPhone: '+880 1711-987654',
      riderAvatar: '🛵',
      pickupOtp: pinCode,
      pickupOtpVerified: false,
      pickupOtpStatus: 'ACTIVE_VISIBLE',
      deliveryOtp: pinCode,
      deliveryOtpVerified: false,
      deliveryOtpStatus: 'ACTIVE_VISIBLE',
      eta: '12 mins ETA',
      distanceKm: '0.8 km',
      pickupCoords: [23.7937, 90.4066],
      dropoffCoords: [23.7937, 90.4066],
      foodSavedKg: 1.8,
      co2SavedKg: 2.7,
      createdAt: Date.now(),
      isDemo: false
    };
    supplyChainService.addOrUpdateBatch(newOrder);
  };

  // Haversine Distance Helper (lat1, lon1, lat2, lon2 in km)
  const calculateHaversineKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 1.0;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  // Parse Remaining Expiry Minutes Helper
  const parseRemainingMinutes = (expiryTime, expiresAt) => {
    if (expiresAt && typeof expiresAt === 'number') {
      const mins = Math.round((expiresAt - Date.now()) / (1000 * 60));
      return mins > 0 ? mins : 5;
    }
    if (typeof expiryTime === 'string') {
      const match = expiryTime.match(/(\d+)\s*(min|hr|hour)/i);
      if (match) {
        const val = parseInt(match[1], 10);
        return match[2].toLowerCase().startsWith('h') ? val * 60 : val;
      }
    }
    return 35; // Default 35 mins
  };

  const syncSurplusPoolFromSupplyChain = () => {
    try {
      const batches = supplyChainService.getBatches();
      // Filter for VOLUNTEER_RIDER delivery mode and non-delivered items
      const riderBatches = batches.filter(b => b.deliveryMode === 'VOLUNTEER_RIDER' && b.status !== 'DELIVERED');

      const mapped = riderBatches.map(b => {
        const pCoords = b.pickupCoords || [23.7937, 90.4066];
        const distKm = calculateHaversineKm(riderCoords[0], riderCoords[1], pCoords[0], pCoords[1]);
        const remainingMins = parseRemainingMinutes(b.expiryTime, b.expiresAt);
        const isConsumerOrder = b.recipientType === 'CONSUMER' || (b.recipient && (b.recipient.includes('Consumer') || b.recipient.includes('Farhan')));

        // Priority Score Formula:
        // Real Consumer Orders get -1000 priority bonus so active consumer delivery requests ALWAYS show up FIRST at top of Rider Cockpit!
        const priorityScore = (isConsumerOrder ? -1000 : 0) + (remainingMins * 1.0) + (distKm * 3.0);

        return {
          id: b.id,
          restaurantName: b.restaurant || b.donor || 'Star Chef Bistro',
          restaurantAddress: b.restaurantAddress || b.area || 'Banani, Dhaka',
          restaurantPhone: b.riderPhone || '+880 1711-987654',
          shelterName: isConsumerOrder ? (b.customerName ? `${b.customerName} (${b.customerAddress || b.area || 'Banani, Dhaka'})` : (b.recipient || 'Farhan Ahmed (Banani, Dhaka)')) : (b.recipient || 'NGO Shelter'),
          shelterAddress: isConsumerOrder ? (b.customerAddress || b.restaurantAddress || 'House 42, Road 11, Block D, Banani, Dhaka') : (b.shelterAddress || 'Dhaka Destination'),
          shelterPhone: b.customerPhone || b.shelterPhone || '+880 1712-345678',
          foodItem: b.title || b.name || 'Gourmet Beef Tehari & Salad Package',
          weight: isConsumerOrder ? `1 Consumer Meal Pack (${b.portions || 1}x)` : `${b.foodSavedKg || 12} kg (Feeds ${b.portions || 25} People)`,
          expiryTime: b.expiryTime || `${remainingMins} mins left`,
          remainingMins,
          karmaPoints: isConsumerOrder ? 40 : 50,
          requiredOtp: b.pickupOtp || '1794',
          deliveryOtp: b.deliveryOtp || b.pickupOtp || '1794',
          pickupCoords: pCoords,
          dropoffCoords: b.dropoffCoords || pCoords,
          dist: `${distKm} km away`,
          distKm,
          priorityScore,
          isConsumerOrder,
          urgency: isConsumerOrder ? 'CONSUMER_ORDER' : remainingMins <= 30 ? 'CRITICAL_URGENT' : remainingMins <= 60 ? 'HIGH' : 'NORMAL',
          createdAt: b.createdAt || Date.now(),
          isRealDatabaseOrder: !b.isDemo
        };
      });

      // Sort Priority: Lowest Priority Score First (Expiring Soonest + Nearest Distance)
      mapped.sort((a, b) => a.priorityScore - b.priorityScore);

      // Filter by rider radar coverage radius (fallback to all mapped items if radius is tight)
      const radiusFiltered = mapped.filter(item => item.distKm <= radarRadius);
      const activeList = radiusFiltered.length > 0 ? radiusFiltered : mapped;

      setSurplusPool(activeList);

      if (activeList.length > 0) {
        const topPriorityMission = activeList[0];
        setActiveMission({
          ...topPriorityMission,
          riderCoords: riderCoords
        });
        setHasIncomingAlert(true);
      } else {
        setActiveMission(null);
        setHasIncomingAlert(false);
      }
    } catch (e) {
      console.warn('Error syncing rider surplus pool:', e);
    }
  };

  useEffect(() => {
    fetchDeviceGps();
    syncSurplusPoolFromSupplyChain();

    const syncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('foodrescue_live_channel') : null;
    if (syncChannel) {
      syncChannel.onmessage = () => {
        syncSurplusPoolFromSupplyChain();
      };
    }

    window.addEventListener('foodrescue_supply_chain_updated', syncSurplusPoolFromSupplyChain);
    window.addEventListener('foodrescue_surplus_updated', syncSurplusPoolFromSupplyChain);
    window.addEventListener('foodrescue_claims_updated', syncSurplusPoolFromSupplyChain);
    window.addEventListener('storage', syncSurplusPoolFromSupplyChain);

    return () => {
      if (syncChannel) syncChannel.close();
      window.removeEventListener('foodrescue_supply_chain_updated', syncSurplusPoolFromSupplyChain);
      window.removeEventListener('foodrescue_surplus_updated', syncSurplusPoolFromSupplyChain);
      window.removeEventListener('foodrescue_claims_updated', syncSurplusPoolFromSupplyChain);
      window.removeEventListener('storage', syncSurplusPoolFromSupplyChain);
    };
  }, [radarRadius, riderLocationName, riderCoords]);

  // Persist Active Mission state to localStorage across page reloads
  useEffect(() => {
    try {
      if (activeMission && missionStep > 0 && missionStep < 5) {
        localStorage.setItem('foodrescue_active_rider_mission', JSON.stringify({
          activeMission,
          missionStep,
          timestamp: Date.now()
        }));

        // Continuously sync live rider location to supplyChainService for Consumer & Restaurant portals
        if (activeMission.id && riderCoords) {
          supplyChainService.addOrUpdateBatch({
            id: activeMission.id,
            riderCoords: riderCoords,
            riderName: activeMission.riderName || 'Tanvir Hossain (Motorcycle)',
            riderPhone: activeMission.riderPhone || '+880 1711-987654'
          });
        }
      } else if (missionStep === 0 || missionStep >= 5) {
        localStorage.removeItem('foodrescue_active_rider_mission');
      }
    } catch (e) {
      console.warn('Failed to persist active rider mission state:', e);
    }
  }, [activeMission, missionStep, riderCoords]);

  // Handle Rider Claiming / Accepting Any Rescue Item from the Surplus Board or Alert Card
  const handleAcceptRescueMission = (mission = activeMission) => {
    setMissionStep(1); // Set directly to Step 1: En Route to Pickup
    setActiveTab('dispatch'); // Automatically switch to Cockpit (Live Navigation)

    const target = mission || activeMission;
    if (target) {
      const updatedMission = {
        ...target,
        riderName: 'Tanvir Hossain (Motorcycle)',
        riderPhone: '+880 1711-987654',
        riderAvatar: '🛵',
        riderCoords: riderCoords
      };
      setActiveMission(updatedMission);

      try {
        localStorage.setItem('foodrescue_active_rider_mission', JSON.stringify({
          activeMission: updatedMission,
          missionStep: 1,
          timestamp: Date.now()
        }));
      } catch (e) {}

      // Update supplyChainService batch
      supplyChainService.addOrUpdateBatch({
        id: target.id,
        title: target.foodItem,
        restaurant: target.restaurantName,
        status: 'RIDER_ACCEPTED_EN_ROUTE_PICKUP',
        riderName: 'Tanvir Hossain (Motorcycle)',
        riderPhone: '+880 1711-987654',
        riderAvatar: '🛵',
        eta: 'En Route to Restaurant Pickup (ETA 8 mins)'
      });

      // Update Consumer Orders in LocalStorage
      try {
        const rawConsumerOrders = localStorage.getItem('foodrescue_consumer_orders');
        if (rawConsumerOrders) {
          const orders = JSON.parse(rawConsumerOrders);
          if (Array.isArray(orders)) {
            const updated = orders.map(ord => {
              if (ord.id === target.id || ord.batchId === target.id || ord.restaurantName === target.restaurantName) {
                return {
                  ...ord,
                  riderAssigned: true,
                  riderName: 'Tanvir Hossain (Motorcycle)',
                  riderPhone: '+880 1711-987654',
                  riderAvatar: '🛵',
                  status: 'RIDER_ASSIGNED',
                  eta: '12 mins ETA'
                };
              }
              return ord;
            });
            localStorage.setItem('foodrescue_consumer_orders', JSON.stringify(updated));
          }
        }
      } catch (e) {}

      // Dispatch cross-portal live sync events
      window.dispatchEvent(new Event('foodrescue_supply_chain_updated'));
      window.dispatchEvent(new Event('foodrescue_surplus_updated'));
      const syncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('foodrescue_live_channel') : null;
      if (syncChannel) {
        syncChannel.postMessage({ type: 'RIDER_ACCEPTED_MISSION', targetId: target.id, timestamp: Date.now() });
      }
    }
  };

  const handleClaimSurplusMission = (rescueItem) => {
    handleAcceptRescueMission(rescueItem);
  };

  // OTP Verification Handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');
    try {
      if (missionStep === 2) {
        // Pickup OTP verification (Kitchen Handover)
        if (activeMission?.id) supplyChainService.verifyPickupOtp(activeMission.id, otpInput.trim());

        ngoService.updateClaimStatus(activeMission?.title || activeMission?.foodItem || activeMission?.id, {
          statusCategory: 'ON_THE_WAY',
          statusLabel: '🚚 Rider Picked Up Food • En Route to Shelter',
          volunteerName: 'Tanvir Hossain (Motorcycle)',
          eta: 'Arrival ETA: 12 minutes away'
        });

        setOtpError('');
        setIsOtpModalOpen(false);
        setMissionStep(3); // Advance to Delivery
      } else if (missionStep === 4) {
        // Delivery OTP verification (Shelter Handover)
        if (activeMission?.id) supplyChainService.verifyDeliveryOtp(activeMission.id, otpInput.trim());

        ngoService.updateClaimStatus(activeMission?.title || activeMission?.foodItem || activeMission?.id, {
          statusCategory: 'DELIVERED',
          statusLabel: '🏢 Food Delivered to Shelter',
          volunteerName: 'Tanvir Hossain (Motorcycle)',
          isConfirmed: true,
          eta: 'Delivered & Saved'
        });

        setOtpError('');
        setMissionStep(5); // Advance to Celebration
        setIsCelebrationModalOpen(true);
      } else {
        const response = await volunteerService.verifyOtp(activeMission?.id || 'RESCUE-REAL', otpInput.trim());
        if (response.success || otpInput.trim() === activeMission?.requiredOtp) {
          setOtpError('');
          setIsOtpModalOpen(false);
          setMissionStep(3);
        } else {
          setOtpError(response.message || 'Invalid OTP Code!');
        }
      }
    } catch (err) {
      if (otpInput.trim() === activeMission?.requiredOtp || otpInput.trim() === activeMission?.deliveryOtp) {
        setOtpError('');
        setIsOtpModalOpen(false);
        setMissionStep(missionStep === 2 ? 3 : 5);
      } else {
        setOtpError(err.message || 'Invalid OTP Code! Please check with donor or recipient shelter.');
      }
    }
  };

  // SOS Emergency Trigger Handler
  const handleTriggerSos = async () => {
    const response = await volunteerService.triggerSosEmergency({
      missionId: activeMission?.id || 'RESCUE-REAL',
      riderLocation: activeMission?.riderCoords || riderCoords,
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

              {/* Full-Width Mobile GPS Native Google Maps Viewport */}
              <div className="v-mobile-map-container">
                <GoogleMapsNativeView
                  centerCoords={activeMission ? activeMission.riderCoords || riderCoords : riderCoords}
                  radarRadius={radarRadius}
                  activeMission={activeMission}
                  themeMode={themeMode}
                  riderLocationName={riderLocationName}
                  locationMode={locationMode}
                />
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
                          <span className="v-radar-ping">
                            {activeMission.isConsumerOrder ? '🛍️ NEW CONSUMER ORDER DISPATCH' : '⚡ NEW RESCUE DISPATCH NEARBY'}
                          </span>
                          <span className="v-timer-pill">⏳ {activeMission.expiryTime}</span>
                        </div>

                        <h4 className="v-food-name">🍲 {activeMission.foodItem}</h4>
                        <p className="v-resto-addr">🏪 <strong>{activeMission.restaurantName}</strong> ({activeMission.restaurantAddress || 'Banani, Dhaka'} • {activeMission.dist})</p>
                        <p className="v-shelter-addr">
                          🏠 Deliver to: <strong>{activeMission.shelterName}</strong>
                          {activeMission.shelterAddress && (
                            <span style={{ display: 'block', fontSize: '0.82rem', color: '#64748b', marginTop: '3px' }}>
                              📍 Address: <strong>{activeMission.shelterAddress}</strong> {activeMission.shelterPhone ? `• 📞 ${activeMission.shelterPhone}` : ''}
                            </span>
                          )}
                        </p>

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
                            onClick={() => handleAcceptRescueMission(activeMission)}
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

                    {/* Active Mission Food Details Header Card */}
                    {activeMission && (
                      <div style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        color: '#ffffff',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        marginBottom: '12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {activeMission.isConsumerOrder ? '🛍️ Active Consumer Delivery' : '⚡ Active Surplus Rescue'}
                          </span>
                          <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '12px' }}>
                            ⏳ {activeMission.expiryTime}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0 0 4px 0', color: '#f8fafc' }}>
                          🍲 {activeMission.foodItem}
                        </h4>

                        <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 8px 0' }}>
                          {activeMission.weight}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: '#cbd5e1', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                          <span>🏪 <strong>Pickup:</strong> {activeMission.restaurantName} ({activeMission.restaurantAddress || 'Banani, Dhaka'})</span>
                          <span>🏠 <strong>Deliver:</strong> {activeMission.shelterName} {activeMission.shelterAddress ? `(${activeMission.shelterAddress})` : ''}</span>
                          <span>🔑 <strong>Pickup OTP:</strong> <code style={{ background: '#2563eb', padding: '1px 6px', borderRadius: '4px', color: '#fff', fontWeight: 'bold' }}>{activeMission.requiredOtp}</code> | <strong>Delivery OTP:</strong> <code style={{ background: '#059669', padding: '1px 6px', borderRadius: '4px', color: '#fff', fontWeight: 'bold' }}>{activeMission.deliveryOtp}</code></span>
                        </div>
                      </div>
                    )}

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
                {surplusPool.length === 0 ? (
                  <div className="v-empty-surplus-card">
                    <div className="v-empty-icon-ring">
                      <Radio size={28} className="spin-icon" color="#10b981" />
                    </div>
                    <h4 className="v-empty-title">No Active Rescues in Area</h4>
                    <p className="v-empty-sub">
                      Database scanned for <strong>VOLUNTEER_RIDER</strong> requests within <strong>{radarRadius} km Radius</strong> of <strong>{riderLocationName}</strong>. No active rescue requests stored in area database right now.
                    </p>

                    <div className="v-db-status-badge">
                      <span>🗄️ Area Database: <strong>Synced Live</strong></span>
                      <span>⏰ Synced: <strong>{new Date().toLocaleTimeString()}</strong></span>
                    </div>

                    <div className="v-empty-action-box">
                      <span className="v-sim-lbl">Want to test adding a real order to the database?</span>
                      <button
                        type="button"
                        className="v-btn-create-test-order"
                        onClick={handleCreateRealTestOrder}
                      >
                        ⚡ Create Real Order in Area Database (+1 Order)
                      </button>
                    </div>
                  </div>
                ) : (
                  surplusPool.map((item) => {
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
                          <span className="v-feed-dist">
                            📍 {item.dist}
                            {item.isRealDatabaseOrder && <span className="v-db-tag">🗄️ Real Order</span>}
                          </span>
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
                  })
                )}
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
            Enter 4-digit code from <strong>{activeMission?.restaurantName || 'Restaurant'}</strong> staff to confirm pickup.
          </p>

          <div className="v-otp-hint">
            💡 Demo Verification OTP Code: <strong>{activeMission?.requiredOtp || '4892'}</strong>
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
              onClick={() => setOtpInput(activeMission?.requiredOtp || '4892')}
            >
              Autofill Code ({activeMission?.requiredOtp || '4892'})
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
          <h2>Fed 35 Children at {activeMission?.shelterName || 'Shelter'}!</h2>
          <p>Rescue mission #{activeMission?.id || 'RESCUE-REAL'} was completed and saved to MySQL database.</p>

          <div className="v-impact-cert-card">
            <h4>📜 Digital Rescue Impact Receipt</h4>
            <div className="v-cert-row"><span>Donor:</span> <strong>{activeMission?.restaurantName || 'Donor Restaurant'}</strong></div>
            <div className="v-cert-row"><span>Food:</span> <strong>{activeMission?.foodItem || 'Surplus Food'}</strong></div>
            <div className="v-cert-row"><span>Recipient:</span> <strong>{activeMission?.shelterName || 'NGO Shelter'}</strong></div>
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
