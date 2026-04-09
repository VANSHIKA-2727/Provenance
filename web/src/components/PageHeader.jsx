// components/PageHeader.jsx
// Shared header used on every interior page.
// Props:
//   eyebrow  – small mono label above title (e.g. "FY 2024–25")
//   title    – main page heading
//   subtitle – muted mono line below title
//   actions  – React node rendered on the right (buttons, etc.)

export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingBottom: 28,
        borderBottom: '1px solid #f0f0f0',
        marginBottom: 32,
        gap: 24,
        flexWrap: 'wrap',
      }}
    >
      <div>
        {eyebrow && (
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              fontWeight: 500,
              color: '#059669',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: '0 0 10px',
            }}
          >
            {eyebrow}
          </p>
        )}
        <h1
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: '#0a0a0a',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: '#a3a3a3',
              margin: '8px 0 0',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  );
}