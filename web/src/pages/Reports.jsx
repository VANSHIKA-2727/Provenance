// pages/Reports.jsx
// ─────────────────────────────────────────────────────────────────────────────
// All data arrays at the top are placeholder constants.
// Replace with API calls (useEffect → GET /api/reports/:reportId) before ship.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { BtnPrimary, BtnSecondary, Badge, ProgressBar, MonoLabel } from '../components/ui';
import { CheckCircle, AlertTriangle, Info, Download, RefreshCw, Pencil } from 'lucide-react';

// ── Placeholder data (replace with API) ──────────────────────────────────────

const PLACEHOLDER_META = {
  fy: 'FY 2024–25',
  reportId: null,
  pipelineStep: 3, // 0-indexed; 3 = Report Creation (in-progress)
  pipelineStatus: 'In Progress',
};

const PLACEHOLDER_SUMMARY_CARDS = [
  { id: 'plastic', label: 'Plastic Obligation Met', value: '92%',        sub: 'Within CPCB threshold', ok: true  },
  { id: 'supplier',label: 'Missing Supplier Data',  value: '1',          sub: 'Action required',        ok: false },
  { id: 'carbon',  label: 'Carbon Footprint Est.',  value: '1,250 tCO₂e',sub: 'Scope 1 + 2',            ok: null  },
];

const PLACEHOLDER_PROGRESS_ITEMS = [
  { id: 'plastic', label: 'Plastic PWM', pct: 92,  ok: true  },
  { id: 'ewaste',  label: 'E-Waste',     pct: 100, ok: true  },
  { id: 'battery', label: 'Battery',     pct: 42,  ok: false },
];

const PLACEHOLDER_TABLE_ROWS = [
  { id: 'r1', metric: 'Total Plastic Collected',  value: '850 kg',     status: 'Compliant'  },
  { id: 'r2', metric: 'EPR Compliance',           value: '92%',        status: 'Compliant'  },
  { id: 'r3', metric: 'Carbon Offset Required',   value: '1,250 tCO₂e',status: 'Action Req' },
  { id: 'r4', metric: 'Supplier Coverage',        value: '99%',        status: 'Compliant'  },
  { id: 'r5', metric: 'E-Waste Certificates',     value: '14 / 14',    status: 'Compliant'  },
  { id: 'r6', metric: 'Battery Liability',        value: '0.42 MT',    status: 'Pending'    },
];

const PLACEHOLDER_ASSUMPTIONS = [
  { id: 'a1', text: 'All supplier data is accurate and up-to-date.' },
  { id: 'a2', text: 'Plastic weights are reported in kilograms per consignment record.' },
  { id: 'a3', text: 'Carbon calculations use IPCC AR5 standard emission factors.' },
  { id: 'a4', text: 'Reporting period covers the full fiscal year FY 2024–25.' },
  { id: 'a5', text: 'Emission factor version: EF_v3.1 (locked at run-time).' },
];

const PLACEHOLDER_WARNINGS = [
  { id: 'w1', message: 'Supplier ID SUP-047 missing Q3 dispatch records.', severity: 'warning' },
  { id: 'w2', message: 'Carbon estimate based on 94% data completeness.',  severity: 'info'    },
  { id: 'w3', message: 'Battery liability calculation pending CPCB factor update.', severity: 'info' },
];

const PIPELINE_STEPS = ['Parsing', 'Mapping', 'Calculation', 'Report Creation'];

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

function PipelineStatus({ currentStep, status }) {
  return (
    <div style={{ ...panel, marginBottom: 20 }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 20,
      }}>
        <SectionTitle>Processing Pipeline</SectionTitle>
        <Badge variant={currentStep >= PIPELINE_STEPS.length - 1 ? 'success' : 'neutral'}>
          {status}
        </Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', rowGap: 12 }}>
        {PIPELINE_STEPS.map((step, i) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {i < currentStep ? (
                <CheckCircle size={15} color="#059669" />
              ) : i === currentStep ? (
                <div style={{
                  width: 15, height: 15, borderRadius: '50%',
                  border: '2px solid #e5e5e5',
                  borderTopColor: '#059669',
                  animation: 'spin 0.7s linear infinite',
                }} />
              ) : (
                <div style={{
                  width: 15, height: 15, borderRadius: '50%',
                  border: '2px solid #e5e5e5',
                }} />
              )}
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 500,
                color: i <= currentStep ? '#0a0a0a' : '#a3a3a3',
              }}>
                {step}
              </span>
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <div style={{
                width: 32, height: 1,
                background: i < currentStep ? '#059669' : '#e5e5e5',
                margin: '0 12px',
              }} />
            )}
          </div>
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function SummaryCard({ label, value, sub, ok, loading }) {
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
        color: ok === true ? '#059669' : ok === false ? '#0a0a0a' : '#737373',
        letterSpacing: '0.07em', textTransform: 'uppercase',
        margin: 0,
      }}>
        {sub}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    'Compliant':   { variant: 'success', label: 'Compliant'   },
    'Action Req':  { variant: 'dark',    label: 'Action Req'  },
    'Pending':     { variant: 'neutral', label: 'Pending'     },
  };
  const { variant, label } = map[status] ?? { variant: 'neutral', label: status };
  return <Badge variant={variant}>{label}</Badge>;
}

function TableRow({ metric, value, status }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center',
        padding: '14px 20px',
        borderBottom: '1px solid #f5f5f5',
        background: hov ? '#fafafa' : '#fff',
        transition: 'background 0.15s',
      }}
    >
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13, fontWeight: 500,
        color: '#0a0a0a', flex: 2,
      }}>
        {metric}
      </span>
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 12, color: '#525252', flex: 1,
      }}>
        {value}
      </span>
      <span style={{ flex: 1 }}>
        <StatusBadge status={status} />
      </span>
    </div>
  );
}

function WarningItem({ message, severity }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 16px', borderRadius: 8,
      border: `1px solid ${severity === 'warning' ? '#e5e5e5' : '#f0f0f0'}`,
      background: severity === 'warning' ? '#fafafa' : '#fff',
    }}>
      {severity === 'warning'
        ? <AlertTriangle size={14} color="#a3a3a3" style={{ marginTop: 1, flexShrink: 0 }} />
        : <Info size={14} color="#059669" style={{ marginTop: 1, flexShrink: 0 }} />
      }
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13, color: '#0a0a0a', lineHeight: 1.6, margin: 0,
      }}>
        {message}
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Reports() {
  const navigate = useNavigate();
  const { reportId } = useParams();

  const TABS = [
    { id: 'summary',     label: 'Summary'     },
    { id: 'tables',      label: 'KPI Table'   },
    { id: 'assumptions', label: 'Assumptions' },
    { id: 'warnings',    label: null }, // label set dynamically below
  ];

  // ── API state ──
  // Replace with:
  // useEffect(() => {
  //   fetch(`/api/reports/${reportId}`)
  //     .then(r => { if (!r.ok) throw new Error('Failed to load report'); return r.json(); })
  //     .then(d => { setMeta(d.meta); setSummaryCards(d.summaryCards); ... })
  //     .catch(e => setError(e.message))
  //     .finally(() => setLoading(false));
  // }, [reportId]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [approved, setApproved]   = useState(false);
  const [approving, setApproving] = useState(false);
  const [toast, setToast]         = useState(null);
  const [downloading, setDownloading] = useState(false);

  const meta         = PLACEHOLDER_META;
  const summaryCards = PLACEHOLDER_SUMMARY_CARDS;
  const progressItems= PLACEHOLDER_PROGRESS_ITEMS;
  const tableRows    = PLACEHOLDER_TABLE_ROWS;
  const assumptions  = PLACEHOLDER_ASSUMPTIONS;
  const warnings     = PLACEHOLDER_WARNINGS;

  const tabs = TABS.map(t =>
    t.id === 'warnings' ? { ...t, label: `Warnings (${warnings.length})` } : t
  );

  // ── Actions ──
  async function handleApprove() {
    if (approved) return;
    setApproving(true);
    try {
      // await fetch(`/api/reports/${reportId}/approve`, { method: 'POST' });
      await new Promise(r => setTimeout(r, 600));
      setApproved(true);
      showToast('success', 'Report approved and submitted');
    } catch (e) {
      showToast('error', e.message || 'Approval failed');
    } finally {
      setApproving(false);
    }
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      // const res = await fetch(`/api/reports/${reportId}/download`);
      // const blob = await res.blob();
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement('a'); a.href = url; a.download = 'report.pdf'; a.click();
      await new Promise(r => setTimeout(r, 800));
      showToast('success', 'Download started');
    } catch (e) {
      showToast('error', 'Download failed');
    } finally {
      setDownloading(false);
    }
  }

  async function handleRegenerate() {
    // await fetch(`/api/reports/${reportId}/regenerate`, { method: 'POST' });
    showToast('success', 'Regeneration queued');
  }

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3200);
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#0a0a0a' }}>

      <PageHeader
        eyebrow={meta.fy}
        title="Compliance Report"
        subtitle="Review, verify, and finalise your generated filing"
        actions={
          <>
            <BtnSecondary onClick={handleDownload} disabled={downloading || loading}>
              <Download size={13} />
              {downloading ? 'Downloading…' : 'Download'}
            </BtnSecondary>
            <BtnPrimary onClick={handleApprove} disabled={approving || approved || loading}>
              {approved
                ? <><CheckCircle size={13} /> Approved</>
                : approving ? 'Approving…' : 'Approve & Submit'
              }
            </BtnPrimary>
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
          <MonoLabel color="#0a0a0a">Failed to load report.</MonoLabel>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#737373', marginLeft: 4 }}>
            {error}
          </span>
        </div>
      )}

      {/* ── Pipeline ── */}
      <PipelineStatus currentStep={meta.pipelineStep} status={meta.pipelineStatus} />

      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: 4,
        background: '#f5f5f5', borderRadius: 8,
        padding: 4, marginBottom: 24,
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: '9px 16px', borderRadius: 6,
              border: activeTab === tab.id ? '1px solid #e5e5e5' : '1px solid transparent',
              fontSize: 13, fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer',
              background: activeTab === tab.id ? '#fff' : 'transparent',
              color: activeTab === tab.id ? '#0a0a0a' : '#737373',
              boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Summary ── */}
      {activeTab === 'summary' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
            {summaryCards.map(c => (
              <SummaryCard key={c.id} {...c} loading={loading} />
            ))}
          </div>
          <div style={panel}>
            <SectionTitle>Overall Acquisition Progress</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {progressItems.map(item => (
                <div key={item.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#0a0a0a' }}>
                      {item.label}
                    </span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600, color: item.ok ? '#059669' : '#0a0a0a' }}>
                      {item.pct}%
                    </span>
                  </div>
                  <ProgressBar pct={item.pct} ok={item.ok} height={3} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: KPI Table ── */}
      {activeTab === 'tables' && (
        <div style={{ ...panel, padding: 0, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            padding: '12px 20px', borderBottom: '1px solid #f0f0f0',
            background: '#fafafa',
          }}>
            {['Metric', 'Reported Value', 'Status'].map((h, i) => (
              <span key={h} style={{
                fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500,
                color: '#737373', letterSpacing: '0.08em', textTransform: 'uppercase',
                flex: i === 0 ? 2 : 1,
              }}>
                {h}
              </span>
            ))}
          </div>
          {tableRows.map(row => (
            <TableRow key={row.id} {...row} />
          ))}
        </div>
      )}

      {/* ── Tab: Assumptions ── */}
      {activeTab === 'assumptions' && (
        <div style={{ ...panel, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
            <MonoLabel>Calculation Assumptions</MonoLabel>
          </div>
          <div style={{ padding: '0 24px' }}>
            {assumptions.map((a, i) => (
              <div key={a.id} style={{
                display: 'flex', gap: 16, alignItems: 'flex-start',
                padding: '16px 0',
                borderBottom: i < assumptions.length - 1 ? '1px solid #f5f5f5' : 'none',
              }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 11,
                  fontWeight: 600, color: '#a3a3a3',
                  flexShrink: 0, marginTop: 2,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13, color: '#525252', lineHeight: 1.6, margin: 0,
                }}>
                  {a.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Warnings ── */}
      {activeTab === 'warnings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {warnings.map(w => <WarningItem key={w.id} {...w} />)}
        </div>
      )}

      {/* ── Action row ── */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: 10,
        marginTop: 32, paddingTop: 24,
        borderTop: '1px solid #e5e5e5',
      }}>
        <BtnSecondary onClick={() => {/* navigate to edit flow */}}>
          <Pencil size={13} /> Edit
        </BtnSecondary>
        <BtnSecondary onClick={handleRegenerate}>
          <RefreshCw size={13} /> Regenerate
        </BtnSecondary>
        <BtnSecondary onClick={handleDownload} disabled={downloading}>
          <Download size={13} /> {downloading ? 'Downloading…' : 'Download'}
        </BtnSecondary>
        <BtnPrimary onClick={handleApprove} disabled={approving || approved}>
          {approved
            ? <><CheckCircle size={13} /> Approved</>
            : approving ? 'Approving…' : 'Approve & Submit'
          }
        </BtnPrimary>
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
        @media (max-width: 900px) {
          .rep-summary { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .rep-summary { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}