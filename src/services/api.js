import axios from 'axios';
import { normalizeScan } from '../utils/analysisUtils.js';
import { buildAnalytics } from '../utils/stats.js';

export const API_BASE_URL = 'http://localhost:8000';

// Change these paths to match your FastAPI routes.
export const ENDPOINTS = {
  analyzeUrl: '/api/analyze/url',     // POST { url }                              -> { score, prediction?, confidence?, indicators? }
  analyzeEmail: '/api/analyze/email', // POST { sender, receiver, subject, body }  -> same shape
  history: '/api/scans',              // GET                                       -> [ { id, type, input, score, ... } ]
  login: '/api/auth/login',           // POST { email, password }                  -> { token, user: { name, email, role } }
  register: '/api/auth/register',     // POST { name, email, password }            -> { token, user }
};

// Until the backend has login routes, sign-in is kept in this browser only (no accounts, no fake data).
// Set VITE_LOCAL_LOGIN=false in .env to use the backend login routes instead.
const LOCAL_LOGIN = import.meta.env.VITE_LOCAL_LOGIN !== 'false';

const http = axios.create({ baseURL: API_BASE_URL, timeout: 30000 });
http.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('pg_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Expired or invalid login: clear the session and go back to the login page.
http.interceptors.response.use((r) => r, (e) => {
  if (e.response?.status === 401 && localStorage.getItem('pg_token') && !e.config.url.includes('/auth/')) {
    localStorage.removeItem('pg_token'); localStorage.removeItem('pg_user');
    window.location.assign('/login');
  }
  return Promise.reject(e);
});

const call = async (fn) => {
  try {
    return await fn();
  } catch (e) {
    if (!e.response) throw new Error(`Cannot reach the backend at ${API_BASE_URL}. Start the server and try again.`);
    const detail = e.response.data?.detail;
    throw new Error(typeof detail === 'string' ? detail : 'Check the details you entered and try again.');
  }
};

export const analyzeURL = (url) =>
  call(async () => normalizeScan({ type: 'URL', input: url, ...(await http.post(ENDPOINTS.analyzeUrl, { url })).data }));

export const analyzeEmail = (emailData) =>
  call(async () => normalizeScan({ type: 'EMAIL', input: emailData.subject || emailData.sender, ...(await http.post(ENDPOINTS.analyzeEmail, emailData)).data }));

export const getScanHistory = () =>
  call(async () => (await http.get(ENDPOINTS.history)).data.map(normalizeScan));

export const getAnalytics = async () => buildAnalytics(await getScanHistory());

const localUser = (name, email) => ({
  token: 'local-session',
  user: { name, email, role: email.toLowerCase().includes('admin') ? 'Admin' : 'User' }, // "admin" in the email opens /admin
});

export const login = ({ email, password }) =>
  LOCAL_LOGIN
    ? Promise.resolve(localUser(email.split('@')[0], email))
    : call(async () => (await http.post(ENDPOINTS.login, { email, password })).data);

export const register = ({ name, email, password }) =>
  LOCAL_LOGIN
    ? Promise.resolve(localUser(name, email))
    : call(async () => (await http.post(ENDPOINTS.register, { name, email, password })).data);
