# PhishGuard AI (frontend)

React + Vite + Tailwind frontend. Two modules only: URL (CNN + BiLSTM) and Email (LLM / Transformer).

    npm install
    npm run dev        # http://localhost:5173

## No dummy data
The app contains no sample scans, charts or numbers. Every result, table and chart is built from what the backend returns.
Until the backend is running, the pages show empty states and analysis shows a "Cannot reach the backend" message.

## Connect FastAPI
1. Set the address and routes in `src/services/api.js` (`API_BASE_URL`, `ENDPOINTS`).
2. Allow CORS for http://localhost:5173 in FastAPI.
3. The backend needs two routes: `POST` analyze (URL / email) and `GET /api/scans`. The dashboard, analytics and admin pages are calculated from that scan list (`src/utils/stats.js`).
4. Analyze response: `{ score, prediction?, confidence?, indicators? }`. Risk level is derived from `score` in `src/utils/riskUtils.js`.

## Login
With the backend running, set `VITE_LOCAL_LOGIN=false` in `.env` (copy `.env.example`) and restart `npm run dev`. Accounts are then stored in MongoDB.

Without that, sign-in is local to your browser (no accounts). Put "admin" in the email to open `/admin`. Set `VITE_LOCAL_LOGIN=false` to use the backend login routes.
