const STATUS = {
  valid:   { cls: 'badge-success', label: 'Valid'    },
  success: { cls: 'badge-success', label: 'Success'  },
  warning: { cls: 'badge-warn',    label: 'Warning'  },
  missing: { cls: 'badge-warn',    label: 'Missing'  },
  error:   { cls: 'badge-error',   label: 'Error'    },
  pending: { cls: 'badge-neutral', label: 'Pending'  },
  neutral: { cls: 'badge-neutral', label: 'Neutral'  },
  info:    { cls: 'badge-info',    label: 'Info'     },
};

export default function StatusBadge({ status }) {
  const { cls, label } = STATUS[status] ?? STATUS.neutral;
  return (
    <span className={`badge ${cls}`}>
      <span className="dot" />
      {label}
    </span>
  );
}