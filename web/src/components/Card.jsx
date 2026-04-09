const ACCENT = {
  green: { bg: '#ecfdf5', text: '#059669' },
  amber: { bg: '#fffbeb', text: '#d97706' },
  red:   { bg: '#fef2f2', text: '#dc2626' },
  blue:  { bg: '#eff6ff', text: '#2563eb' },
};

export const Card = ({ children, style, ...props }) => (
  <div
    style={{
      border: '1px solid #e5e5e5',
      borderRadius: 10,
      padding: 24,
      background: '#fff',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const StatCard = ({ label, value, delta, deltaLabel, color = 'green' }) => {
  const { bg, text } = ACCENT[color] ?? ACCENT.green;
  const isPositive = delta >= 0;
  const deltaColor = isPositive ? '#059669' : '#dc2626';

  return (
    <div style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 24, background: '#fff' }}>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500, color: '#737373', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
        {label}
      </p>
      <p style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: '#0a0a0a', margin: '0 0 10px' }}>
        {value}
      </p>
      {delta !== undefined && (
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, color: deltaColor, margin: 0 }}>
          {isPositive ? '+' : ''}{delta}%
          {deltaLabel && <span style={{ color: '#a3a3a3', fontWeight: 400, marginLeft: 6 }}>{deltaLabel}</span>}
        </p>
      )}
    </div>
  );
};

export default Card;