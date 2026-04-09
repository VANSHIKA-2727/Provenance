// pages/Dashboard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// All data arrays at the top are placeholder constants.
// Replace with API calls (useEffect → GET /api/dashboard/summary) before ship.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { BtnPrimary, BtnSecondary, Badge, ProgressBar, MonoLabel } from '../components/ui';

// ── Placeholder data (replace with API) ──────────────────────────────────────

const PLACEHOLDER_SUMMARY = {
  fy: 'FY 2024–25',
  score: 75,
  scoreThreshold: 60,
  scoreTopQuartile: 80,
  lastSync: null, // null = use current date
};

const PLACEHOLDER_STAT_CARDS = [
  { id: 'brsr',   label: 'BRSR Reporting', value: '85%', pct: 85, ok: true  },
  { id: 'plastic',label: 'Plastic EPR',    value: '72%', pct: 72, ok: false },
  { id: 'carbon', label: 'Carbon Metrics', value: '68%', pct: 68, ok: false },
];

const PLACEHOLDER_TARGETS = [
  { label: 'Plastic PWM', pct: 87, ok: true  },
  { label: 'E-Waste',     pct: 100, ok: true  },
  { label: 'Battery',     pct: 42,  ok: false },
  { label: 'Tyres',       pct: 95,  ok: true  },
];

const PLACEHOLDER_DEADLINES = [
  { id: 1, name: 'Plastic EPR Annual', date: 'Jun 30, 2025', status: 'Pending'    },
  { id: 2, name: 'E-Waste Q1 Cert',    date: 'Apr 15, 2025', status: 'Action Req' },
  { id: 3, name: 'BRSR Core Filing',   date: 'Sep 30, 2025', status: 'Pending'    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSync(date) {
  return (date ?? new Date()).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, pct, ok, loading }) {
  if (loading) return <CardSkeleton />;
  return (
    <div style={card}>
      <MonoLabel>{label}</MonoLabel>
      <p style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.025em', color: '#0a0a0a', margin: '12px 0 4px' }}>
        {value}
      </p>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: ok ? '#059669' : '#737373', letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 14px' }}>
        {ok ? 'On Track' : 'Action Needed'}
      </p>
      <ProgressBar pct={pct} ok={ok} height={3} />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div style={{ ...card, background: '#fafafa' }}>
      {[80, 48, 28, 12].map((w, i) => (
        <div key={i} style={{ height: i === 1 ? 32 : 12, width: `${w}%`, background: '#efefef', borderRadius: 4, marginBottom: 12, animation: 'shimmer 1.4s ease infinite' }} />
      ))}
      <style>{`@keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }`}</style>
    </div>
  );
}

function TargetRow({ label, pct, ok }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#0a0a0a' }}>{label}</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600, color: ok ? '#059669' : '#0a0a0a' }}>{pct}%</span>
      </div>
      <ProgressBar pct={pct} ok={ok} height={3} />
    </div>
  );
}

function DeadlineRow({ name, date, status }) {
  const [hov, setHov] = useState(false);
  const isUrgent = status === 'Action Req';
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 16px', borderRadius: 8,
        border: `1px solid ${hov ? '#d4d4d4' : '#f0f0f0'}`,
        background: hov ? '#fafafa' : '#fff',
        cursor: 'default', transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      <div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#0a0a0a', margin: 0 }}>{name}</p>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#a3a3a3', margin: '4px 0 0', letterSpacing: '0.05em' }}>{date}</p>
      </div>
      <Badge variant={isUrgent ? 'dark' : 'neutral'}>{status}</Badge>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <p style={{
      fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500,
      color: '#0a0a0a', letterSpacing: '0.1em', textTransform: 'uppercase',
      margin: '0 0 16px', paddingBottom: 12, borderBottom: '1px solid #f0f0f0',
    }}>
      {children}
    </p>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const card = {
  border: '1px solid #e5e5e5',
  borderRadius: 10,
  padding: '22px 24px',
  background: '#fff',
};

const panel = {
  border: '1px solid #e5e5e5',
  borderRadius: 10,
  padding: 24,
  background: '#fff',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();

  // ── API state ──
  // Replace these with real fetch calls:
  // useEffect(() => { fetch('/api/dashboard/summary').then(...).then(setData) }, [])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const summary   = PLACEHOLDER_SUMMARY;
  const statCards = PLACEHOLDER_STAT_CARDS;
  const targets   = PLACEHOLDER_TARGETS;
  const deadlines = PLACEHOLDER_DEADLINES;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#0a0a0a' }}>

      <PageHeader
        eyebrow={summary.fy}
        title="Compliance Overview"
        subtitle={`Last sync: ${formatSync(summary.lastSync)} · Auto`}
        actions={
          <>
            <BtnSecondary onClick={() => navigate('/upload')}>Upload Data</BtnSecondary>
            {/* <BtnPrimary   onClick={() => navigate('/reports')}>Generate Filing</BtnPrimary> */}
          </>
        }
      />

      {error && (
        <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: 8, padding: '14px 18px', marginBottom: 24 }}>
          <MonoLabel color="#0a0a0a">Failed to load dashboard data.</MonoLabel>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#737373', marginLeft: 8 }}>
            {error}
          </span>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map((c) => (
          <StatCard key={c.id} {...c} loading={loading} />
        ))}
      </div>

      {/* ── Target Acquisition + Deadlines ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        <div style={panel}>
          <SectionTitle>Target Acquisition</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {targets.map((t) => <TargetRow key={t.label} {...t} />)}
          </div>
        </div>

        <div style={panel}>
          <SectionTitle>Upcoming Deadlines</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {deadlines.map((d) => <DeadlineRow key={d.id} {...d} />)}
          </div>
        </div>

      </div>

      {/* ── Overall score ── */}
      <div style={panel}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <SectionTitle style={{ margin: 0, border: 'none', paddingBottom: 0 }}>Overall Compliance Score</SectionTitle>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: '#0a0a0a' }}>
              {summary.score}
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: '#a3a3a3', marginLeft: 2 }}>/100</span>
          </div>
        </div>
        <ProgressBar pct={summary.score} ok height={5} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <MonoLabel color="#a3a3a3">Threshold: {summary.scoreThreshold}</MonoLabel>
          <MonoLabel color="#059669">Top Quartile: {summary.scoreTopQuartile}+</MonoLabel>
        </div>
      </div>

      {/* ── Responsive overrides ── */}
      <style>{`
        @media (max-width: 900px) {
          .dash-stats { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .dash-stats { grid-template-columns: 1fr !important; }
          .dash-mid   { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}