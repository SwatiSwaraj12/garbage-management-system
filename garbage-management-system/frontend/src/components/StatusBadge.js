// StatusBadge.js - Colored badge showing request status
import React from 'react';

const statusConfig = {
  PENDING:     { label: 'Pending',     className: 'badge-pending',     dot: '#f59e0b' },
  IN_PROGRESS: { label: 'In Progress', className: 'badge-in_progress', dot: '#3b82f6' },
  COMPLETED:   { label: 'Completed',   className: 'badge-completed',   dot: '#16a34a' },
  CANCELLED:   { label: 'Cancelled',   className: 'badge-cancelled',   dot: '#9ca3af' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.PENDING;
  return (
    <span className={`badge ${config.className}`}>
      <span style={{ width:7, height:7, borderRadius:'50%', background:config.dot, display:'inline-block' }} />
      {config.label}
    </span>
  );
}
