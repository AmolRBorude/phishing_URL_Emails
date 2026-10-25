import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateLogin } from '../utils/validators';

export default function Login() {
  const { user, login } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validateLogin(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back. You are signed in.');
    } catch (ex) {
      setApiError(ex.message);
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Sign in to PhishGuard AI" subtitle="Enter your email and password.">
      <form onSubmit={submit} noValidate className="space-y-5">
        {apiError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500"><AlertCircle size={16} className="mt-0.5 shrink-0" />{apiError}</div>}
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" autoComplete="email" className={`input ${errors.email ? 'input-error' : ''}`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          {errors.email && <p role="alert" className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="label !mb-1.5">Password</label>
            <button type="button" onClick={() => toast.info('Password reset is not available yet.')} className="text-xs font-medium text-brand-400 hover:underline">Forgot Password?</button>
          </div>
          <div className="relative">
            <input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" className={`input !pr-11 ${errors.password ? 'input-error' : ''}`} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your password" />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted hover:text-fg">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
          {errors.password && <p role="alert" className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full">{loading ? <><Loader2 size={16} className="animate-spin" />Signing in…</> : 'Login'}</button>
        <p className="text-center text-sm text-muted">New here? <Link to="/register" className="font-semibold text-brand-400 hover:underline">Create Account</Link></p>
      </form>
    </AuthShell>
  );
}
