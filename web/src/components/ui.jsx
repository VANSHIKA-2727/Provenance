import { useState } from 'react';

export function BtnPrimary({ children, onClick, disabled, type = 'button', style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        padding: '10px 20px', borderRadius: 6, border: 'none',
        background: hov ? '#1a1a1a' : '#0a0a0a', color: '#fff',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s',
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function BtnSecondary({ children, onClick, disabled, type = 'button', style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        padding: '10px 20px', borderRadius: 6,
        border: `1px solid ${hov ? '#0a0a0a' : '#e5e5e5'}`,
        background: hov ? '#fafafa' : '#fff', color: '#0a0a0a',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'border-color 0.15s, background 0.15s',
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function BtnGhost({ children, onClick, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '6px 10px', borderRadius: 6, border: 'none',
        background: hov ? '#f5f5f5' : 'transparent', color: hov ? '#0a0a0a' : '#a3a3a3',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
        cursor: 'pointer', transition: 'background 0.15s, color 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────
// variant: 'ok' | 'warn' | 'neutral' | 'dark'
// ok      → green
// warn    → black (replaces amber/red — stays in 3-colour system)
// neutral → light grey
// dark    → black bg, white text

export function Badge({ children, variant = 'neutral' }) {
  const map = {
    ok:      { bg: '#ecfdf5', color: '#059669' },
    warn:    { bg: '#f5f5f5', color: '#0a0a0a' },
    neutral: { bg: '#f5f5f5', color: '#737373' },
    dark:    { bg: '#0a0a0a', color: '#fff'    },
  };
  const s = map[variant] ?? map.neutral;
  return (
    <span
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10, fontWeight: 600,
        padding: '3px 8px', borderRadius: 4,
        textTransform: 'uppercase', letterSpacing: '0.07em',
        background: s.bg, color: s.color,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

export function ProgressBar({ pct, ok = true, height = 3 }) {
  return (
    <div style={{ height, borderRadius: 99, background: '#e5e5e5', overflow: 'hidden' }}>
      <div
        style={{
          height: '100%', borderRadius: 99,
          background: ok ? '#059669' : '#0a0a0a',
          width: `${Math.min(100, Math.max(0, pct))}%`,
          transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  );
}

// ─── Mono label ───────────────────────────────────────────────────────────────

export function MonoLabel({ children, color = '#737373' }) {
  return (
    <span
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10, fontWeight: 500,
        color, letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export function Toast({ message, visible, icon }) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 200,
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#0a0a0a', color: '#fff',
        padding: '12px 18px', borderRadius: 8,
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        animation: 'toastIn 0.2s ease',
      }}
    >
      {icon}
      {message}
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }`}</style>
    </div>
  );
}