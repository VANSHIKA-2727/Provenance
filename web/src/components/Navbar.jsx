import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const HexagonLogo = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <path d="M16 2L26.9282 8V20L16 26L5.0718 20V8L16 2Z" fill="#059669" />
    <circle cx="16" cy="14" r="6" fill="#fff" />
  </svg>
);

const DropdownItem = ({ icon, label, onClick, danger = false }) => (
  <button
    onClick={onClick}
    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: danger ? '#dc2626' : '#0a0a0a', textAlign: 'left', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s' }}
    onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    {icon}
    {label}
  </button>
);

const ProfileDropdown = ({ user, onSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsOpen(false);
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const displayName = user?.email?.split('@')[0] ?? '';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        onClick={() => setIsOpen(p => !p)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', transition: 'background 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#ecfdf5', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color: '#059669', flexShrink: 0 }}>
          {initials}
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}>
          {displayName}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="2" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 240, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', zIndex: 50, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500, color: '#a3a3a3', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px' }}>
              Signed in as
            </p>
            <p style={{ fontSize: 13, color: '#0a0a0a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </p>
          </div>
          <div style={{ padding: 6 }}>
            <DropdownItem
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>}
              label="Settings"
              onClick={() => { onSettings(); setIsOpen(false); }}
            />
            <div style={{ height: 1, background: '#f0f0f0', margin: '4px 0' }} />
            <DropdownItem
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>}
              label="Sign Out"
              onClick={handleSignOut}
              danger
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 60, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e5e5', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <HexagonLogo />
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: '#0a0a0a' }}>
          Provenance
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          style={{ position: 'relative', padding: 8, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span style={{ position: 'absolute', top: 7, right: 7, width: 6, height: 6, borderRadius: '50%', background: '#dc2626' }} />
        </button>
        <div style={{ width: 1, height: 20, background: '#e5e5e5', margin: '0 4px' }} />
        {user && <ProfileDropdown user={user} onSettings={() => navigate('/settings')} />}
      </div>
    </nav>
  );
}