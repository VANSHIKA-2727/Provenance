// pages/Insights.jsx
// ─────────────────────────────────────────────────────────────────────────────
// All data arrays at the top are placeholder constants.
// Replace with API calls (useEffect → GET /api/insights?range=6M) before ship.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { BtnPrimary, BtnSecondary, Badge, ProgressBar, MonoLabel } from '../components/ui';
import { Download, AlertTriangle } from 'lucide-react';

// ── Placeholder data (replace with API) ──────────────────────────────────────

const PLACEHOLDER_STAT_CARDS = [
  { id: 'compliance', label: 'Overall Compliance', value: '96%',  delta: '+2.1%', sub: 'vs last month', up: true  },
  { id: 'violations', label: 'Active Violations',  value: '4',    delta: '−12',   sub: 'vs last month', up: true  },
  { id: 'risk',       label: 'Risk Score',         value: '2.3',  delta: '−0.4',  sub: 'vs last month', up: true  },
  { id: 'policies',   label: 'Active Policies',    value: '127',  delta: '+5',    sub: 'new this month', up: true },
];

// Keyed by range for easy swap-in from API response
const PLACEHOLDER_TREND_DATA = {
  compliance: [
    { month: 'Jan', value: 85 },
    { month: 'Feb', value: 88 },
    { month: 'Mar', value: 92 },
    { month: 'Apr', value: 89 },
    { month: 'May', value: 94 },
    { month: 'Jun', value: 96 },
  ],
  violations: [
    { month: 'Jan', value: 15 },
    { month: 'Feb', value: 12 },
    { month: 'Mar', value: 8  },
    { month: 'Apr', value: 11 },
    { month: 'May', value: 6  },
    { month: 'Jun', value: 4  },
  ],
};

const PLACEHOLDER_CATEGORIES = [
  { id: 'plastic', name: 'Plastic PWM',  pct: 87,  ok: true  },
  { id: 'ewaste',  name: 'E-Waste',      pct: 100, ok: true  },
  { id: 'battery', name: 'Battery',      pct: 42,  ok: false },
  { id: 'brsr',    name: 'BRSR Core',    pct: 74,  ok: true  },
  { id: 'carbon',  name: 'Carbon BOM',   pct: 61,  ok: false },
];

const PLACEHOLDER_RISK_DATA = [
  { id: 'high',   level: 'High',   count: 12,  total: 127 },
  { id: 'medium', level: 'Medium', count: 28,  total: 127 },
  { id: 'low',    level: 'Low',    count: 87,  total: 127 },
];

// ── Shared styles (mirrors Dashboard) ────────────────────────────────────────

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

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <p style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 10, fontWeight: 500,
      color: '#0a0a0a', letterSpacing: '0.1em',
      textTransform: 'uppercase',
      margin: '0 0 16px', paddingBottom: 12,
      borderBottom: '1px solid #f0f0f0',
    }}>
      {children}
    </p>
  );
}

function StatCard({ label, value, delta, sub, up, loading }) {
  if (loading) {
    return (
      <div style={card}>
        {[70, 40, 55].map((w, i) => (
          <div key={i} style={{ height: i === 1 ? 32 : 12, width: `${w}%`, background: '#efefef', borderRadius: 4, marginBottom: 12, animation: 'shimmer 1.4s ease infinite' }} />
        ))}
        <style>{`@keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }`}</style>
      </div>
    );
  }
  return (
    <div style={card}>
      <MonoLabel>{label}</MonoLabel>
      <p style={{
        fontSize: 30, fontWeight: 600,
        letterSpacing: '-0.025em', color: '#0a0a0a',
        margin: '12px 0 4px',
      }}>
        {value}
      </p>
      <p style={{
        fontFamily: "'DM Mono', monospace", fontSize: 10,
        color: up ? '#059669' : '#0a0a0a',
        letterSpacing: '0.07em', textTransform: 'uppercase', margin: 0,
      }}>
        {delta} · {sub}
      </p>
    </div>
  );
}

// Pure SVG bar chart — no external deps
function BarChart({ data, accent }) {
  const W = 400, H = 140, barW = 34;
  const max = Math.max(...data.map(d => d.value), 1);
  const gap = (W - data.length * barW) / (data.length + 1);
  const isGreen = accent === 'green';

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 28}`} style={{ display: 'block' }}>
      {data.map((d, i) => {
        const bh = Math.max(Math.round((d.value / max) * H), 4);
        const x  = gap + i * (barW + gap);
        const y  = H - bh;
        return (
          <g key={d.month}>
            <rect
              x={x} y={y} width={barW} height={bh} rx={3}
              fill={isGreen ? '#059669' : '#0a0a0a'}
              opacity={0.85}
            />
            <text
              x={x + barW / 2} y={H + 20}
              textAnchor="middle" fontSize="10"
              fontFamily="'DM Mono', monospace"
              fill="#a3a3a3" letterSpacing="0.04em"
            >
              {d.month}
            </text>
            <text
              x={x + barW / 2} y={y - 6}
              textAnchor="middle" fontSize="10"
              fontFamily="'DM Mono', monospace"
              fill="#737373"
            >
              {d.value}{isGreen ? '%' : ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// SVG donut ring
function DonutRing({ count, total }) {
  const r = 34, cx = 46, cy = 46;
  const circ  = 2 * Math.PI * r;
  const filled = Math.min(count / total, 1) * circ;
  const pct   = Math.round((count / total) * 100);
  return (
    <svg width="92" height="92" viewBox="0 0 92 92">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0f0f0" strokeWidth="7" />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="#059669" strokeWidth="7"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text
        x={cx} y={cy + 5}
        textAnchor="middle" fontSize="16" fontWeight="600"
        fontFamily="'DM Sans', sans-serif" fill="#0a0a0a"
      >
        {count}
      </text>
    </svg>
  );
}

function RiskCard({ level, count, total }) {
  const pct = Math.round((count / total) * 100);
  return (
    <div style={{
      ...card,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '24px 20px', gap: 12,
    }}>
      <DonutRing count={count} total={total} />
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, fontWeight: 600,
          color: '#0a0a0a', margin: '0 0 4px',
        }}>
          {level} Risk
        </p>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, color: '#737373',
          letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0,
        }}>
          {count} of {total} items
        </p>
      </div>
      <div style={{ width: '100%' }}>
        <ProgressBar pct={pct} ok={level === 'Low'} height={3} />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const TIME_RANGES = ['1M', '3M', '6M', '1Y'];

export default function Insights() {
  const navigate = useNavigate();

  // ── API state ──
  // Replace with:
  // useEffect(() => {
  //   fetch(`/api/insights?range=${timeRange}`)
  //     .then(r => { if (!r.ok) throw new Error('Failed to load insights'); return r.json(); })
  //     .then(d => { setStatCards(d.statCards); setTrends(d.trends); setCategories(d.categories); setRiskData(d.riskData); })
  //     .catch(e => setError(e.message))
  //     .finally(() => setLoading(false));
  // }, [timeRange]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [timeRange, setTimeRange] = useState('6M');
  const [exporting, setExporting] = useState(false);
  const [toast, setToast]         = useState(null);

  const statCards  = PLACEHOLDER_STAT_CARDS;
  const trends     = PLACEHOLDER_TREND_DATA;
  const categories = PLACEHOLDER_CATEGORIES;
  const riskData   = PLACEHOLDER_RISK_DATA;

  async function handleExport() {
    setExporting(true);
    try {
      // await fetch(`/api/insights/export?range=${timeRange}`).then(...)
      await new Promise(r => setTimeout(r, 700));
      setToast({ type: 'success', message: 'Export started' });
    } catch (e) {
      setToast({ type: 'error', message: 'Export failed' });
    } finally {
      setExporting(false);
      setTimeout(() => setToast(null), 3200);
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#0a0a0a' }}>

      <PageHeader
        eyebrow="FY 2024–25 · Telemetry"
        title="Insights & Analytics"
        subtitle="Deterministic compliance signals across all active modules"
        actions={
          <>
            {/* Time range toggles */}
            <div style={{ display: 'flex', gap: 4 }}>
              {TIME_RANGES.map(r => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  style={{
                    padding: '8px 14px', borderRadius: 6,
                    fontSize: 12, fontWeight: 500,
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: '0.04em',
                    border: '1px solid',
                    borderColor: timeRange === r ? '#0a0a0a' : '#e5e5e5',
                    background: timeRange === r ? '#0a0a0a' : '#fff',
                    color: timeRange === r ? '#fff' : '#737373',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
            <BtnSecondary onClick={handleExport} disabled={exporting || loading}>
              <Download size={13} />
              {exporting ? 'Exporting…' : 'Export'}
            </BtnSecondary>
          </>
        }
      />

      {/* ── Error banner ── */}
      {error && (
        <div style={{
          background: '#fafafa', border: '1px solid #e5e5e5',
          borderRadius: 8, padding: '14px 18px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <AlertTriangle size={14} color="#0a0a0a" />
          <MonoLabel color="#0a0a0a">Failed to load insights.</MonoLabel>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#737373', marginLeft: 4 }}>
            {error}
          </span>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map(c => (
          <StatCard key={c.id} {...c} loading={loading} />
        ))}
      </div>

      {/* ── Trend charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        <div style={panel}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <SectionTitle>Compliance Trend</SectionTitle>
            <Badge variant="success">+11 pts</Badge>
          </div>
          {loading
            ? <div style={{ height: 168, background: '#fafafa', borderRadius: 6, animation: 'shimmer 1.4s ease infinite' }} />
            : <BarChart data={trends.compliance} accent="green" />
          }
        </div>

        <div style={panel}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <SectionTitle>Violations Trend</SectionTitle>
            <Badge variant="neutral">−73% YTD</Badge>
          </div>
          {loading
            ? <div style={{ height: 168, background: '#fafafa', borderRadius: 6, animation: 'shimmer 1.4s ease infinite' }} />
            : <BarChart data={trends.violations} accent="dark" />
          }
        </div>

      </div>

      {/* ── Category compliance ── */}
      <div style={{ ...panel, marginBottom: 20 }}>
        <SectionTitle>Category Compliance</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {categories.map((cat, i) => (
            <div key={cat.id} style={{
              display: 'flex', alignItems: 'center', gap: 20,
              padding: '14px 0',
              borderBottom: i < categories.length - 1 ? '1px solid #f5f5f5' : 'none',
            }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 500,
                color: '#0a0a0a', width: 110, flexShrink: 0,
              }}>
                {cat.name}
              </span>
              <div style={{ flex: 1 }}>
                <ProgressBar pct={cat.pct} ok={cat.ok} height={3} />
              </div>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 12, fontWeight: 600,
                color: cat.ok ? '#059669' : '#0a0a0a',
                width: 36, textAlign: 'right', flexShrink: 0,
              }}>
                {cat.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Risk distribution ── */}
      <div>
        <p style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500,
          color: '#0a0a0a', letterSpacing: '0.1em', textTransform: 'uppercase',
          margin: '0 0 16px',
        }}>
          Risk Distribution
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {riskData.map(r => (
            <RiskCard key={r.id} {...r} />
          ))}
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
            ? <span style={{ color: '#4ade80', fontSize: 14 }}>✓</span>
            : <AlertTriangle size={14} color="#fbbf24" />
          }
          {toast.message}
        </div>
      )}

      {/* ── Responsive ── */}
      <style>{`
        @media (max-width: 900px) {
          .ins-stats  { grid-template-columns: 1fr 1fr !important; }
          .ins-charts { grid-template-columns: 1fr !important; }
          .ins-risk   { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .ins-stats { grid-template-columns: 1fr !important; }
          .ins-risk  { grid-template-columns: 1fr !important; }
        }
        @keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }
      `}</style>
    </div>
  );
}