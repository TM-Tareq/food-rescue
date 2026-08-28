# Surplus Food Rescue & Redistribution Platform
## Full Project Feature Specification & Architecture Document

---

### 1. User Roles & Authentication
* **Multi-role Support:** Restaurant (Donor), NGO (Recipient), Volunteer (Transporter), System Admin (Operator).
* **Secure Registration & Login:** Email / Phone + OTP authentication, OAuth social login (optional).
* **Role-Based Access Control (RBAC):** Strict permissions per role.
* **Profile Management:** Profile editing, document upload, verification status indicators.
* **Verification System:** Admin approval workflow for NGO & Restaurant credentials (trade license, registration docs).
* **Volunteer Background Check:** Reliability scoring, document/ID verification status.
* **[NEW] Legal & Food Safety Liability Waiver:**
  * Mandatory digital terms acceptance during registration.
  * Food safety disclaimer on every donation post (Restaurant confirms safety compliance).
  * Recipient waiver upon accepting food donations.

---

### 2. Restaurant Features (Donors)
* **Surplus Food Posting:**
  * Food name, quantity (servings/kg), food category (cooked, packed, dry, baked, etc.).
  * Preparation timestamp & mandatory pickup deadline.
  * Storage condition requirements (Hot / Cold / Room Temperature).
  * Packaging details & Best-Before timestamp.
  * Photo upload & Allergen / Ingredient notes.
* **Food Safety Validation (System Auto-Check):** Automated safety window validation prior to publishing.
* **Post Management:** Edit or cancel active posts before matching occurs.
* **Real-time Rescue Tracking:** Track assigned volunteer, pickup ETA, and delivery progress.
* **Donation History & Analytics:** Historical log of all rescued food, tax/impact statements.
* **Ratings & Feedback:** Two-way feedback system from NGOs and Volunteers.
* **Match & Pickup Notifications:** Instant alerts when matched, picked up, or delivered.

---

### 3. NGO Features (Recipients)
* **Demand / Requirement Posting (Optional):**
  * Required quantity range & preferred food types.
  * Target service area & distribution capacity limits.
* **Pickup Representative Status:** Toggle available pickup personnel (Yes/No + available time slots).
* **Offer Management:** View, accept, or decline auto-matched food offers with distance & urgency badges.
* **Surplus Discovery Map:** Browse nearby available surplus food posts with real-time distance matrix.
* **Internal Pickup Assignment:** Assign internal staff or request community volunteer transport.
* **Delivery Verification & Confirmation:**
  * Photo proof upload upon receipt.
  * Recipient OTP/code entry for handover verification.
* **[NEW] Food Quality Dispute & Complaint Management:**
  * Report spoiled, mislabeled, or substandard food upon delivery.
  * File photo/description evidence to flag donor accounts for Admin investigation.
* **Impact Dashboard:** Meals received, individuals served, total weight rescued.

---

### 4. Volunteer Features (Transporters)
* **Detailed Profile Setup:**
  * Selectable service coverage zones (multiple areas).
  * Flexible availability time slots & vehicle type selection (Walk, Bicycle, Motorcycle, Car, Van).
  * Carrying capacity (weight in kg / volume in liters).
  * Optional live location sharing.
* **Real-time Availability Toggle:** Online/Offline switch for receiving rescue dispatch requests.
* **Dispatch & Assignment:** Receive detailed rescue requests (pickup, dropoff, route distance, expiry countdown).
* **Navigation Integration:** One-tap integration with Google Maps / Waze / Apple Maps.
* **Pickup Verification:** Digital verification via QR code scan or OTP code + photo proof at restaurant.
* **Delivery Verification:** Verification code + recipient photo proof upon dropoff.
* **[NEW] Maximum Transport Duration Safety Guard:**
  * System alerts volunteer if transport time exceeds safe limits for perishable/hot food items.
* **[NEW] Masked Contact & Privacy Shield:**
  * In-app masked calling/messaging without exposing personal phone numbers.
* **Incentive & Performance Tracking:** Reliability score, completed rescues count, distance traveled, gamification points.

---

### 5. Smart Matching Engine (Core Feature)
* **Multi-Constraint Matching Algorithm:**
  * Distance matrix (spatial proximity).
  * Food quantity vs. NGO capacity.
  * Volunteer availability, vehicle capacity, and geographic zone.
  * Feasibility of total time window (Preparation → Pickup → Transport → Expiry).
  * Historical reliability & performance score weighting.
* **Weighted Scoring Formulation:**
  $$\text{Priority Score} = \left(w_1 \cdot \frac{1}{\text{Distance}}\right) + (w_2 \cdot \text{FoodUrgency}) + (w_3 \cdot \text{CapacityMatch}) + (w_4 \cdot \text{VolunteerScore})$$
* **Priority Engine:** Higher urgency (closer to expiry) gets elevated match priority.
* **Partial Matching Support:** Split large food quantities across multiple NGOs/Volunteers if needed.
* **Automated Failure Recovery:** Instant re-matching upon volunteer cancellation or NGO rejection.
* **Manual Override:** Admin privilege to manually route or reassign any active match.

---

### 6. Food Safety & Compliance Module
* **Configurable Expiry Rules:** Custom safety threshold windows based on food category & storage conditions.
* **Automated Rejection:** Block posts if remaining safe time is insufficient for pickup and transport.
* **Live Countdown Timers:** Visual real-time countdown timers on active listings.
* **Expiry & Storage Alerts:** Notifications when food is nearing unsafe threshold during transit or pickup.
* **[NEW] Maximum Transport Time Enforcement:** Hard cutoff timers based on food temperature requirements (e.g., max 45 mins transport for hot cooked meals without thermal storage).

---

### 7. Real-time Tracking & Coordination
* **State Management Pipeline:** `Posted → Matched → Assigned → Picked Up → In-Transit → Delivered → Verified`.
* **Live GPS Tracking:** Real-time location tracking of active volunteer during rescue mission.
* **Dynamic ETA Calculation:** Live route traffic and distance calculation.
* **[NEW] Masked In-App Communication:** In-app chat and phone masking between Restaurant, Volunteer, and NGO.
* **Multi-channel Alerts:** In-app push notifications, SMS alerts for critical time-sensitive events.

---

### 8. Failure Handling, Recovery & Disputes
* **Volunteer Cancellation Handling:** Auto-re-match engine triggers immediately; emergency broadcast to nearby top-rated volunteers.
* **NGO Rejection Flow:** Offer auto-rerouted to next optimal nearby recipient.
* **Timeout Handling:** Auto-escalate unhandled posts after custom timeout thresholds.
* **[NEW] Dispute Resolution Workflow:** Admin ticket resolution for reported spoiled food, late pickups, or no-shows.
* **Rescue Failure Analytics:** Logging failure causes for system optimization and user scoring adjustments.

---

### 9. Admin Panel Features
* **Verification Operations:** Document review and approval workflow for Restaurants & NGOs.
* **System Parameter Tuning:** Adjust matching weights, safety window duration, and retry timeouts.
* **Live Rescue Command Center:** Interactive map view of all active rescues, volunteers, and pending posts.
* **Manual Intervention:** Force assign, re-route, cancel, or extend active rescue jobs.
* **User Management & Moderation:** Suspension, strike system, and background check audits.
* **System Health Dashboard:** Microservice uptime, database health, API latency, notification queue status.

---

### 10. Analytics & Reporting
* **Stakeholder Impact Reports:**
  * Restaurant: CO2 offset, meals donated, tax deduction summary (PDF export).
  * NGO: Total meals received, nutritional categories, beneficiary breakdown.
  * Volunteer: Distance covered, hours contributed, rescue certificates.
* **System-Wide Analytics Dashboard:** Total food weight rescued, success vs. failure rates, average response times.
* **Geographic Heatmaps:** Surplus food density zones vs. high demand areas.
* **Export Formats:** Downloadable reports in PDF, CSV, Excel.

---

### 11. Notification System
* **In-App Notifications:** Real-time notification center for all status updates.
* **Push Notifications:** Web and Mobile push alerts for instant matching requests.
* **SMS Gateway Integration:** SMS alerts for time-critical actions (e.g., urgent pickup needed within 20 mins).
* **Notification Preferences:** User-defined alert settings and silent hours.

---

### 12. Advanced & Bonus Features
* **Predictive Surplus Suggestion:** ML-based forecasting of surplus food generation based on restaurant history and day-of-week trends.
* **Dynamic Incentive System:** Points, badges, and recognition leaderboard for volunteers.
* **Multi-Language Support:** Full internationalization (Bangla + English UI toggle).
* **Dark Mode Support:** Theme switching (Dark/Light mode).
* **Basic Offline Support:** Offline queueing for proof photo upload & verification codes when connection drops.
* **Public / Third-Party API:** RESTful API for integration with restaurant POS systems and corporate CSR dashboards.
