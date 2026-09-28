# Google Maps API Configuration Rule

Always use the paid Google Maps API Key for all mapping, route rendering, distance calculations, geocoding, and interactive map views in this project.

## API Key Details
- **Environment Variable**: `VITE_GOOGLE_MAPS_API_KEY`
- **Active Key**: `AIzaSyBIKG1_7dXrogPVS61VIjDNEbnqXm5YrxY`
- **Key Location**: `frontend/.env`

## Tile & Mapping Standards
1. Use `dhakaRouteService.js` (`getOsmTileLayer` / `getMapTileLayer`) which returns official Google Maps Tile API URLs:
   - Light Mode: `https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${VITE_GOOGLE_MAPS_API_KEY}`
   - Dark Mode: `https://mt{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}&key=${VITE_GOOGLE_MAPS_API_KEY}`
   - Subdomains: `'0123'`
2. Ensure Leaflet `<TileLayer />` elements across all portals (Volunteer App, Restaurant Dashboard, NGO Dashboard, Admin Portal, Consumer Tracker) use this Google Maps key configuration.
