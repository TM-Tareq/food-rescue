# FoodRescue Project Guidelines

## Core Services & APIs
- **Google Maps API**: Always use the active paid Google Maps API key `AIzaSyBIKG1_7dXrogPVS61VIjDNEbnqXm5YrxY` stored in `frontend/.env` under `VITE_GOOGLE_MAPS_API_KEY`.
- **Mapping Service**: `frontend/src/services/dhakaRouteService.js` manages Google Maps route waypoints, high-res tile URLs, ETA floating badges, and Leaflet vector markers across all role portals.

## Role Portals & Workflows
- **Volunteer Rider App**: `frontend/src/features/volunteer/VolunteerApp.jsx`
- **Consumer Marketplace & Live Foodpanda-Style Tracker**: `frontend/src/features/consumer/ConsumerMarketplace.jsx` & `frontend/src/features/consumer/components/ActiveOrdersTab.jsx`
- **NGO Recipient Portal**: `frontend/src/features/ngo/NgoDashboard.jsx`
- **Restaurant Surplus Dashboard**: `frontend/src/features/restaurant/RestaurantDashboard.jsx`
- **Admin Control & Supply Chain Radar**: `frontend/src/features/admin/AdminDashboard.jsx` & `frontend/src/services/supplyChainService.js`
