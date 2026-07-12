# SentinelAI — UEBA SaaS Frontend

Dark-themed React frontend for a User & Entity Behavior Analytics (UEBA) SaaS
platform: upload activity logs, run them through a detection pipeline, and
surface per-identity risk scores, anomalies, alerts, and reports.

Built to match the use case diagram: **Company Admin** (register company,
manage users, upload logs, configure settings, view dashboard, generate
reports) and **Security Analyst** (view dashboard, view anomalies,
investigate high-risk users, generate reports) get separate, role-aware
sidebar navigation from the same codebase.

## Tech stack
- React 18 + Vite
- Tailwind CSS
- Recharts (all charts)
- React Router v6
- Axios (pre-wired client in `src/api/axiosClient.js`, ready for your ML backend)
- lucide-react icons

## Getting started

```bash
cd sentinel-ai
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

## Demo login

The app runs on mock data (`src/data/mockData.js`) with a fake auth layer
(`src/context/AuthContext.jsx`) so you can click through the whole product
before the backend exists.

| Role             | Email                    | Password      |
|------------------|---------------------------|---------------|
| Company Admin    | admin@sentinelai.io       | sentinel123   |
| Security Analyst | analyst@sentinelai.io     | sentinel123   |

## Project structure

```
src/
  api/axiosClient.js       # configured axios instance, swap baseURL for your backend
  context/AuthContext.jsx  # mock auth/session state — replace with real API calls
  components/              # shared UI: Sidebar, Topbar, Layout, RiskGauge, StatCard...
  pages/                   # one file per screen (see below)
  data/mockData.js         # all mock data — replace with API responses
  routes/ProtectedRoute.jsx
```

### Pages (one file each, matches the brief)

| File | Route | Use case |
|---|---|---|
| `pages/Login.jsx` | `/login` | Login |
| `pages/Register.jsx` | `/register` | Register Company |
| `pages/Dashboard.jsx` | `/dashboard` | View Dashboard |
| `pages/UploadLogs.jsx` | `/upload` | Upload Activity Logs (+ pipeline visualization) |
| `pages/RiskAnalysis.jsx` | `/risk-analysis` | Calculate Risk Score (list + filters) |
| `pages/InvestigateUser.jsx` | `/risk-analysis/:userId` | Investigate High-Risk Users |
| `pages/Anomalies.jsx` | `/anomalies` | Detect Anomalies / View Anomalies |
| `pages/Alerts.jsx` | `/alerts` | Generate Alerts |
| `pages/Reports.jsx` | `/reports` | Generate Reports |
| `pages/Users.jsx` | `/users` | Manage Users (admin only) |
| `pages/Settings.jsx` | `/settings` | Configure Settings (admin only) |

## Connecting your real ML backend

Every page that touches mock data has a comment showing the exact axios call
to swap in, e.g. in `UploadLogs.jsx`:

```js
// const formData = new FormData()
// files.forEach(f => formData.append('logs', f))
// await axiosClient.post('/logs/upload', formData)
```

Set `VITE_API_BASE_URL` in a `.env` file to point `axiosClient` at your
FastAPI/Flask backend:

```
VITE_API_BASE_URL=https://your-backend.example.com/api
```

## Design notes

- Palette: deep graphite-navy background (`#0A0E13`) rather than pure black,
  with a teal-cyan "signal" accent (`#33D6C0`) for healthy/normal states and
  a red→amber risk scale for severity — reinforces the idea of monitoring a
  live signal for deviations.
- Typography: Space Grotesk for headings, Inter for body text, JetBrains Mono
  for scores, IDs, and timestamps (reads like real telemetry).
- Signature elements: the animated waveform (`SignalWave.jsx`) on the auth
  screens, and the radial "risk dial" (`RiskGauge.jsx`) reused across the
  dashboard, risk analysis table, and investigation page so a risk score
  always looks the same wherever you see it.
