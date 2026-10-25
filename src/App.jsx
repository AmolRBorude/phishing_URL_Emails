import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import URLAnalysis from './pages/URLAnalysis';
import EmailAnalysis from './pages/EmailAnalysis';
import Result from './pages/Result';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/url-analysis" element={<URLAnalysis />} />
          <Route path="/email-analysis" element={<EmailAnalysis />} />
          <Route path="/result" element={<Result />} />
          <Route path="/history" element={<History />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
