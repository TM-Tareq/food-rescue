import L from 'leaflet';

/**
 * Shared Google Maps Route Generator for Dhaka Avenues
 * Provides real street-following waypoints, Google ETA badges, and clean pin markers matching Image 2.
 */

// 1. Primary Road Network Waypoints (Following Pragati Sarani, Kuril Flyover, 300 Feet Rd, Bashundhara Ave)
export const BANANI_TO_BASHUNDHARA_PRIMARY_ROUTE = [
  [23.7937, 90.4066], // Banani Rd 11
  [23.7960, 90.4055], // Kemal Ataturk Ave
  [23.8020, 90.4040], // Kakrail/Airport Rd Entry
  [23.8105, 90.4050], // Kurmitola / Army Golf Link
  [23.8160, 90.4095], // Khilkhet Overpass Loop
  [23.8175, 90.4140], // Kuril Flyover Bridge Curve
  [23.8155, 90.4210], // Pragati Sarani Roundabout Turn
  [23.8120, 90.4230], // Bashundhara Main Gate Turn
  [23.8115, 90.4265], // Bashundhara Road 2
  [23.8103, 90.4310]  // Anjuman Shelter (Evercare Hospital area)
];

// 2. Alternate Route (Following 300 Feet Highway & Namapara Road - Like Image 2)
export const BANANI_TO_BASHUNDHARA_ALT_ROUTE = [
  [23.7937, 90.4066], // Banani Rd 11
  [23.8050, 90.4060], // Radisson Blue Link
  [23.8185, 90.4100], // Kuril Flyover High Expressway
  [23.8210, 90.4220], // Khilkhet Namapara Turn
  [23.8235, 90.4250], // N301 300 Feet Purbachal Highway
  [23.8180, 90.4340], // Bashundhara Block M Avenue
  [23.8103, 90.4310]  // Anjuman Shelter
];

// Midpoints for Floating Google ETA Badges (Matching Image 2)
export const PRIMARY_ROUTE_ETA_POS = [23.8120, 90.4220]; // Pragati Sarani Turn
export const ALT_ROUTE_ETA_POS = [23.8210, 90.4220];     // Khilkhet N301 Expressway

/**
 * Creates Google Maps Floating ETA Badge Marker (Matching Image 2)
 */
export const createGoogleEtaBadgeMarker = (etaText, distText, isPrimary = true) => {
  const bg = isPrimary ? '#ffffff' : '#f8fafc';
  const border = isPrimary ? '#2563eb' : '#cbd5e1';
  const textColor = isPrimary ? '#0f172a' : '#64748b';
  const shadow = isPrimary ? '0 4px 16px rgba(37,99,235,0.25)' : '0 2px 8px rgba(0,0,0,0.1)';

  const html = `
    <div style="
      background: ${bg};
      border: 1.5px solid ${border};
      border-radius: 8px;
      padding: 5px 10px;
      box-shadow: ${shadow};
      white-space: nowrap;
      font-family: 'Inter', system-ui, sans-serif;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transform: translate(-50%, -50%);
    ">
      <span style="font-size: 14px;">🚘</span>
      <div style="display: flex; flex-direction: column; align-items: start;">
        <span style="font-weight: 700; font-size: 12px; color: ${textColor}; line-height: 1.1;">${etaText}</span>
        <span style="font-weight: 500; font-size: 10px; color: #64748b; line-height: 1.1;">${distText}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'google-eta-badge-marker',
    iconSize: [110, 36],
    iconAnchor: [55, 18]
  });
};

/**
 * Creates Clean Google Pin Vector Marker WITHOUT Overlapping Text Labels (Matching Image 2)
 */
export const createGoogleCleanPinMarker = (emoji, pinColor, title = '') => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M18 0C8.05 0 0 8.05 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.05 27.95 0 18 0z" fill="${pinColor}" filter="url(#shadow)"/>
      <circle cx="18" cy="17" r="12" fill="#ffffff"/>
      <text x="18" y="19" font-size="15" text-anchor="middle" dominant-baseline="central">${emoji}</text>
    </svg>
  `;

  return L.icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`,
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -42]
  });
};
