import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/PageHeader';
import Toggle from '../components/Toggle';

export default function Settings() {
  const { settings, update } = useSettings();
  const toast = useToast();
  const change = (k, label) => (v) => { update({ [k]: v }); toast.success(`${label} ${v ? 'on' : 'off'}`); };
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" description="Preferences are saved in this browser only." />
      <div className="card divide-y divide-line px-6 py-2">
        <Toggle label="Dark Mode" description="Switch between the dark navy and light themes." checked={settings.darkMode} onChange={change('darkMode', 'Dark mode')} />
        <Toggle label="Notifications" description="Show in-app notifications for flagged scans." checked={settings.notifications} onChange={change('notifications', 'Notifications')} />
        <Toggle label="Email Alerts" description="Email me when a high-risk scan is found. Not active until the backend supports it." checked={settings.emailAlerts} onChange={change('emailAlerts', 'Email alerts')} />
      </div>
    </div>
  );
}
