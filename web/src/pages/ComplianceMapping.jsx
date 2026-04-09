// pages/ComplianceMapping.jsx
// ─────────────────────────────────────────────────────────────────────────────
// All data arrays at the top are placeholder constants.
// Replace with API calls (useEffect → GET /api/mapping/:uploadId) before ship.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

import { BtnPrimary, BtnSecondary, Badge, ProgressBar, MonoLabel } from '../components/ui';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

// ── Placeholder data (replace with API) ──────────────────────────────────────

const PLACEHOLDER_RAW_FIELDS = [
  { id: 'inv',  field: 'Invoice Number', value: 'INV-001',        mapped: true  },
  { id: 'sup',  field: 'Supplier Name',  value: 'ABC Corp',        mapped: true  },
  { id: 'amt',  field: 'Amount',         value: '₹50,000',         mapped: true  },
  { id: 'dt',   field: 'Date',           value: '2024-01-15',      mapped: false },
  { id: 'cat',  field: 'Category',       value: 'Office Supplies', mapped: false },
];

const PLACEHOLDER_FRAMEWORK_MAP = {
  brsr: [
    { id: 'b1', label: 'Revenue from Operations' },
    { id: 'b2', label: 'Employee Benefits'        },
    { id: 'b3', label: 'Community Development'    },
  ],
  epr: [
    { id: 'e1', label: 'Plastic Packaging' },
    { id: 'e2', label: 'Paper Waste'       },
    { id: 'e3', label: 'Electronic Waste'  },
  ],
  carbon: [
    { id: 'c1', label: 'Scope 1 Emissions' },
    { id: 'c2', label: 'Scope 2 Emissions' },
    { id: 'c3', label: 'Scope 3 Emissions' },
  ],
};

const PLACEHOLDER_META = {
  step: 3,
  totalSteps: 4,
  uploadId: null,
  fileName: 'invoice_jan_2024.xlsx',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const FRAMEWORKS = [
  { key: 'brsr',   label: 'BRSR Mapping'   },
  { key: 'epr',    label: 'EPR Mapping'    },
  { key: 'carbon', label: 'Carbon Mapping' },
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

function SectionTitle({ children, style }) {
  return (
    <p style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 10,
      fontWeight: 500,
      color: '#0a0a0a',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      margin: '0 0 16px',
      paddingBottom: 12,
      borderBottom: '1px solid #f0f0f0',
      ...style,
    }}>
      {children}
    </p>
  );
}

function FieldRow({ field, value, mapped }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        background: hov ? '#fafafa' : '#fff',
        border: `1px solid ${hov ? '#d4d4d4' : '#f0f0f0'}`,
        borderRadius: 8,
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      <div>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, fontWeight: 500,
          color: '#0a0a0a', margin: '0 0 3px',
        }}>
          {field}
        </p>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11, color: '#a3a3a3',
          margin: 0, letterSpacing: '0.04em',
        }}>
          {value}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {mapped
          ? <CheckCircle size={14} color="#059669" />
          : <AlertTriangle size={14} color="#a3a3a3" />
        }
        <ArrowRight size={13} color="#d4d4d4" />
      </div>
    </div>
  );
}

function FrameworkSection({ label, items }) {
  return (
    <div>
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10, fontWeight: 500,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: '#0a0a0a', margin: '0 0 8px',
      }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item) => (
          <div key={item.id} style={{
            padding: '10px 14px',
            background: '#fafafa',
            border: '1px solid #f0f0f0',
            borderRadius: 7,
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 500,
              color: '#0a0a0a', margin: 0,
            }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RowSkeleton() {
  return (
    <div style={{ padding: '12px 14px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8 }}>
      <div style={{ height: 12, width: '55%', background: '#efefef', borderRadius: 4, marginBottom: 8, animation: 'shimmer 1.4s ease infinite' }} />
      <div style={{ height: 10, width: '35%', background: '#efefef', borderRadius: 4, animation: 'shimmer 1.4s ease infinite' }} />
      <style>{`@keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }`}</style>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ComplianceMapping() {
  const navigate = useNavigate();
  const { uploadId } = useParams();

  // ── API state ──
  // Replace with:
  // useEffect(() => {
  //   fetch(`/api/mapping/${uploadId}`)
  //     .then(r => { if (!r.ok) throw new Error('Failed to load mapping'); return r.json(); })
  //     .then(d => { setRawFields(d.rawFields); setFrameworkMap(d.frameworkMap); setMeta(d.meta); })
  //     .catch(e => setError(e.message))
  //     .finally(() => setLoading(false));
  // }, [uploadId]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [approving, setApproving]       = useState(false);
  const [toast, setToast]               = useState(null); // { type: 'success'|'error', message }

  const rawFields    = PLACEHOLDER_RAW_FIELDS;
  const frameworkMap = PLACEHOLDER_FRAMEWORK_MAP;
  const meta         = PLACEHOLDER_META;

  const mappedCount = rawFields.filter(f => f.mapped).length;
  const totalCount  = rawFields.length;

  // ── Actions ──
  // Replace with real POST calls before ship
  async function handleApprove() {
    setApproving(true);
    try {
      // await fetch(`/api/mapping/${uploadId}/approve`, { method: 'POST' });
      await new Promise(r => setTimeout(r, 600)); // remove: simulates latency
      showToast('success', 'Mapping approved successfully');
      setTimeout(() => navigate('/reports'), 1200);
    } catch (e) {
      showToast('error', e.message || 'Approval failed');
    } finally {
      setApproving(false);
    }
  }

  function handleRequestChanges() {
    navigate('/validation');
  }

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3200);
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#0a0a0a' }}>

      <PageHeader
        eyebrow={`Step ${meta.step} of ${meta.totalSteps}`}
        title="Compliance Mapping"
        subtitle={meta.fileName ?? 'No file selected'}
        actions={
          <>
            <BtnSecondary onClick={handleRequestChanges} disabled={loading || approving}>
              Request Changes
            </BtnSecondary>
            <BtnPrimary onClick={handleApprove} disabled={loading || approving}>
              {approving ? 'Approving…' : 'Approve Mapping →'}
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
          <MonoLabel color="#0a0a0a">Failed to load mapping data.</MonoLabel>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#737373', marginLeft: 4 }}>
            {error}
          </span>
        </div>
      )}

      {/* ── Mapped fields summary pill ── */}
      {!loading && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          marginBottom: 20,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 16px',
            border: '1px solid #e5e5e5', borderRadius: 8,
            background: '#fff',
          }}>
            <MonoLabel>{mappedCount} / {totalCount} fields mapped</MonoLabel>
            <div style={{ width: 100 }}>
              <ProgressBar pct={Math.round((mappedCount / totalCount) * 100)} ok={mappedCount === totalCount} height={3} />
            </div>
            <Badge variant={mappedCount === totalCount ? 'success' : 'neutral'}>
              {mappedCount === totalCount ? 'Complete' : 'Incomplete'}
            </Badge>
          </div>
        </div>
      )}

      {/* ── Main split: Raw Fields + Framework Map ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        marginBottom: 20,
      }}>

        {/* Left — Raw Data Fields */}
        <div style={panel}>
          <SectionTitle>Raw Data Fields</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
              : rawFields.map((f) => <FieldRow key={f.id} {...f} />)
            }
          </div>
        </div>

        {/* Right — Framework Mapping */}
        <div style={panel}>
          <SectionTitle>Framework Mapping</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {loading
              ? FRAMEWORKS.map(f => (
                  <div key={f.key}>
                    <div style={{ height: 10, width: '40%', background: '#efefef', borderRadius: 4, marginBottom: 10, animation: 'shimmer 1.4s ease infinite' }} />
                    {Array.from({ length: 3 }).map((_, i) => <RowSkeleton key={i} />)}
                  </div>
                ))
              : FRAMEWORKS.map(({ key, label }) => (
                  <FrameworkSection
                    key={key}
                    label={label}
                    items={frameworkMap[key] ?? []}
                  />
                ))
            }
          </div>
        </div>

      </div>

      {/* ── Responsive overrides ── */}
      <style>{`
        @media (max-width: 768px) {
          .mapping-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

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
          transition: 'opacity 0.2s',
        }}>
          {toast.type === 'success'
            ? <CheckCircle size={14} color="#4ade80" />
            : <AlertTriangle size={14} color="#fbbf24" />
          }
          {toast.message}
        </div>
      )}

    </div>
  );
}