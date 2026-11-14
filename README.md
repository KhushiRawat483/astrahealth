# ASTRAHEALTH — Space Crew Health Intelligence System
### NASA Space Apps Challenge 2026 Prototype

**ASTRAHEALTH** is a futuristic, full-stack medical intelligence platform designed specifically for astronauts on long-duration space missions, including International Space Station (ISS) expeditions and future Lunar Gateway / Mars transit missions.

The application serves as an onboard command-center dashboard to monitor physical health, track microgravity-induced bone mineral loss and skeletal muscle atrophy, monitor cumulative cosmic radiation dosimetry, evaluate rule-based health observations, and coordinate preventive countermeasure protocols with the onboard Crew Medical Officer (CMO) and NASA Flight Surgeons on Earth.

---

## 🌟 Key Application Features

### 1. Mission Overview Dashboard
- **Commander Greeting & Live Bio-Telemetry:** Real-time mission ticker (Day 76 of 180 on Expedition AURORA-1).
- **Four Major Health Telemetry Cards:**
  1. **Bone Density:** Measured change relative to baseline (`-1.81%`, Bone Health Index `84/100`).
  2. **Muscle Strength:** Neuromuscular retention (`92.2%` index, ARED squat force `2.26 kN`).
  3. **Radiation Exposure:** Cumulative mission dose in mGy (`42.60 mGy`, daily rate `0.53 mGy/day`).
  4. **Overall Health Status:** Prototype risk indicator (`MODERATE RISK`, Readiness Score `86/100`).
- **Interactive Multi-Metric Recharts Visualizations:**
  - 7-Day Weekly Physiological Telemetry Trend (Bone Score, Muscle Score, Readiness).
  - Cumulative space radiation influx across mission checkpoints.
- **Active Medical Directives & Daily Checklist:** Interactive checkboxes that synchronize directly with the SQLite database.

### 2. Bone & Muscle Health Monitoring
- **Bone Loss & Spinal Decompression:** Tracks volumetric bone mineral density (DEXA), spinal axial elongation (`+4.2 cm`), and calcaneus heel quantitative ultrasound speed of sound (`1538 m/s`).
- **ARED Workout Telemetry:** Records peak concentric force (kN), repetitions, and resistance load (kg) across squats, deadlifts, and heel raises.
- **Interactive Anatomical SVG Visualizations:**
  - **Skeletal Weight-Bearing Mapping:** Clickable human skeleton highlighting the Femoral Neck, Lumbar Spine (L1–L4), Calcaneus Heel, and Tibial Shaft with instant biomechanical tooltips.
  - **Muscular System & ARED Telemetry:** Clickable anatomical musculature highlighting Quadriceps, Hamstrings, Calves (Soleus), and Erector Spinae with target exercise protocols.
- **Log New Measurement Modal:** Enter real measurements via a validated form, save them directly to the FastAPI backend, and see charts update in real-time.

### 3. Space Radiation & Solar Weather Dosimetry
- **Cosmic Dosimetry Tracking:** Crew Personal Dosimeter (CPD) and active Time-Resolved Dosimeter (TRD) records.
- **Solar Flare & Coronal Mass Ejection Monitoring:** Solar Cycle 25 activity, solar flare index (B4.1 background), and Solar Particle Event (SPE) alert feeds.
- **Spacecraft Radiation Shielding Architecture:** Cross-sectional SVG diagram of the AURORA-1 Deep Space Habitat illustrating the Command Deck (34% attenuation), Crew Sleep Bunks (68% attenuation), Columbus Science Lab, Cupola, and the **Central Storm Shelter with Hydrogen-Rich Water Walls (88% attenuation)**.
- **Simulate SPE Solar Storm Feature:** Interactive emergency alert banner with emergency checklist and the ability to inject simulated radiation spikes into the database.

### 4. AI-Assisted Health Insights (Prototype Rules Engine)
- **Rule-Based Physiological Intelligence:** Powered by a Python rules engine evaluating bone resorption rates, ARED resistance volume adherence, and radiation accumulation against mission milestones.
- **Anomaly Detection & Observations:** Highlights femoral trabecular resorption velocity, paraspinal disc hyper-hydration, and GCR flux projections.
- **Clinical & Scientific Context:** Explains the space medicine rationale (e.g., RANKL osteoclast signaling, Type-I slow-twitch myofibrillar degradation).

### 5. Preventive Care & Mission Countermeasures
- **Categorized Directives:**
  1. *Bone Health:* High-load axial ARED squats, Vitamin D3 & bioavailable Calcium Citrate supplementation, and bi-weekly ultrasound scans.
  2. *Muscle Health:* Mandatory 2.5-hour countermeasure blocks, high-protein intake (>1.4 g/kg), and eccentric overload.
  3. *Radiation Protection:* Storm shelter procedures, water wall pressurization, and dosimeter sync.
  4. *Daily Wellness:* Circadian sleep schedules, hydration tracking (2.8 L/day), and pre-sleep spinal flexion.
- **Interactive Completion:** Clickable compliance toggles with live progress calculation.

### 6. Health Reports & Downloadable PDF
- **Downloadable Vector PDF Report:** Powered by Python's **ReportLab** engine generating high-resolution, beautifully styled space-medical reports (`/api/reports/pdf`) with complete telemetry tables, clinical assessments, and Flight Surgeon sign-off blocks.
- **Printable Dossier View:** Print or export complete mission health archives.

### 7. Astronaut Profile
- Full medical dossier for **Commander Alex Morgan (AST-2026-X88)**.
- Pre-flight physiological baselines (BMD T-Score +0.20, RHR 54 bpm, VO2 Max 52.4 ml/kg/min).
- Emergency medical contacts for Lead Flight Surgeon **Dr. Sarah Vance, MD** (NASA JSC Houston) and Crew Medical Officer **Dr. Elena Rostov, MD**.

### 8. Three-Level Alert System
- **GREEN (Normal):** Indicators within nominal spaceflight tolerances.
- **YELLOW (Attention):** Mild deconditioning trends or heightened monitoring required.
- **RED (Critical):** Immediate action required (e.g., SPE solar particle shelter relocation).
- Interactive navigation bell with notification count, acknowledgment, and resolution workflows.

---

## 💻 Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS (Dark futuristic command center palette: `#071426`, `#0B1C32`, `#10243D`, `#27D9E8`)
- **Visualizations:** Recharts (Interactive Area, Line, and Bar Charts)
- **Icons:** Lucide React
- **Animations:** Framer Motion & CSS custom keyframes
- **Routing:** React Router DOM v7

### Backend & Database
- **API Framework:** Python 3.13 + FastAPI
- **Database:** SQLite via SQLAlchemy ORM
- **Validation:** Pydantic v2
- **Document Generation:** ReportLab (Vector PDF generation)
- **Web Server:** Uvicorn

---

## 👥 Team Contributions (NASA Space Apps Challenge 2026)

- **Mai & Cosmo** — *Code and UI Development*  
  Full-stack architecture, React dashboard components, FastAPI REST endpoints, database schemas, and interactive SVG diagrams.
- **Loaf** — *Design and Storytelling*  
  Futuristic mission control aesthetics, dark navy UI palette, visual identity, and user experience narrative.
- **Moo** — *Scientific Research and Data Accuracy*  
  Space medicine biomechanics, ARED force calibration, radiation dosimetry units (mGy/µGy), and NASA clinical standards (NASA-STD-3001).

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1-Click Launch (Unified Mode)
The application can be run directly using the Python unified runner:

```bash
# In the project root directory:
python run_app.py
```
This automatically boots the FastAPI backend (with SQLite database auto-initialization and seeding), mounts the production React frontend, and opens `http://localhost:8000` in your default browser.

### Alternative: Dual Development Mode

#### Terminal 1 — Backend:
```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

#### Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` to view the development frontend with instant hot module replacement (HMR).

---

## 📁 Project Structure

```
astrahealth/
├── backend/
│   ├── main.py              # FastAPI application, REST endpoints, and SPA serving
│   ├── database.py          # SQLAlchemy SQLite connection engine
│   ├── models.py            # Database models (Astronaut, Bone, Muscle, Radiation, Alerts)
│   ├── schemas.py           # Pydantic data schemas
│   ├── seed_data.py         # Realistic simulated space mission seed data
│   ├── rules_engine.py      # AI-assisted prototype insight rule engine
│   ├── pdf_generator.py     # ReportLab vector PDF generator
│   └── requirements.txt     # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── SkeletonDiagram.tsx       # Anatomical skeleton SVG
│   │   │   ├── MuscularDiagram.tsx       # Muscular system SVG
│   │   │   ├── SpacecraftShieldingDiagram.tsx # Deep space habitat SVG
│   │   │   ├── LogMeasurementModal.tsx   # Interactive measurement input
│   │   │   ├── SimulatedSolarStormAlert.tsx # SPE emergency flare banner
│   │   │   └── AboutProjectModal.tsx     # Space Apps credits
│   │   ├── pages/           # Application views
│   │   │   ├── Login.tsx                 # Astronaut biometric access
│   │   │   ├── Dashboard.tsx             # Mission overview
│   │   │   ├── BoneMuscleHealth.tsx      # Bone & muscle telemetry
│   │   │   ├── RadiationMonitoring.tsx   # Space radiation module
│   │   │   ├── AIHealthInsights.tsx      # Rule-based AI insights
│   │   │   ├── PreventiveCare.tsx        # Countermeasure directives
│   │   │   ├── HealthReports.tsx         # Reports & PDF download
│   │   │   └── AstronautProfile.tsx      # Commander dossier
│   │   ├── api.ts           # Frontend API client
│   │   ├── types.ts         # TypeScript interfaces
│   │   ├── App.tsx          # Router configuration
│   │   └── main.tsx         # React root
│   ├── tailwind.config.js   # Custom space medical palette
│   └── vite.config.ts       # Vite bundler & API proxy configuration
├── run_app.py               # 1-Click launcher
├── start.bat                # Windows command launcher
├── start.ps1                # PowerShell launcher
└── README.md                # Comprehensive project documentation
```

---

## 🛡️ Medical & Data Disclaimer

*All astronaut profiles, physiological measurements, radiation readings, and solar flare events presented in AstraHealth are **believable simulated data** created for the NASA Space Apps Challenge 2026 prototype demonstration. The platform demonstrates principles of spaceflight health monitoring and does not connect to actual NASA flight hardware, astronauts' personal medical records, or diagnostic medical devices.*
