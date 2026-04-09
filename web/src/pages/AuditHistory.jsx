import { useState, useMemo } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const auditData = [
  { id: 'AUD-2024-001', timestamp: '2024-01-15 14:30:22', user: 'john.doe@company.com', action: 'Data Upload', resource: 'Q4 Financial Reports', status: 'success' },
  { id: 'AUD-2024-002', timestamp: '2024-01-15 13:45:10', user: 'sarah.wilson@company.com', action: 'Compliance Check', resource: 'GDPR Compliance', status: 'warning' },
  { id: 'AUD-2024-003', timestamp: '2024-01-15 12:20:05', user: 'mike.johnson@company.com', action: 'Report Generation', resource: 'Monthly Compliance Report', status: 'success' },
  { id: 'AUD-2024-004', timestamp: '2024-01-15 11:15:33', user: 'admin@company.com', action: 'User Access', resource: 'User Management', status: 'success' },
  { id: 'AUD-2024-005', timestamp: '2024-01-15 10:45:18', user: 'lisa.brown@company.com', action: 'Data Validation', resource: 'Customer Data Set', status: 'error' },
  { id: 'AUD-2024-006', timestamp: '2024-01-15 09:30:44', user: 'john.doe@company.com', action: 'Report Generation', resource: 'EPR Q3 Filing', status: 'success' },
  { id: 'AUD-2024-007', timestamp: '2024-01-15 08:12:09', user: 'sarah.wilson@company.com', action: 'Data Upload', resource: 'Supplier Dispatch Records', status: 'warning' },
];

const ACTION_TYPES = ['All', 'Data Upload', 'Compliance Check', 'Report Generation', 'User Access', 'Data Validation'];
const STATUS_TYPES = ['All', 'success', 'warning', 'error'];

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    success: { label: 'Success', bg: '#ecfdf5', color: '#059669' },
    warning: { label: 'Warning', bg: '#fffbeb', color: '#d97706' },
    error:   { label: 'Error',   bg: '#fef2f2', color: '#dc2626' },
  };
  const s = map[status] ?? map.success;
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600,
      padding: '4px 10px', borderRadius: 4, textTransform: 'uppercase',
      letterSpacing: '0.06em', background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function History() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = useMemo(() => auditData.filter(item => {
    const q = search.toLowerCase();
    const matchSearch = !q || [item.user, item.action, item.resource, item.id]
      .some(f => f.toLowerCase().includes(q));
    const matchAction = actionFilter === 'All' || item.action === actionFilter;
    const matchStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchSearch && matchAction && matchStatus;
  }), [search, actionFilter, statusFilter]);

  const counts = useMemo(() => ({
    total:   filtered.length,
    success: filtered.filter(i => i.status === 'success').length,
    warning: filtered.filter(i => i.status === 'warning').length,
    error:   filtered.filter(i => i.status === 'error').length,
  }), [filtered]);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#0a0a0a', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #059669; color: #fff; }
        .mono { font-family: 'DM Mono', monospace; }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: #0a0a0a; font-size: 13px; font-weight: 500;
          padding: 10px 20px; border-radius: 6px; border: 1px solid #e5e5e5;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
        }
        .btn-outline:hover { border-color: #0a0a0a; background: #fafafa; }
        .btn-outline:active { transform: scale(0.98); }

        .search-wrap { position: relative; flex: 1; min-width: 200px; }
        .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; }

        .p-input {
          width: 100%; font-family: 'DM Sans', sans-serif; font-size: 13px;
          padding: 10px 14px; border: 1px solid #e5e5e5; border-radius: 6px;
          background: #fafafa; color: #0a0a0a; outline: none;
          transition: border-color 0.2s, background 0.2s;
          appearance: none; -webkit-appearance: none;
        }
        .p-input.has-icon { padding-left: 38px; }
        .p-input::placeholder { color: #a3a3a3; }
        .p-input:focus { border-color: #059669; background: #fff; }

        .select-wrap { position: relative; }
        .select-wrap::after {
          content: ''; position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%); pointer-events: none;
          border: 4px solid transparent; border-top-color: #a3a3a3;
          margin-top: 2px;
        }

        .stat-card { padding: 20px 24px; border: 1px solid #e5e5e5; border-radius: 10px; background: #fafafa; transition: border-color 0.2s; }
        .stat-card:hover { border-color: #d4d4d4; }

        .card { border: 1px solid #e5e5e5; border-radius: 12px; background: #fff; overflow: hidden; }

        .tbl-header { display: grid; grid-template-columns: 160px 1fr 1fr 1fr 100px; gap: 16px; padding: 12px 20px; background: #fafafa; border-bottom: 1px solid #f0f0f0; }
        .tbl-row { display: grid; grid-template-columns: 160px 1fr 1fr 1fr 100px; gap: 16px; padding: 14px 20px; border-bottom: 1px solid #f5f5f5; align-items: center; transition: background 0.15s; cursor: default; }
        .tbl-row:last-child { border-bottom: none; }
        .tbl-row:hover { background: #fafafa; }

        .empty-state { padding: 64px 24px; text-align: center; }

        @media (max-width: 900px) {
          .tbl-header, .tbl-row { grid-template-columns: 130px 1fr 80px !important; }
          .tbl-col-user, .tbl-col-resource { display: none; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .filter-row { flex-direction: column !important; }
          .header-row { flex-direction: column; align-items: flex-start !important; gap: 16px; }
        }
      `}</style>

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 32px 80px' }}>

        {/* ── Header ── */}
        <div className="header-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <span className="mono" style={{ fontSize: 11, fontWeight: 500, color: '#059669', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
              Provenance · KPI Trace
            </span>
            <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1, color: '#0a0a0a' }}>
              Audit History
            </h1>
            <p style={{ fontSize: 15, color: '#525252', marginTop: 10, lineHeight: 1.6 }}>
              Immutable log of all system actions, uploads, and compliance events.
            </p>
          </div>
          <button className="btn-outline" style={{ flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Log
          </button>
        </div>

        {/* ── Filters ── */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="filter-row" style={{ padding: '18px 20px', display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* Search */}
            <div className="search-wrap">
              <span className="search-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input
                className="p-input has-icon"
                type="text"
                placeholder="Search by user, action, resource or ID…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* Action filter */}
            <div className="select-wrap" style={{ flexShrink: 0 }}>
              <select className="p-input" style={{ paddingRight: 32, minWidth: 160 }} value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
                {ACTION_TYPES.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            {/* Status filter */}
            <div className="select-wrap" style={{ flexShrink: 0 }}>
              <select className="p-input" style={{ paddingRight: 32, minWidth: 120 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                {STATUS_TYPES.map(s => <option key={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'Total Events',  value: counts.total,   color: '#737373' },
            { label: 'Success',       value: counts.success, color: '#059669' },
            { label: 'Warnings',      value: counts.warning, color: '#d97706' },
            { label: 'Errors',        value: counts.error,   color: '#dc2626' },
          ].map((c, i) => (
            <div key={i} className="stat-card">
              <p className="mono" style={{ fontSize: 10, fontWeight: 500, color: '#737373', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                {c.label}
              </p>
              <p style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', color: c.color }}>
                {c.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="card">
          {/* Column headers */}
          <div className="tbl-header">
            {['Timestamp', 'Action', 'User', 'Resource', 'Status'].map((h, i) => (
              <span key={h} className={`mono ${i === 1 ? '' : i === 2 ? 'tbl-col-user' : i === 3 ? 'tbl-col-resource' : ''}`}
                style={{ fontSize: 10, fontWeight: 500, color: '#737373', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {h}
              </span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <p className="mono" style={{ fontSize: 12, color: '#a3a3a3', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                No events match your filters
              </p>
            </div>
          ) : (
            filtered.map(item => (
              <div key={item.id} className="tbl-row">
                {/* Timestamp */}
                <span className="mono" style={{ fontSize: 11, color: '#737373', letterSpacing: '0.04em' }}>
                  {item.timestamp}
                </span>
                {/* Action */}
                <div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', display: 'block' }}>
                    {item.action}
                  </span>
                  <span className="mono" style={{ fontSize: 10, color: '#a3a3a3', letterSpacing: '0.04em' }}>
                    {item.id}
                  </span>
                </div>
                {/* User */}
                <span className="tbl-col-user" style={{ fontSize: 13, color: '#525252' }}>
                  {item.user}
                </span>
                {/* Resource */}
                <span className="tbl-col-resource" style={{ fontSize: 13, color: '#525252' }}>
                  {item.resource}
                </span>
                {/* Status */}
                <span>
                  <StatusBadge status={item.status} />
                </span>
              </div>
            ))
          )}

          {/* Footer count */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
            <span className="mono" style={{ fontSize: 10, color: '#a3a3a3', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Showing {filtered.length} of {auditData.length} events
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}