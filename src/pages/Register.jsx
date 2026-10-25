import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateRegister } from '../utils/validators';

export default function Register() {
  const { user, register } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validateRegister(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      toast.success('Account created. Welcome to PhishGuard AI.');
    } catch (ex) {
      setApiError(ex.message);
      setLoading(false);
    }
  };

  const Field = ({ id, label, type = 'text', k, auto, placeholder }) => (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} type={type} autoComplete={auto} placeholder={placeholder} className={`input ${errors[k] ? 'input-error' : ''}`} value={form[k]} onChange={set(k)} />
      {errors[k] && <p role="alert" className="mt-1.5 text-xs text-red-500">{errors[k]}</p>}
    </div>
  );

  return (
    <AuthShell title="Create your account" subtitle="Start analyzing URLs and emails in a minute.">
      <form onSubmit={submit} noValidate className="space-y-4">
        {apiError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500"><AlertCircle size={16} className="mt-0.5 shrink-0" />{apiError}</div>}
        {Field({ id: 'name', label: 'Full Name', k: 'name', auto: 'name', placeholder: 'Your full name' })}
        {Field({ id: 'email', label: 'Email', type: 'email', k: 'email', auto: 'email', placeholder: 'you@example.com' })}
        <div>
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <input id="password" type={show ? 'text' : 'password'} autoComplete="new-password" placeholder="At least 8 characters" className={`input !pr-11 ${errors.password ? 'input-error' : ''}`} value={form.password} onChange={set('password')} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted hover:text-fg">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
          {errors.password && <p role="alert" className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
        </div>
        {Field({ id: 'confirm', label: 'Confirm Password', type: show ? 'text' : 'password', k: 'confirm', auto: 'new-password', placeholder: 'Repeat your password' })}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">{loading ? <><Loader2 size={16} className="animate-spin" />Creating account…</> : 'Create Account'}</button>
        <p className="text-center text-sm text-muted">Already registered? <Link to="/login" className="font-semibold text-brand-400 hover:underline">Login</Link></p>
      </form>
    </AuthShell>
  );
}
