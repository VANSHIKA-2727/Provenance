import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Truck, Recycle, X, CheckCircle, AlertCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { BtnPrimary, BtnSecondary, Badge, MonoLabel, Toast } from '../components/ui';

// ── Config ────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'gst',      label: 'GST Invoices',    icon: FileText },
  { id: 'utility',  label: 'Utility Bills',   icon: FileText },
  { id: 'shipment', label: 'Shipment Logs',   icon: Truck    },
  { id: 'plastic',  label: 'Plastic Records', icon: Recycle  },
];

const ACCEPTED = '.csv,.xlsx,.xls,.pdf';
const MAX_MB   = 10;
const MAX_BYTES = MAX_MB * 1024 * 1024;

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtSize(bytes) {
  if (bytes < 1024)          return `${bytes} B`;
  if (bytes < 1024 * 1024)   return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function fileExt(name) {
  return name.split('.').pop().toLowerCase();
}

function validateFile(file) {
  if (file.size > MAX_BYTES)
    return `Exceeds ${MAX_MB} MB limit`;
  const allowed = ['csv', 'xlsx', 'xls', 'pdf'];
  if (!allowed.includes(fileExt(file.name)))
    return 'Unsupported file type';
  return null;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TabBar({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 2, padding: 4, background: '#f5f5f5', borderRadius: 8, width: 'fit-content' }}>
      {TABS.map(({ id, label, icon: Icon }) => {
        const on = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 14px', borderRadius: 6, border: 'none',
              background: on ? '#fff' : 'transparent',
              color: on ? '#0a0a0a' : '#737373',
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
              cursor: 'pointer',
              boxShadow: on ? '0 1px 3px rgba(0,0,0,0.07)' : 'none',
              transition: 'background 0.15s, color 0.15s, box-shadow 0.15s',
            }}
          >
            <Icon style={{ width: 14, height: 14, flexShrink: 0 }} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function DropZone({ isDragOver, onDragOver, onDragLeave, onDrop, onSelect }) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        border: `1.5px dashed ${isDragOver ? '#059669' : '#e5e5e5'}`,
        borderRadius: 12,
        padding: '52px 32px',
        textAlign: 'center',
        background: isDragOver ? '#f0fdf4' : '#fafafa',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: isDragOver ? '#dcfce7' : '#f0f0f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px',
        transition: 'background 0.2s',
      }}>
        <Upload style={{ width: 20, height: 20, color: isDragOver ? '#059669' : '#a3a3a3' }} />
      </div>

      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: '#0a0a0a', margin: '0 0 6px' }}>
        Drop files here or{' '}
        <label
          htmlFor="file-upload"
          style={{ color: '#059669', cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
        >
          browse
        </label>
      </p>
      <MonoLabel color="#a3a3a3">CSV · XLSX · XLS · PDF · max {MAX_MB} MB each</MonoLabel>

      <input
        type="file" id="file-upload" multiple accept={ACCEPTED}
        onChange={onSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
}

function FileRow({ file, onRemove }) {
  const [hov, setHov] = useState(false);
  const hasError = !!file.error;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '11px 14px', borderRadius: 8,
        background: hov ? '#fafafa' : '#fff',
        border: `1px solid ${hasError ? '#e5e5e5' : '#f0f0f0'}`,
        transition: 'background 0.15s',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        {/* status dot */}
        <div style={{
          width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
          background: hasError ? '#0a0a0a' : file.status === 'uploading' ? '#a3a3a3' : '#059669',
          transition: 'background 0.2s',
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#0a0a0a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file.name}
          </p>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: hasError ? '#0a0a0a' : '#a3a3a3', margin: '3px 0 0', letterSpacing: '0.04em' }}>
            {hasError ? file.error : fmtSize(file.size)}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <Badge variant={hasError ? 'warn' : file.status === 'ready' ? 'ok' : 'neutral'}>
          {hasError ? 'Invalid' : file.status === 'ready' ? 'Ready' : 'Queued'}
        </Badge>
        <button
          onClick={() => onRemove(file.id)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: hov ? '#0a0a0a' : '#d4d4d4',
            lineHeight: 1, padding: '2px 4px', fontSize: 16,
            transition: 'color 0.15s',
          }}
          aria-label={`Remove ${file.name}`}
        >
          <X style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UploadData() {
  const navigate = useNavigate();
  const [activeTab,   setActiveTab  ] = useState('gst');
  const [files,       setFiles      ] = useState([]);
  const [isDragOver,  setIsDragOver ] = useState(false);
  const [processing,  setProcessing ] = useState(false);
  const [toast,       setToast      ] = useState({ visible: false, message: '', ok: true });

  // ── File management ──

  const addFiles = useCallback((rawFiles) => {
    const next = Array.from(rawFiles).map((f, i) => {
      const err = validateFile(f);
      return {
        id:     `${Date.now()}-${i}`,
        name:   f.name,
        size:   f.size,
        raw:    f,
        status: err ? 'error' : 'ready',
        error:  err ?? null,
        tab:    activeTab,
      };
    });
    setFiles((prev) => [...prev, ...next]);
  }, [activeTab]);

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));
  const clearAll   = ()   => setFiles([]);

  const handleDragOver  = useCallback((e) => { e.preventDefault(); setIsDragOver(true);  }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragOver(false); }, []);
  const handleDrop      = useCallback((e) => { e.preventDefault(); setIsDragOver(false); addFiles(e.dataTransfer.files); }, [addFiles]);
  const handleSelect    = (e) => { addFiles(e.target.files); e.target.value = ''; };

  // ── Upload ──

  const readyFiles = files.filter((f) => f.status === 'ready');
  const hasValid   = readyFiles.length > 0;

  const showToast = (message, ok = true) => {
    setToast({ visible: true, message, ok });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  };

  const handleProcess = async () => {
    if (!hasValid) return;
    setProcessing(true);
    try {
      // TODO: replace with real API call
      // const form = new FormData();
      // readyFiles.forEach(f => form.append('files', f.raw));
      // form.append('type', activeTab);
      // await fetch('/api/upload', { method: 'POST', body: form });
      await new Promise((r) => setTimeout(r, 800)); // remove once API is wired
      showToast(`${readyFiles.length} file${readyFiles.length > 1 ? 's' : ''} uploaded successfully`);
      setTimeout(() => navigate('/validation'), 1200);
    } catch (err) {
      showToast(`Upload failed: ${err.message}`, false);
    } finally {
      setProcessing(false);
    }
  };

  const tabFiles = files.filter((f) => f.tab === activeTab);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#0a0a0a' }}>

      <PageHeader
        eyebrow="Step 1 of 4"
        title="Upload Data"
        subtitle={`CSV, XLSX, PDF · Max ${MAX_MB} MB per file`}
      />

      {/* ── Tabs ── */}
      <div style={{ marginBottom: 24 }}>
        <TabBar active={activeTab} onChange={setActiveTab} />
      </div>

      {/* ── Two-column layout: drop zone left, file list right ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start', marginBottom: 24 }}>

        {/* Left: drop zone + type hint */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <DropZone
            isDragOver={isDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onSelect={handleSelect}
          />
          <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: '14px 16px', background: '#fafafa' }}>
            <MonoLabel color="#0a0a0a">{TABS.find(t => t.id === activeTab)?.label}</MonoLabel>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#737373', margin: '8px 0 0', lineHeight: 1.5 }}>
              {tabHints[activeTab]}
            </p>
          </div>
        </div>

        {/* Right: file queue */}
        <div style={{ border: '1px solid #e5e5e5', borderRadius: 10, background: '#fff', overflow: 'hidden', minHeight: 220 }}>
          {/* Header row */}
          <div style={{ padding: '13px 18px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
            <MonoLabel>
              {tabFiles.length > 0
                ? `${tabFiles.length} file${tabFiles.length > 1 ? 's' : ''} queued`
                : 'No files yet'}
            </MonoLabel>
            {tabFiles.length > 0 && (
              <button
                onClick={clearAll}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500, color: '#737373', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#0a0a0a'}
                onMouseLeave={e => e.currentTarget.style.color = '#737373'}
              >
                Clear All
              </button>
            )}
          </div>

          {/* File rows */}
          {tabFiles.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, flexDirection: 'column', gap: 8 }}>
              <MonoLabel color="#d4d4d4">Drop files to add them</MonoLabel>
            </div>
          ) : (
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 340, overflowY: 'auto' }}>
              {tabFiles.map((f) => (
                <FileRow key={f.id} file={f} onRemove={removeFile} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── All-tabs summary (only when files across tabs) ── */}
      {files.length > 0 && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          {TABS.map(({ id, label }) => {
            const count = files.filter(f => f.tab === id).length;
            if (!count) return null;
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', border: '1px solid #e5e5e5', borderRadius: 6, background: '#fafafa' }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: '#0a0a0a' }}>{label}</span>
                <Badge variant="neutral">{count}</Badge>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 10 }}>
        <BtnSecondary onClick={() => navigate('/validation')}>View Validation</BtnSecondary>
        <BtnPrimary
          onClick={handleProcess}
          disabled={!hasValid || processing}
          style={{ background: processing ? '#737373' : undefined }}
        >
          {processing ? 'Uploading…' : `Process ${hasValid ? readyFiles.length + ' file' + (readyFiles.length > 1 ? 's' : '') : 'Files'}`}
        </BtnPrimary>
      </div>

      <Toast
        visible={toast.visible}
        message={toast.message}
        icon={toast.ok
          ? <CheckCircle style={{ width: 15, height: 15, color: '#059669' }} />
          : <AlertCircle style={{ width: 15, height: 15, color: '#e5e5e5' }} />}
      />

      <style>{`
        @media (max-width: 720px) {
          .upload-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const tabHints = {
  gst:      'Upload your GST purchase register exports. Provenance maps each line item to the correct EPR category.',
  utility:  'Monthly electricity, gas, and water bills. Used to compute Scope 2 and Scope 3 emissions.',
  shipment: 'Outbound shipment manifests or logistics reports. Used for transport emission factors.',
  plastic:  'Plastic packaging weight records by SKU. Drives quarterly PWM liability calculations.',
};