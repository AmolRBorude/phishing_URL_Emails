import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { isValidEmail } from '../utils/validators';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [p, setP] = useState({ name: user.name, email: user.email });
  const [pe, setPe] = useState({});
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwe, setPwe] = useState({});
  const [confirm, setConfirm] = useState(false);

  const saveProfile = (e) => {
    e.preventDefault();
    const er = {};
    if (!p.name.trim()) er.name = 'Name is required.';
    if (!isValidEmail(p.email)) er.email = 'Enter a valid email address.';
    setPe(er);
    if (Object.keys(er).length) return;
    updateUser({ name: p.name.trim(), email: p.email.trim() });
    toast.success('Profile saved');
  };

  const changePw = (e) => {
    e.preventDefault();
    const er = {};
    if (!pw.current) er.current = 'Enter your current password.';
    if (pw.next.length < 8) er.next = 'Use at least 8 characters.';
    if (pw.confirm !== pw.next) er.confirm = 'Passwords do not match.';
    setPwe(er);
    if (Object.keys(er).length) return;
    setPw({ current: '', next: '', confirm: '' });
    toast.info('Password change needs the backend login routes. Nothing was changed.');
  };

  const E = ({ m }) => (m ? <p role="alert" className="mt-1.5 text-xs text-red-500">{m}</p> : null);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Profile" description="Your account details." />
      <form onSubmit={saveProfile} noValidate className="card space-y-4 p-6">
        <div><label htmlFor="pn" className="label">Name</label><input id="pn" className={`input ${pe.name ? 'input-error' : ''}`} value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} /><E m={pe.name} /></div>
        <div><label htmlFor="pe" className="label">Email</label><input id="pe" type="email" className={`input ${pe.email ? 'input-error' : ''}`} value={p.email} onChange={(e) => setP({ ...p, email: e.target.value })} /><E m={pe.email} /></div>
        <div><label htmlFor="pr" className="label">Role</label><input id="pr" className="input opacity-70" value={user.role} readOnly /></div>
        <button className="btn btn-primary" type="submit">Save changes</button>
      </form>

      <form onSubmit={changePw} noValidate className="card mt-6 space-y-4 p-6">
        <h2 className="font-semibold">Security</h2>
        <div><label htmlFor="cp" className="label">Current password</label><input id="cp" type="password" autoComplete="current-password" className={`input ${pwe.current ? 'input-error' : ''}`} value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /><E m={pwe.current} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="np" className="label">New password</label><input id="np" type="password" autoComplete="new-password" className={`input ${pwe.next ? 'input-error' : ''}`} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /><E m={pwe.next} /></div>
          <div><label htmlFor="cf" className="label">Confirm new password</label><input id="cf" type="password" autoComplete="new-password" className={`input ${pwe.confirm ? 'input-error' : ''}`} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} /><E m={pwe.confirm} /></div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary" type="submit">Change Password</button>
          <button className="btn btn-ghost" type="button" onClick={() => setConfirm(true)}><LogOut size={16} />Logout</button>
        </div>
      </form>
      <ConfirmDialog open={confirm} title="Log out?" message="You will need to sign in again to run new scans." confirmLabel="Log out" onCancel={() => setConfirm(false)} onConfirm={() => { logout(); toast.info('You have been logged out.'); navigate('/login'); }} />
    </div>
  );
}
