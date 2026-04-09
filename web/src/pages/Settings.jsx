// pages/Settings.jsx
// ─────────────────────────────────────────────────────────────────────────────
// User object at top is placeholder. Replace with:
// useEffect(() => { fetch('/api/me').then(...).then(setUser) }, [])
// Notification prefs: GET /api/me/notifications  PUT /api/me/notifications
// Password update:    POST /api/me/password
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { BtnPrimary, BtnSecondary, MonoLabel } from '../components/ui';
import { CheckCircle, AlertTriangle, Mail, Bell, Calendar, Shield, Trash2 } from 'lucide-react';

// ── Placeholder data (replace with API) ──────────────────────────────────────

const PLACEHOLDER_USER = {
  firstName: 'John',
  lastName:  'Doe',
  email:     'john.doe@company.com',
  role:      'Compliance Admin',
  org:       'Acme Enterprises',
};

const PLACEHOLDER_NOTIFICATIONS = {
  emailAlerts:           true,
  complianceReminders:   true,
  filingDeadlineAlerts:  false,
};

// ── Shared styles (mirrors Dashboard) ────────────────────────────────────────

const panel = {
  border: '1px solid #e5e5e5',
  borderRadius: 10,
  background: '#fff',
  overflow: 'hidden',
};

const sectionHeader = {
  padding: '18px 24px',
  borderBottom: '1px solid #f0f0f0',
  background: '#fafafa',
};

const sectionBody = {
  padding: 24,
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <p style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 10, fontWeight: 500,
      color: '#0a0a0a', letterSpacing: '0.1em',
      textTransform: 'uppercase',
      margin: 0,
    }}>
      {children}
    </p>
  );
}

function SectionSubtitle({ children }) {
  return (
    <p style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 15, fontWeight: 600,
      color: '#0a0a0a', letterSpacing: '-0.01em',
      margin: '6px 0 0',
    }}>
      {children}
    </p>
  );
}

function FieldLabel({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} style={{
      display: 'block',
      fontFamily: "'DM Mono', monospace",
      fontSize: 10, fontWeight: 500,
      color: '#737373', letterSpacing: '0.08em',
      textTransform: 'uppercase', marginBottom: 8,
    }}>
      {children}
    </label>
  );
}

function Input({ id, type = 'text', defaultValue, value, onChange, placeholder, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id}
      type={type}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13, color: disabled ? '#a3a3a3' : '#0a0a0a',
        padding: '10px 13px',
        border: `1px solid ${focused ? '#059669' : '#e5e5e5'}`,
        borderRadius: 6,
        background: focused ? '#fff' : '#fafafa',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'text',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    />
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, flexShrink: 0, cursor: 'pointer' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
      />
      <span style={{
        position: 'absolute', inset: 0, borderRadius: 99,
        background: checked ? '#059669' : '#e5e5e5',
        border: `1px solid ${checked ? '#059669' : '#d4d4d4'}`,
        transition: 'background 0.2s, border-color 0.2s',
      }} />
      <span style={{
        position: 'absolute',
        width: 16, height: 16,
        left: checked ? 22 : 3,
        top: '50%', transform: 'translateY(-50%)',
        background: '#fff', borderRadius: '50%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        transition: 'left 0.2s',
      }} />
    </label>
  );
}

function ToggleRow({ icon: Icon, label, sub, checked, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 0',
      borderBottom: '1px solid #f5f5f5',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <Icon size={15} color="#a3a3a3" style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 500,
            color: '#0a0a0a', margin: '0 0 3px',
          }}>
            {label}
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, color: '#737373',
            lineHeight: 1.5, margin: 0,
          }}>
            {sub}
          </p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function StatusPill({ ok, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 14px',
      background: '#fafafa', border: '1px solid #e5e5e5',
      borderRadius: 8,
    }}>
      <div style={{
        width: 7, height: 7, borderRadius: '50%',
        background: ok ? '#059669' : '#a3a3a3',
        flexShrink: 0,
      }} />
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11, color: '#525252',
        letterSpacing: '0.04em', margin: 0,
      }}>
        {children}
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Settings() {
  const navigate = useNavigate();

  // ── API state ──
  // useEffect(() => {
  //   Promise.all([fetch('/api/me'), fetch('/api/me/notifications')])
  //     .then(([ur, nr]) => Promise.all([ur.json(), nr.json()]))
  //     .then(([u, n]) => { setUser(u); setNotifs(n); })
  //     .catch(e => setError(e.message))
  //     .finally(() => setLoading(false));
  // }, []);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [toast, setToast]         = useState(null);

  const [user, setUser]           = useState(PLACEHOLDER_USER);
  const [notifs, setNotifs]       = useState(PLACEHOLDER_NOTIFICATIONS);

  const [savingProfile, setSavingProfile]   = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingNotifs, setSavingNotifs]     = useState(false);
  const [deleteConfirm, setDeleteConfirm]   = useState(false);

  const [passwords, setPasswords] = useState({ current: '', next: '' });

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  // Profile save
  async function handleSaveProfile() {
    setSavingProfile(true);
    try {
      // await fetch('/api/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) });
      await new Promise(r => setTimeout(r, 500));
      showToast('success', 'Profile saved');
    } catch (e) {
      showToast('error', e.message || 'Save failed');
    } finally {
      setSavingProfile(false);
    }
  }

  // Password update
  async function handleUpdatePassword() {
    if (!passwords.current || !passwords.next) {
      showToast('error', 'Both password fields are required');
      return;
    }
    setSavingPassword(true);
    try {
      // await fetch('/api/me/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(passwords) });
      await new Promise(r => setTimeout(r, 500));
      setPasswords({ current: '', next: '' });
      showToast('success', 'Password updated');
    } catch (e) {
      showToast('error', e.message || 'Update failed');
    } finally {
      setSavingPassword(false);
    }
  }

  // Notification save
  async function handleSaveNotifs() {
    setSavingNotifs(true);
    try {
      // await fetch('/api/me/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(notifs) });
      await new Promise(r => setTimeout(r, 400));
      showToast('success', 'Notification preferences saved');
    } catch (e) {
      showToast('error', e.message || 'Save failed');
    } finally {
      setSavingNotifs(false);
    }
  }

  // Account delete
  async function handleDeleteAccount() {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    try {
      // await fetch('/api/me', { method: 'DELETE' });
      // navigate('/logout');
      showToast('error', 'Account deletion is disabled in this environment');
    } catch (e) {
      showToast('error', e.message || 'Delete failed');
    } finally {
      setDeleteConfirm(false);
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#0a0a0a' }}>

      <PageHeader
        eyebrow="System Config"
        title="Settings"
        subtitle="Manage your account, preferences, and notification rules"
      />

      {/* ── Error banner ── */}
      {error && (
        <div style={{
          background: '#fafafa', border: '1px solid #e5e5e5',
          borderRadius: 8, padding: '14px 18px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <AlertTriangle size={14} color="#0a0a0a" />
          <MonoLabel color="#0a0a0a">Failed to load settings.</MonoLabel>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#737373', marginLeft: 4 }}>{error}</span>
        </div>
      )}

      <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Profile ── */}
        <div style={panel}>
          <div style={sectionHeader}>
            <MonoLabel>MOD-00 · Profile</MonoLabel>
            <SectionSubtitle>Account Information</SectionSubtitle>
          </div>
          <div style={sectionBody}>

            {/* Avatar row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              marginBottom: 24, paddingBottom: 20,
              borderBottom: '1px solid #f0f0f0',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 10,
                background: '#0a0a0a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 600, color: '#fff',
                letterSpacing: '0.02em', flexShrink: 0,
              }}>
                {initials}
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#0a0a0a', margin: 0 }}>
                  {user.firstName} {user.lastName}
                </p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#737373', marginTop: 4, letterSpacing: '0.04em' }}>
                  {user.role} · {user.org}
                </p>
              </div>
            </div>

            {/* Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  id="firstName"
                  value={user.firstName}
                  onChange={e => setUser(u => ({ ...u, firstName: e.target.value }))}
                />
              </div>
              <div>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input
                  id="lastName"
                  value={user.lastName}
                  onChange={e => setUser(u => ({ ...u, lastName: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input id="email" value={user.email} disabled />
              <p style={{
                fontFamily: "'DM Mono', monospace", fontSize: 10,
                color: '#a3a3a3', marginTop: 6, letterSpacing: '0.04em',
              }}>
                Contact your administrator to update your email.
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <FieldLabel htmlFor="org">Organisation</FieldLabel>
              <Input
                id="org"
                value={user.org}
                onChange={e => setUser(u => ({ ...u, org: e.target.value }))}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <BtnPrimary onClick={handleSaveProfile} disabled={savingProfile || loading}>
                {savingProfile ? 'Saving…' : 'Save Changes'}
              </BtnPrimary>
            </div>
          </div>
        </div>

        {/* ── Security ── */}
        <div style={panel}>
          <div style={sectionHeader}>
            <MonoLabel>MOD-01 · Security</MonoLabel>
            <SectionSubtitle>Password & Access</SectionSubtitle>
          </div>
          <div style={sectionBody}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <FieldLabel htmlFor="currentPw">Current Password</FieldLabel>
                <Input
                  id="currentPw"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.current}
                  onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                />
              </div>
              <div>
                <FieldLabel htmlFor="newPw">New Password</FieldLabel>
                <Input
                  id="newPw"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.next}
                  onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <StatusPill ok>Two-factor authentication is active for this account.</StatusPill>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <BtnSecondary disabled={savingPassword}>Manage 2FA</BtnSecondary>
              <BtnPrimary onClick={handleUpdatePassword} disabled={savingPassword || loading}>
                {savingPassword ? 'Updating…' : 'Update Password'}
              </BtnPrimary>
            </div>
          </div>
        </div>

        {/* ── Notifications ── */}
        <div style={panel}>
          <div style={sectionHeader}>
            <MonoLabel>MOD-02 · Notifications</MonoLabel>
            <SectionSubtitle>Alert Preferences</SectionSubtitle>
          </div>
          <div style={sectionBody}>
            <div style={{ marginBottom: 20 }}>
              <ToggleRow
                icon={Mail}
                label="Email Alerts"
                sub="Receive compliance status updates via email."
                checked={notifs.emailAlerts}
                onChange={e => setNotifs(n => ({ ...n, emailAlerts: e.target.checked }))}
              />
              <ToggleRow
                icon={Bell}
                label="Compliance Reminders"
                sub="Get reminded about upcoming filing deadlines."
                checked={notifs.complianceReminders}
                onChange={e => setNotifs(n => ({ ...n, complianceReminders: e.target.checked }))}
              />
              <div style={{ borderBottom: 'none' }}>
                <ToggleRow
                  icon={Calendar}
                  label="Filing Deadline Alerts"
                  sub="Push notifications 7 days before CPCB deadlines."
                  checked={notifs.filingDeadlineAlerts}
                  onChange={e => setNotifs(n => ({ ...n, filingDeadlineAlerts: e.target.checked }))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <BtnPrimary onClick={handleSaveNotifs} disabled={savingNotifs || loading}>
                {savingNotifs ? 'Saving…' : 'Save Preferences'}
              </BtnPrimary>
            </div>
          </div>
        </div>

        {/* ── Danger Zone ── */}
        <div style={panel}>
          <div style={sectionHeader}>
            <MonoLabel>MOD-03 · System</MonoLabel>
            <SectionSubtitle>Danger Zone</SectionSubtitle>
          </div>
          <div style={sectionBody}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              border: '1px solid #e5e5e5', borderRadius: 8,
              background: '#fafafa',
            }}>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#0a0a0a', margin: '0 0 3px' }}>
                  Delete Account
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#737373', margin: 0 }}>
                  Permanently remove your account and all associated data.
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                onMouseEnter={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#0a0a0a'; e.currentTarget.style.color = '#0a0a0a'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#737373'; }}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12, fontWeight: 500,
                  padding: '8px 16px', borderRadius: 6,
                  border: '1px solid #e5e5e5',
                  background: 'transparent',
                  color: '#737373',
                  cursor: 'pointer',
                  flexShrink: 0, marginLeft: 20,
                  transition: 'border-color 0.15s, color 0.15s, background 0.15s',
                }}
              >
                {deleteConfirm ? 'Confirm Delete' : 'Delete Account'}
              </button>
            </div>
            {deleteConfirm && (
              <p style={{
                fontFamily: "'DM Mono', monospace", fontSize: 10,
                color: '#737373', letterSpacing: '0.04em',
                marginTop: 10,
              }}>
                Click "Confirm Delete" again to permanently delete your account. This cannot be undone.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#0a0a0a', color: '#fff',
          padding: '12px 18px', borderRadius: 8,
          fontSize: 13, fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }}>
          {toast.type === 'success'
            ? <CheckCircle size={14} color="#4ade80" />
            : <AlertTriangle size={14} color="#fbbf24" />
          }
          {toast.message}
        </div>
      )}

      {/* ── Responsive ── */}
      <style>{`
        @media (max-width: 640px) {
          .settings-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}