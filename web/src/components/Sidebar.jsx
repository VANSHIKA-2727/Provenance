import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { label: 'Dashboard',          path: '/dashboard',  icon: 'dashboard'  },
  { label: 'Upload Data',        path: '/upload',     icon: 'upload'     },
  { label: 'Validation',         path: '/validation', icon: 'check'      },
  { label: 'Compliance Mapping', path: '/mapping',    icon: 'map'        },
  { label: 'Reports',            path: '/reports',    icon: 'file'       },
  { label: 'Insights',           path: '/insights',   icon: 'chart'      },
  // { label: 'Audit History',      path: '/history',    icon: 'history'    },
  { label: 'Settings',           path: '/settings',   icon: 'settings'   },
];

// Inline SVG icons — no lucide dependency needed
const Icon = ({ name, size = 16 }) => {
  const s = { width: size, height: size, flexShrink: 0 };
  const props = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', style: s };
  switch (name) {
    case 'dashboard': return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case 'upload':    return <svg {...props}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
    case 'check':     return <svg {...props}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>;
    case 'map':       return <svg {...props}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
    case 'file':      return <svg {...props}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    case 'chart':     return <svg {...props}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    // case 'history':   return <svg {...props}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>;
    case 'settings':  return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
    case 'collapse':  return <svg {...props}><polyline points="15 18 9 12 15 6"/></svg>;
    case 'expand':    return <svg {...props}><polyline points="9 18 15 12 9 6"/></svg>;
    default:          return null;
  }
};

export default function Sidebar({ isCollapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .sidebar-root {
          position: fixed; left: 0; top: 60px;
          height: calc(100vh - 60px); z-index: 40;
          background: #fff; border-right: 1px solid #e5e5e5;
          display: flex; flex-direction: column;
          overflow: hidden;
          transition: width 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-nav { flex: 1; padding: 12px 10px; display: flex; flex-direction: column; gap: 2px; overflow: hidden; }

        .nav-btn {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 7px; border: none; cursor: pointer;
          background: transparent; color: #737373;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 400;
          text-align: left; white-space: nowrap; overflow: hidden;
          transition: background 0.15s, color 0.15s;
          position: relative;
        }
        .nav-btn:hover { background: #f5f5f5; color: #0a0a0a; }
        .nav-btn.active { background: #f0fdf4; color: #059669; font-weight: 500; }
        .nav-btn.active .nav-indicator {
          position: absolute; left: 0; top: 7px; bottom: 7px;
          width: 3px; border-radius: 99px; background: #059669;
        }
        .nav-label { overflow: hidden; transition: opacity 0.18s, width 0.22s; }
        .nav-label.hidden { opacity: 0; width: 0; }
        .nav-label.visible { opacity: 1; width: auto; }

        .sidebar-toggle-area {
          padding: 10px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: flex-end;
        }
        .toggle-btn {
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 6px; border: 1px solid #e5e5e5;
          background: #fafafa; color: #737373; cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
          flex-shrink: 0;
        }
        .toggle-btn:hover { background: #fff; border-color: #0a0a0a; color: #0a0a0a; }
      `}</style>

      <div
        className="sidebar-root"
        style={{ width: isCollapsed ? 56 : 216 }}
      >
        {/* ── Collapse toggle — top right of sidebar ── */}
        <div className="sidebar-toggle-area" style={{ justifyContent: isCollapsed ? 'center' : 'flex-end' }}>
          <button
            className="toggle-btn"
            onClick={onToggle}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name={isCollapsed ? 'expand' : 'collapse'} size={13} />
          </button>
        </div>

        {/* ── Nav items ── */}
        <nav className="sidebar-nav">
          {menuItems.map(({ label, path, icon }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                className={`nav-btn ${active ? 'active' : ''}`}
                onClick={() => navigate(path)}
                title={isCollapsed ? label : undefined}
                style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
              >
                {active && <span className="nav-indicator" />}
                <Icon name={icon} size={16} />
                <span className={`nav-label ${isCollapsed ? 'hidden' : 'visible'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}