export default function StatusBadge({ status, className = '' }) {
  const isAvailable = Boolean(status);
  const statusStr = isAvailable ? String(status) : 'Unknown';
  const isSuccess = statusStr.toLowerCase() === 'active';

  return (
    <span className={`status-badge ${isSuccess ? 'status-active' : 'status-inactive'} ${className}`.trim()}>
      <span className="status-dot"></span>
      {statusStr}
    </span>
  );
}
