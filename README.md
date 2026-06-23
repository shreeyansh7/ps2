# PolicySim — Economic Policy Simulation Platform

An interactive full-stack platform where users adjust real policy levers — tax rates, education spending, infrastructure investment — and see 5-year economic projections for GDP, unemployment, inflation, public debt, poverty, and inequality.

Dashboard

<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/191bef8a-91c7-46f0-b240-4cbb4cab8fbe" />


## Features

- **Live Policy Simulation** — 8 adjustable sliders, sub-400ms response time
- **5-Year Time-Lag Modelling** — realistic delayed effects (education impacts GDP after 3-5 years, infrastructure creates jobs immediately)
- **5 Real Country Presets** — India, USA, Sweden, Singapore, Brazil, calibrated from IMF/World Bank data
- **Scenario Save & Compare** — save simulations, compare two side-by-side with delta indicators
- **Sensitivity Analysis** — ranked partial-derivative view of which policy levers matter most
- **AI Policy Advisor** — rule-based recommendations with causal chain explanations
- **JWT Authentication** — secure login with auto-refreshing tokens
- **Shareable Results** — URL-encoded simulation state, no login required to view

## Tech Stack

**Frontend:** React 18, Recharts, Zustand, React Router v6, Axios  
**Backend:** Flask, Flask-JWT-Extended, PyMongo, bcrypt  
**Database:** MongoDB Atlas

## Screenshots

| Dashboard | Country Presets |
|---|---|
| <img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/76f7262f-f51c-42ca-a39f-883159bb5933" />


| History | Compare |
|---|---|
| ![History] <img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/caff78be-9b0a-441e-beb9-fc0e110afb7c" />
 | ![Compare] <img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/6815ead0-8842-48af-981c-80bbd9d88c6d" />
|

## Architecture

Three-tier: React frontend → Flask REST API → MongoDB Atlas

The simulation engine uses a weighted reduced-form model with empirically-calibrated weights (see formula sources in `/docs`). Time-lag multipliers ensure policies show realistic delayed effects across a 5-year projection window.

## Running Locally

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# create .env with SECRET_KEY, JWT_SECRET_KEY, MONGO_URI
python app.py

# Frontend
cd frontend
npm install
npm start
```

## License

MIT
