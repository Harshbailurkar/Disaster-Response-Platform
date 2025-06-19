# Disaster-Response-Platform

# 🔧 Disaster Response Platform – Backend

This is the **backend** for the Disaster Response Platform – a real-time coordination system for managing disaster events, user reports, live updates, and geospatial intelligence.

It powers the core APIs, real-time WebSocket streams, and handles integrations like Gemini (for location extraction), Mapbox (for geocoding), and social media monitoring.

---

## ✅ Functionality Overview

| Feature                         | Description                                                                 |
|----------------------------------|-----------------------------------------------------------------------------|
| **Disaster APIs**                | Create, update, delete disasters with metadata (title, description, tags)  |
| **Report Management**            | Citizens can submit reports with optional images and text                  |
| **Official Updates API**         | Add and fetch government/NGO official resource links                       |
| **Social Media Integration**     | Fetch simulated Twitter/Bluesky-style data for disaster topics             |
| **WebSocket Support**            | Broadcasts live updates for social feed, reports, and disaster changes     |
| **Geospatial Filtering**         | Uses location name → coordinates → indexable storage (via Supabase)        |
| **Caching & Rate Limiting**     | Optional Supabase edge functions or memory-based caching suggested         |

---

## 🛠️ Technologies Used

| Component            | Tech                          |
|----------------------|-------------------------------|
| Server Framework     | Express.js                    |
| Realtime Layer       | Socket.IO                     |
| Database             | Supabase (PostgreSQL)         |
| ORM / Queries        | Supabase client               |
| Caching (optional)   | Supabase cache or in-memory   |
| Geolocation API      | Mapbox or OpenStreetMap       |
| NLP Extraction       | Google Gemini API             |
| Social Feed          | Mock Twitter API / local data |

---

## 🧪 API Endpoints Summary

### 🔸 Disasters

GET /disasters
GET /disasters?tag=flood
POST /disasters
PUT /disasters/:id
DELETE /disasters/:id


### 🔸 Reports
POST /reports/:disaster_id/reports
GET /reports/:disaster_id/reports
DELETE /reports/:report_id


### 🔸 Official Updates
GET /disasters/:id/official-updates
POST /disasters/:id/official-updates


### 🔸 Social Media (Mock)
GET /disasters/:id/social-media


---

## 🌐 WebSocket Events (Socket.IO)

| Event Name            | Payload                          | Triggered When                           |
|-----------------------|----------------------------------|-------------------------------------------|
| `disaster_added`      | —                                | On new disaster creation                 |
| `disaster_updated`    | —                                | On update                                |
| `disaster_deleted`    | —                                | On delete                                |
| `report_submitted`    | `{ disaster_id, ... }`           | On new report                            |
| `social_media_updated`| `{ disaster_id, posts[] }`       | When new social media fetched            |

---

## 📍 Geospatial Implementation

- Each disaster has a `location_name` → converted to coordinates using **Mapbox Geocoding API**
- Stored as a `point` in Supabase with `PostGIS`
- Allows for future **radius-based filtering** like:


---

## 🔒 Authentication & Access (Optional)

- Currently using static `owner_id` placeholder (`test-user-001`)
- Can be extended with:
- Supabase Auth / JWT tokens
- Admin vs Citizen roles
- OTP verification using Twilio or Firebase

---

---

## 🧠 Notable Logic

- **Gemini Integration**: Processes unstructured text (e.g., tweet) to extract likely location → then maps it.
- **Socket Feed Refresh**: Pushes live social media data to connected clients on new data detection.
- **Modular Controller Design**: APIs are separated by purpose for clarity and testability.
- **Scalability**: Structured for cloud functions or container-based deployment (e.g., Supabase Edge, Render).

---

## 🚀 How to Run Locally

1. **Install Dependencies**
   ```bash
   npm install

2. Set Env Variables (in .env)
   PORT=5000
SUPABASE_URL=...
SUPABASE_KEY=...
MAPBOX_API_KEY=...
GEMINI_API_KEY=...

3. node index.js


