# Nukkad Flood Map – Build Plan (Hackathon Prototype)

## 1. Problem Statement

In many Indian cities, flood alerts are issued at the city or district level and focus on generic “red/orange alerts.” For residents in informal or low-income settlements, these alerts are:

- **Too coarse:** They don’t tell you whether *your lane* or *your exit* is flooded, or which gali is still walkable.
- **Not livelihood-aware:** People need to decide “Can I go to work?” “Can my children reach school?” not just “Is there a flood alert?”
- **Not hyperlocal or co-designed:** They rarely reflect how vulnerable families actually receive and share information (WhatsApp groups, word-of-mouth) at the gali/nukkad level.
- **Not resilient to low participation:** Crowdsourced-only systems fail when few people report; official systems fail when there’s no hyperlocal context.

As a result:
- Residents risk using unsafe routes or getting trapped by quickly rising water.
- Ward disaster management officers lack **lane-level** visibility of water-logging, blocked exits, and safe routes to prioritize pumps, boats, and relief.

There is a need for a **hyperlocal, lane-by-lane flood map** that combines **official risk data** with **crowdsourced, real-time reports**, and communicates simply via icons and regional languages, including via WhatsApp and SMS.

---

## 2. Solution Overview

**Nukkad Flood Map** is a lightweight web + mobile-friendly tool that:

- Shows a **color-coded, lane-level flood risk map** for a pilot city area (e.g., Nagpur’s Nag River basin).
- Builds a **baseline flood risk score** per street using:
  - Rainfall data from **IMD** (current and recent rainfall intensity)
  - Elevation and flood-prone zones from **Bhuvan/ISRO**
  - Street and drain layouts from **OpenStreetMap (OSM)**
- Updates this baseline in real-time with **crowdsourced water-level reports**:
  - Simple photo upload
  - Water-depth slider (e.g., ankle / knee / waist / chest / above-head)
  - Tags for blocked exits and dangerous spots
- Provides a **ward officer dashboard** on top of the same map to:
  - See worst-affected streets
  - Identify blocked exits
  - Plan pump/boat/relief deployment
- Sends **WhatsApp and SMS alerts in Hindi, Marathi, and other regional languages** to tell residents:
  - Current flood risk level for their specific lane
  - Nearby safe routes and shelters (if available)
- Uses **minimal text and intuitive icons**, so it can be:
  - Understood by low-literacy users
  - Projected on a wall in community centers
  - Shared as screenshots on WhatsApp

Hackathon scope: a **working prototype** for **one pilot area** (e.g., a few wards around Nag River, Nagpur) with sample/open data.

---

## 3. Target Users

### 3.1 Primary Users

1. **Community Volunteers in Flood-Prone Urban Settlements**
   - Roles: Local youth groups, NGOs, resident welfare committee members.
   - Needs:
     - Quick way to **report water levels and blocked exits**.
     - Simple visual map to **guide neighbors** to safer lanes/shelters.
     - Ability to share **screenshots and alerts via WhatsApp**.

2. **Ward Disaster Management Officers / Control Room Staff**
   - Roles: Ward-level municipal staff coordinating pumps, boats, traffic diversions, and shelters.
   - Needs:
     - **Lane-level, real-time view** of flooding severity.
     - **Prioritized list** of worst-hit streets/lanes.
     - Visibility of **blocked exits and accessible routes**.
     - Simple **dashboard** to support dispatch and decision-making.

### 3.2 Secondary Users

3. **Residents in Flood-Prone Lanes**
   - Many with basic phones or low data.
   - Needs:
     - Simple **risk indicator for their own lane** (safe / caution / danger).
     - **Safe route suggestions** to reach work, school, or shelters.
     - Information in **local language** (Hindi, Marathi, or regional).

---

## 4. Key Features

You must include **all** of these in the prototype (even if simplified):

1. **Crowdsourced Water Level Reporting**
   - Simple form for residents/volunteers to:
     - Upload a **photo** of the lane.
     - Use a **water-depth slider** with labeled levels (icons + words: dry / ankle / knee / waist / chest / above chest).
     - Optionally add: “**Exit blocked**” / “**Manhole open**” / “**Electric line hazard**” (as tappable icons).
   - Backend aggregates reports to calculate a **flood risk score per street segment**.

2. **Hyperlocal Flood Risk Map**
   - **Dynamic, color-coded map** at gali/nukkad level.
   - Each street segment colored by risk (e.g., green / yellow / orange / red / maroon).
   - Combines:
     - Baseline risk from **IMD + Bhuvan + OSM**.
     - Live risk from **crowdsourced reports**.
   - Updates automatically every few minutes.

3. **Multilingual Interface with Iconography**
   - UI that uses:
     - Big **icons** for:
       - Flood depth.
       - Safe/unsafe routes.
       - Blocked exit.
       - Shelter location.
     - Minimal text with **language toggle** (e.g., English, Hindi, Marathi).
   - Optimized for:
     - Use in low-literacy communities.
     - Projection in community centers.
     - Screenshots for WhatsApp sharing.

4. **Safe Route Suggestion**
   - Given a start point (user’s location or pinned lane) and a destination (e.g., work, main road, shelter), show:
     - **Safest currently known route** (avoiding high-risk/blocked segments).
     - Alternate route if primary path is risky.
   - Uses latest **street-level flood scores** from baseline + crowdsourced data.

5. **Community Volunteer Coordination**
   - Volunteers can:
     - **Tag blocked exits, dangerous areas, and shelters** on the map.
     - See **where reports are missing** (gray/unknown lanes) to know where to check.
   - Ward officers can:
     - Filter map to see **volunteer-tagged critical points**.

6. **WhatsApp Integration for Alerts**
   - Send **lane-level flood risk alerts** via:
     - **WhatsApp messages** (for smartphones).
     - **SMS** (for basic phones).
   - Alerts include:
     - Current **risk level** for the user’s lane.
     - Short line of text in **Hindi/Marathi/other**.
     - Simple **icons/emoji-like markers** for depth and risk.
     - Optional short link to the **map**.

*(For clarity in the build plan, we also explicitly include the ward officer dashboard and data fusion inside the sections below.)*

---

## 5. User Flow

### 5.1 Resident / Volunteer – Reporting Flood Levels

1. **Access**
   - Opens web app (PWA) via:
     - Shared link from WhatsApp group
     - QR code pasted in the community center
     - Bookmark on phone browser
   - Optional: Installs as PWA for quicker access.

2. **Home Screen**
   - Sees **map centered on local area** (Nag River pilot region).
   - Sees color-coded streets (green/yellow/orange/red).
   - Large button: **“Report Water Level”** (icon: water + exclamation).

3. **Report Form**
   - Step 1: Location
     - Option A: Auto-detect via GPS (with permission).
     - Option B: Tap on map to select street segment.
   - Step 2: Water Depth Slider (icons + minimal text):
     - Dry
     - Ankle
     - Knee
     - Waist
     - Chest
     - Above Chest
   - Step 3: Photo Upload (optional)
     - Choose from camera or gallery.
   - Step 4: Hazards (tappable icons):
     - Exit blocked
     - Open manhole
     - Electric hazard
     - Road collapse
   - Step 5: Submit
     - Sends data to backend API.
     - Client briefly shows “Thank you” screen and returns to map.

4. **Map Update**
   - On submission, frontend:
     - Updates local view with an overlaid marker.
   - Backend:
     - Aggregates this report into the **flood risk score** for that OSM street segment.
     - Triggers a recalculation of risk categories for affected segments.
   - Within ~30–60 seconds, user sees lane color change (if relevant).

---

### 5.2 Resident – Checking Risk and Safe Route

1. **Open Map**
   - User lands on map view.
   - If geolocation permitted: map centers on user’s current lane.

2. **See Risk for Current Lane**
   - Current lane highlighted.
   - Color-coded risk badge (e.g., red).
   - Simple icon + short phrase in selected language:
     - Example (Hindi): “आपकी गली: ऊँचा पानी (घुटनों से ऊपर)” / “High water (above knees).”

3. **Get Safe Route**
   - User taps **“Find Safe Route”** (icon: person walking + shield).
   - Chooses destination:
     - Predefined options:
       - Main road
       - Nearby shelter
       - Bus stand / station
     - Or pins a point on map.
   - System computes:
     - Shortest path **excluding**:
       - High-risk (red/maroon) segments.
       - Segments tagged as **blocked**.
   - Shows:
     - Route polyline on map (green).
     - Optional alternative in yellow.
     - Simple step summary:
       - “Follow green path. Avoid red lanes.”

4. **Share via WhatsApp**
   - Button: **“Share Map”** (icon: share).
   - Options:
     - Share **static screenshot**.
     - Share **short link** to a web view for that location + risk level.

---

### 5.3 Ward Officer – Dashboard & Coordination

1. **Login**
   - Officer opens a slightly different URL or taps “Officer Login.”
   - Simple auth (for prototype: hard-coded password or basic auth).

2. **Dashboard Map**
   - Same map as residents but with additional overlays:
     - Street segments aggregated by **risk**.
     - Hotspot markers for:
       - Clusters of high water depth reports.
       - Tagged blocked exits.
       - Shelters.

3. **Prioritization Panel**
   - Side panel showing:
     - Top N **worst-affected streets** (ranked by risk score + number of reports).
     - Count of **blocked exits** per ward.
     - Rainfall intensity indicator from IMD (ward-level).

4. **Filter & Layers**
   - Officer can toggle:
     - Layer: “High risk only.”
     - Layer: “Blocked exits.”
     - Layer: “Shelters and safe routes.”

5. **Action Support**
   - Officer uses map to:
     - Decide where to send **pumps, boats, or relief trucks**.
     - Identify **safe access routes** to each hotspot.
   - Optional: simple tag (for prototype):
     - “Pump sent” / “Team dispatched” on a street segment (for internal tracking).

---

### 5.4 WhatsApp & SMS Alert Flow

1. **User Registration for Alerts (Prototype Version)**
   - On resident map, a button: **“Get Alerts for My Gali”**.
   - Simple form:
     - Phone number
     - Lane selection (auto from GPS or manual on map)
     - Language choice (Hindi / Marathi / English).
   - Save to backend (e.g., `subscribers` table).

2. **Alert Trigger (Manual or Automated)**
   - For hackathon:
     - A backend script or simple admin UI where:
       - Organizer/officer selects:
         - A ward / lane or entire pilot area.
         - Risk threshold (e.g., send SMS/WhatsApp if lane is red or above).
         - Message type: “Warning / Update / All clear.”
     - Script:
       - Queries lanes with risk ≥ threshold.
       - Finds subscribers mapped to those lanes.

3. **Alert Content**
   - Example SMS (Hindi):
     - “Nukkad Flood Map: आपकी गली [Lane Name] में पानी का स्तर ‘घुटनों से ऊपर’ है (खतरा). कृपया इस रास्ते से न जाएँ. सुरक्षित रास्ता: [short description or map link].”
   - Example WhatsApp:
     - Same text +:
       - Risk-level emoji or icon.
       - Short map link to that lane’s view.

4. **Send Alerts**
   - Use WhatsApp Business API (or Twilio sandbox for hackathon) and SMS gateway.
   - Residents receive alert even on low data / basic phones.

---

## 6. Technical Approach

### 6.1 Overall Architecture

- **Frontend:** Web app (responsive, PWA-capable).
- **Backend:** RESTful API + simple data processing.
- **Data Storage:** Relational DB for reports, subscribers, lanes.
- **Map Engine:** Web mapping library with tiles and vector overlays.

Recommended stack (hackathon-friendly, but adaptable):

- Frontend:
  - **React** (Create React App or Vite) or simple **Next.js** app.
  - **Leaflet.js** or **Mapbox GL JS** for map rendering.
  - PWA support (service worker, manifest) if time permits.
- Backend:
  - **Node.js + Express** (or **Fastify**) or **Python + FastAPI**.
  - Simple ETL scripts for ingesting IMD/Bhuvan/OSM sample data.
- Database:
  - **PostgreSQL + PostGIS** (ideal for spatial queries and street segments).
  - If PostGIS is hard for hackathon, a simplified approach:
    - Store street segments as GeoJSON in a JSONB field and do mostly bounding box + ID-based queries.

---

### 6.2 Data Sources and Baseline Risk Model

#### 6.2.1 IMD Rainfall Data
- Use:
  - Historical + sample **real-time rainfall** for Nagpur region.
- For prototype:
  - Pre-download a CSV/JSON of time-series rainfall intensity for the pilot area.
  - Simulate “live” updates or just use fixed values.

#### 6.2.2 Bhuvan/ISRO Elevation & Flood-Prone Zones
- Data:
  - **DEM / elevation raster** for Nagpur area.
  - **Flood-prone zones** shapefile if available.
- For hackathon:
  - Subset to the target wards.
  - Compute:
    - Relative elevation of each OSM street segment.
    - Whether segment overlaps known flood-prone zones.

#### 6.2.3 OSM Streets and Drains
- Use Overpass API or pre-downloaded OSM data:
  - **Highways** (residential, tertiary, unclassified) for lanes/streets.
  - **Drainage** (drain, river, canal) features.
- Convert streets into **segments (edges)** with unique IDs.

#### 6.2.4 Baseline Risk Score per Street Segment

For each street segment `s`, compute:

- `R_baseline(s) = f(elevation, flood_zone, proximity_to_drain, historical_waterlogging)`

Example simplified formula:

- **Elevation risk (0–1):** lower elevation → higher risk.
- **Flood zone flag (0 or 1):** +0.3 if in official flood-prone zone.
- **Distance to drain/waterbody (0–1):** closer → higher risk.

Then combine with **IMD rainfall intensity**:

- `R_dynamic(s, t) = R_baseline(s) * g(rain_intensity_at_t)`
  - Where `g` scales risk up during heavy rain (e.g., linear or piecewise).

Normalize `R_dynamic` to 0–1 and map to colors:
- 0–0.2 → green
- 0.2–0.4 → yellow
- 0.4–0.6 → orange
- 0.6–0.8 → red
- 0.8–1 → maroon

---

### 6.3 Crowdsourced Report Integration

Each report `r` contains:

- `segment_id` (linked to OSM street segment)
- `timestamp`
- `depth_level` (0–5; dry to above chest)
- `photo_url` (optional)
- `hazards[]` (list of tags)
- `reporter_type` (resident/volunteer/unknown if not used)

Backend logic (simplified):

1. Convert depth to numeric weight, e.g.:
   - Dry = 0
   - Ankle = 1
   - Knee = 2
   - Waist = 3
   - Chest = 4
   - Above Chest = 5

2. For each segment, in a time window (e.g., last 60 minutes):
   - Compute weighted average depth: `D_avg(s)`.
   - Count number of reports `N(s)`.

3. Compute **crowdsourced risk component**:

   - `R_crowd(s) = min(1, (D_avg(s) / 5) * log(1 + N(s)))`

4. Combine with baseline:

   - `R_final(s) = clamp( α * R_dynamic(s, t) + (1 - α) * R_crowd(s) )`
   - Choose `α` ~ 0.5 (for hackathon; can tweak).

5. If **no reports**, `R_crowd(s) = 0`, so you still have `R_dynamic` from IMD/Bhuvan/OSM, ensuring map still works when few people report.

---

### 6.4 API Endpoints (Example)

- `POST /api/report`
  - Body: `{ segmentId, lat, lng, depthLevel, hazards[], photoBase64 or photoUrl }`
  - Action: Save, return success.

- `GET /api/segments`
  - Query: `?bbox=...`
  - Returns: GeoJSON of street segments with `risk_final`, `risk_color`, tags.

- `GET /api/segment/:id`
  - Returns details for a particular street segment: history of reports, final risk.

- `POST /api/subscribe`
  - Body: `{ phone, language, segmentId }`
  - Saves subscriber preferences.

- `POST /api/alerts/send` (for manual triggering during hackathon)
  - Body: `{ minRiskLevel, messageType }`
  - Finds segments meeting threshold, all subscribers, and dispatches SMS/WhatsApp.

- `GET /api/dashboard/summary`
  - Returns aggregated stats for officer dashboard:
    - Top N high-risk segments
    - Counts per ward
    - Blocked exits count, etc.

---

### 6.5 Frontend Implementation Notes

- **Map Rendering:**
  - Use **Leaflet** with an OSM tile layer (e.g., `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
  - Overlay:
    - Street segments as polylines with color based on `risk_color`.
    - Icons (markers) for:
      - Blocked exits
      - Shelters
  - Click/tap on a segment:
    - Shows a short popup: depth, color, latest update time.

- **Iconography:**
  - Use a consistent set of flood icons (custom SVG or open-source):
    - Depth: water level vs. human figure.
    - Blocked: barricade icon.
    - Shelter: house/temple/school icon.

- **Language Toggle:**
  - Use a simple translation JSON for UI texts.
  - Toggle buttons: “EN | HI | MR”.
  - For hackathon: translations for:
    - Depth labels
    - Buttons (Report, Safe Route, Alerts)
    - Simple risk messages.

- **Offline/Low Connectivity:**
  - For prototype: basic caching of tiles and minimal offline mode (optional if time).
  - Ensure the app still shows **last-known map** even if not fully live.

---

### 6.6 WhatsApp & SMS Integration (Prototype)

- Use a service like:
  - **Twilio** (both SMS and WhatsApp sandbox) or
  - Any available free SMS gateway for hackathon.
- Implement a simple **message template system**:
  - Input: `segmentRisk`, `laneName`, `language`, `safeRouteSummary`, `mapLink`.
  - Output: formatted text string.
- For route summary in alerts:
  - If computing real path is complex for SMS:
    - At minimum, include:
      - “Avoid: [street X]. Use: [street Y].”
    - Or rely on map link for detailed path.

---

### 6.7 Safe Route Computation

- Use **OSM street graph** (e.g., via `graphlib` or a simple adjacency list from DB).
- Assign **edge weights**:
  - Base weight = length of segment.
  - Add risk penalty:
    - `weight = length * (1 + β * R_final(s))`.
  - If `R_final(s)` >= “blocked threshold” or hazard flagged as “exit blocked”:
    - Set weight to very large or mark as non-traversable.
- Run **Dijkstra** or **A* search**:
  - Input: start + end nodes.
  - Output: path (list of segments).
- Encode path as:
  - Polyline for map.
  - Simple SMS/WhatsApp text summary if needed.

---

### 6.8 Ward Officer Dashboard

- Reuse primary map component, but:
  - Add **filters and summary side panel**.
  - Use authenticated route (simple password or token).
- Side panel displays:
  - Table:
    - Columns: Street Name, Ward, Current Risk, Last Update, #Reports, #Hazards.
  - Summary tiles:
    - “Red segments: X”
    - “Blocked exits: Y”
    - “Active rainfall index: Z”

---

## 7. Success Metrics

For the hackathon prototype, focus on **demonstrable** metrics:

### 7.1 Functional Metrics

1. **Coverage**
   - % of OSM street segments in pilot area with a **baseline risk score** (from IMD/Bhuvan/OSM).
   - Target: ≥ 80% of selected pilot ward network.

2. **Responsiveness**
   - Time from user submitting a report to:
     - Segment risk recalculation.
     - Map color update visible in UI.
   - Target: < 60 seconds under demo load.

3. **Routing Accuracy (Demo)**
   - For 3–5 predefined test scenarios:
     - Safe route suggestions **avoid simulated flooded/blocked segments**.
   - Confirm manually on-screen.

4. **Alert Delivery (Demo)**
   - % of test phone numbers that receive:
     - SMS and/or WhatsApp alert within a short delay (e.g., < 2 minutes).
   - Target: ≥ 90% of test subscribers.

### 7.2 User-Centered Metrics (Qualitative, Demo-Based)

5. **Low-Literacy Usability**
   - In a short usability test with peers/mentors:
     - % of users who can:
       - Correctly interpret the **color-coded map**.
       - Use icons to submit a **correct depth level**.
     - Target: Most users (e.g., ≥ 80% in tests) can do both without reading a long guide.

6. **Ward Officer Utility (Mock Feedback)**
   - Disaster management mentors or judges can:
     - Look at the **dashboard for 1–2 minutes** and:
       - Identify top 2–3 hotspots.
       - Decide where to send pumps/boats first.
   - Subjective scoring by judges.

7. **Community Sharing**
   - Ability to **generate a screenshot or sharable link** and send via WhatsApp during the demo.
   - Judges see how this would be used in real resident groups.

---

### Scope Notes (Hackathon Feasibility)

- Focus prototype on:
  - A **small but realistic area** (few wards near Nag River, Nagpur).
  - Preloaded **sample IMD & Bhuvan data** (static for demo).
  - **Simplified risk model**, easily adjustable constants.
- Must demonstrate:
  - **All confirmed Key Features**:
    - Crowdsourced Water Level Reporting
    - Hyperlocal Flood Risk Map
    - Multilingual Interface with Iconography
    - Safe Route Suggestion
    - Community Volunteer Coordination
    - WhatsApp Integration for Alerts
  - Plus:
    - Baseline risk from IMD/Bhuvan/OSM
    - Ward officer dashboard
    - WhatsApp/SMS alerts in Hindi/Marathi at minimum
- Leave hooks for:
  - Scaling to more wards/cities.
  - Integration with live IMD and municipal APIs in future.