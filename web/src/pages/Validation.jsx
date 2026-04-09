// pages/DataValidation.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Replace PLACEHOLDER_RECORDS with:
//   useEffect(() => { fetch('/api/validation/records').then(...).then(setRecords) }, [])
// Approve action:
//   POST /api/validation/approve  { recordIds: [...] }
// Save edit:
//   PATCH /api/validation/records/:id  { supplier, category, amount }
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Check, X, Upload, CheckSquare, ChevronUp, ChevronDown } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { BtnPrimary, BtnSecondary, Badge, MonoLabel, Toast } from '../components/ui';

// ── Placeholder data (replace with API) ──────────────────────────────────────

const PLACEHOLDER_RECORDS = [
  { id: 1, invoiceNo: 'INV-001', supplier: 'ABC Corp',  category: 'Office Supplies', amount: 50000,  status: 'valid'   },
  { id: 2, invoiceNo: 'INV-002', supplier: 'XYZ Ltd',   category: 'IT Services',     amount: 75000,  status: 'missing' },
  { id: 3, invoiceNo: 'INV-003', supplier: 'DEF Inc',   category: 'Marketing',       amount: 30000,  status: 'error'   },
  { id: 4, invoiceNo: 'INV-004', supplier: 'GHI Corp',  category: 'Travel',          amount: 90000,  status: 'valid'   },
  { id: 5, invoiceNo: 'INV-005', supplier: 'JKL Ltd',   category: 'Consulting',      amount: 45000,  status: 'missing' },
  { id: 6, invoiceNo: 'INV-006', supplier: 'MNO Pvt',  category: 'Raw Materials',   amount: 120000, status: 'valid'   },
  { id: 7, invoiceNo: 'INV-007', supplier: 'PQR Ltd',   category: 'Logistics',       amount: 18000,  status: 'error'   },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n) =>
  '₹' + Number(n).toLocaleString('en-IN');

// Status → badge variant in our 3-colour system:
//   valid   → ok (green)
//   missing → warn (black text on grey)
//   error   → dark (black bg, white text)
const statusVariant = { valid: 'ok', missing: 'warn', error: 'dark' };
const statusLabel   = { valid: 'Valid', missing: 'Missing', error: 'Error' };

const COLS = [
  { key: 'invoiceNo', label: 'Invoice No', mono: true  },
  { key: 'supplier',  label: 'Supplier',   mono: false },
  { key: 'category',  label: 'Category',   mono: false },
  { key: 'amount',    label: 'Amount',     mono: true  },
  { key: 'status',    label: 'Status',     mono: false },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StatTile({ label, value, variant }) {
  const colors = {
    ok:      { num: '#059669', bg: '#f0fdf4' },
    warn:    { num: '#0a0a0a', bg: '#f5f5f5' },
    neutral: { num: '#0a0a0a', bg: '#f5f5f5' },
  };
  const c = colors[variant] ?? colors.neutral;
  return (
    <div style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: '18px 22px', background: c.bg, flex: 1 }}>
      <MonoLabel>{label}</MonoLabel>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', color: c.num, margin: '10px 0 0' }}>
        {value}
      </p>
    </div>
  );
}

function SortIcon({ direction }) {
  if (!direction) return <ChevronUp style={{ width: 12, height: 12, color: '#d4d4d4' }} />;
  return direction === 'asc'
    ? <ChevronUp   style={{ width: 12, height: 12, color: '#0a0a0a' }} />
    : <ChevronDown style={{ width: 12, height: 12, color: '#0a0a0a' }} />;
}

function EditInput({ value, onChange, mono = false }) {
  return (
    <input
      value={value}
      onChange={onChange}
      style={{
        padding: '6px 10px', borderRadius: 6,
        border: '1px solid #059669', outline: 'none',
        fontFamily: mono ? "'DM Mono', monospace" : "'DM Sans', sans-serif",
        fontSize: 13, color: '#0a0a0a', background: '#fff',
        width: '100%', transition: 'border-color 0.15s',
      }}
    />
  );
}

function FilterBar({ active, onChange, counts }) {
  const filters = [
    { key: 'all',     label: 'All',     count: counts.all     },
    { key: 'valid',   label: 'Valid',   count: counts.valid   },
    { key: 'missing', label: 'Missing', count: counts.missing },
    { key: 'error',   label: 'Error',   count: counts.error   },
  ];
  return (
    <div style={{ display: 'flex', gap: 4, padding: 4, background: '#f5f5f5', borderRadius: 8, width: 'fit-content' }}>
      {filters.map(({ key, label, count }) => {
        const on = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 6, border: 'none',
              background: on ? '#fff' : 'transparent',
              color: on ? '#0a0a0a' : '#737373',
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
              cursor: 'pointer',
              boxShadow: on ? '0 1px 3px rgba(0,0,0,0.07)' : 'none',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {label}
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600,
              padding: '1px 6px', borderRadius: 4,
              background: on ? '#f5f5f5' : 'transparent',
              color: on ? '#0a0a0a' : '#a3a3a3',
            }}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DataValidation() {
  const navigate = useNavigate();

  // ── API state ──
  const [records,    setRecords   ] = useState(PLACEHOLDER_RECORDS);
  const [loading,    setLoading   ] = useState(false);
  const [approving,  setApproving ] = useState(false);
  const [editingId,  setEditingId ] = useState(null);
  const [editVals,   setEditVals  ] = useState({ supplier: '', category: '', amount: '' });
  const [filter,     setFilter    ] = useState('all');
  const [sortCol,    setSortCol   ] = useState(null);
  const [sortDir,    setSortDir   ] = useState('asc');
  const [selected,   setSelected  ] = useState(new Set());
  const [toast,      setToast     ] = useState({ visible: false, message: '', ok: true });

  // ── Derived stats ──

  const counts = useMemo(() => ({
    all:     records.length,
    valid:   records.filter(r => r.status === 'valid').length,
    missing: records.filter(r => r.status === 'missing').length,
    error:   records.filter(r => r.status === 'error').length,
  }), [records]);

  // ── Filter + sort ──

  const visible = useMemo(() => {
    let rows = filter === 'all' ? records : records.filter(r => r.status === filter);
    if (sortCol) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortCol], bv = b[sortCol];
        const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return rows;
  }, [records, filter, sortCol, sortDir]);

  // ── Handlers ──

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditVals({ supplier: item.supplier, category: item.category, amount: item.amount });
  };

  const saveEdit = async () => {
    const updated = { ...editVals, amount: Number(editVals.amount) };
    setRecords(prev => prev.map(r => r.id === editingId
      ? { ...r, ...updated, status: 'valid' }
      : r
    ));
    // TODO: await fetch(`/api/validation/records/${editingId}`, { method: 'PATCH', body: JSON.stringify(updated), headers: { 'Content-Type': 'application/json' } });
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const showToast = (msg, ok = true) => {
    setToast({ visible: true, message: msg, ok });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  const handleApprove = async () => {
    const ids = selected.size > 0 ? [...selected] : records.filter(r => r.status === 'valid').map(r => r.id);
    if (!ids.length) { showToast('No valid records to approve', false); return; }
    setApproving(true);
    try {
      // TODO: await fetch('/api/validation/approve', { method: 'POST', body: JSON.stringify({ recordIds: ids }), headers: { 'Content-Type': 'application/json' } });
      await new Promise(r => setTimeout(r, 600));
      showToast(`${ids.length} record${ids.length > 1 ? 's' : ''} approved`);
      setSelected(new Set());
    } catch (err) {
      showToast(`Approve failed: ${err.message}`, false);
    } finally {
      setApproving(false);
    }
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSelected = visible.length > 0 && visible.every(r => selected.has(r.id));
  const toggleAll   = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(visible.map(r => r.id)));
  };

  // ── Render ──

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#0a0a0a' }}>

      <PageHeader
        eyebrow="Step 2 of 4"
        title="Data Validation"
        subtitle="Review and correct records before processing"
        actions={
          <>
            <BtnSecondary onClick={() => navigate('/upload')}>
              <Upload style={{ width: 14, height: 14 }} />
              Re-upload
            </BtnSecondary>
            <BtnPrimary onClick={handleApprove} disabled={approving}>
              <CheckSquare style={{ width: 14, height: 14 }} />
              {approving ? 'Approving…' : selected.size > 0 ? `Approve ${selected.size}` : 'Approve Valid'}
            </BtnPrimary>
          </>
        }
      />

      {/* ── Stat tiles ── */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatTile label="Valid"   value={counts.valid}   variant="ok"      />
        <StatTile label="Missing" value={counts.missing} variant="warn"    />
        <StatTile label="Errors"  value={counts.error}   variant="warn"    />
        <StatTile label="Total"   value={counts.all}     variant="neutral" />
      </div>

      {/* ── Filter bar ── */}
      <div style={{ marginBottom: 16 }}>
        <FilterBar active={filter} onChange={setFilter} counts={counts} />
      </div>

      {/* ── Table ── */}
      <div style={{ border: '1px solid #e5e5e5', borderRadius: 10, background: '#fff', overflow: 'hidden', marginBottom: 24 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <MonoLabel color="#a3a3a3">Loading records…</MonoLabel>
          </div>
        ) : visible.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <MonoLabel color="#d4d4d4">No records match this filter</MonoLabel>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 640 }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e5e5' }}>
                  {/* Checkbox col */}
                  <th style={{ padding: '11px 16px', width: 40 }}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      style={{ cursor: 'pointer', accentColor: '#059669' }}
                    />
                  </th>
                  {COLS.map(({ key, label }) => (
                    <th
                      key={key}
                      onClick={() => toggleSort(key)}
                      style={{
                        padding: '11px 16px', textAlign: 'left',
                        fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500,
                        color: sortCol === key ? '#0a0a0a' : '#737373',
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        cursor: 'pointer', userSelect: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {label}
                        <SortIcon direction={sortCol === key ? sortDir : null} />
                      </span>
                    </th>
                  ))}
                  <th style={{ padding: '11px 16px', fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#737373', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item, i) => {
                  const isEditing = editingId === item.id;
                  const isLast    = i === visible.length - 1;
                  const isSel     = selected.has(item.id);

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: isLast ? 'none' : '1px solid #f5f5f5',
                        background: isSel ? '#f9fffe' : isEditing ? '#fafffe' : '#fff',
                        transition: 'background 0.15s',
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: '12px 16px' }}>
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => toggleSelect(item.id)}
                          style={{ cursor: 'pointer', accentColor: '#059669' }}
                        />
                      </td>

                      {/* Invoice No */}
                      <td style={{ padding: '12px 16px', fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#737373', whiteSpace: 'nowrap' }}>
                        {item.invoiceNo}
                      </td>

                      {/* Supplier */}
                      <td style={{ padding: '12px 16px', maxWidth: 160 }}>
                        {isEditing ? (
                          <EditInput value={editVals.supplier} onChange={e => setEditVals(p => ({ ...p, supplier: e.target.value }))} />
                        ) : (
                          <span style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a' }}>{item.supplier}</span>
                        )}
                      </td>

                      {/* Category */}
                      <td style={{ padding: '12px 16px', maxWidth: 160 }}>
                        {isEditing ? (
                          <EditInput value={editVals.category} onChange={e => setEditVals(p => ({ ...p, category: e.target.value }))} />
                        ) : (
                          <span style={{ fontSize: 13, color: '#525252' }}>{item.category}</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        {isEditing ? (
                          <EditInput value={editVals.amount} onChange={e => setEditVals(p => ({ ...p, amount: e.target.value }))} mono />
                        ) : (
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, color: '#0a0a0a' }}>
                            {fmt(item.amount)}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px' }}>
                        <Badge variant={statusVariant[item.status] ?? 'neutral'}>
                          {statusLabel[item.status] ?? item.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 16px' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: 4 }}>
                            <IconBtn onClick={saveEdit}   color="#059669" hoverBg="#f0fdf4" aria="Save"><Check style={{ width: 14, height: 14 }} /></IconBtn>
                            <IconBtn onClick={cancelEdit} color="#737373" hoverBg="#f5f5f5" aria="Cancel"><X style={{ width: 14, height: 14 }} /></IconBtn>
                          </div>
                        ) : (
                          <IconBtn onClick={() => startEdit(item)} color="#a3a3a3" hoverBg="#f5f5f5" hoverColor="#0a0a0a" aria="Edit">
                            <Edit2 style={{ width: 14, height: 14 }} />
                          </IconBtn>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Footer summary ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid #f0f0f0', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <MonoLabel>{counts.all} total</MonoLabel>
          <span style={{ color: '#d4d4d4' }}>·</span>
          <MonoLabel color="#059669">{counts.valid} valid</MonoLabel>
          <span style={{ color: '#d4d4d4' }}>·</span>
          <MonoLabel color="#0a0a0a">{counts.missing + counts.error} need attention</MonoLabel>
        </div>
        {selected.size > 0 && (
          <MonoLabel color="#059669">{selected.size} selected</MonoLabel>
        )}
      </div>

      <Toast
        visible={toast.visible}
        message={toast.message}
        icon={<CheckSquare style={{ width: 15, height: 15, color: toast.ok ? '#059669' : '#e5e5e5' }} />}
      />
    </div>
  );
}

// ── Icon button helper ────────────────────────────────────────────────────────

function IconBtn({ children, onClick, color, hoverBg, hoverColor, aria }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={aria}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 28, height: 28, borderRadius: 6,
        border: 'none', cursor: 'pointer',
        background: hov && hoverBg ? hoverBg : 'transparent',
        color: hov && hoverColor ? hoverColor : color,
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      {children}
    </button>
  );
}