export default function OrganizationStatusBadge({ status }) {
  const isActive = String(status).toLowerCase() === 'active';

  return (
    <span className={`org-status-pill ${isActive ? 'org-status-active' : 'org-status-inactive'}`}>
      <span className="org-status-dot" />
      {status}
    </span>
  );
}
