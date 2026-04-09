const getColor = (value, color) => {
  if (color) return color;
  if (value > 80) return '#059669';
  if (value > 50) return '#d97706';
  return '#dc2626';
};

export default function ProgressBar({ value, color, label, showValue = true }) {
  const fillColor = getColor(value, color);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color: '#737373', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {label}
            </span>
          )}
          {showValue && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, color: '#0a0a0a' }}>
              {value}%
            </span>
          )}
        </div>
      )}
      <div style={{ height: 3, borderRadius: 99, background: '#e5e5e5', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 99, background: fillColor, width: `${value}%` }} />
      </div>
    </div>
  );
}