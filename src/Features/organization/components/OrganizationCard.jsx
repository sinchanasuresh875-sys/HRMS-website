import OrganizationStatusBadge from './OrganizationStatusBadge';

export default function OrganizationCard({
  organization,
  onView,
  onEdit,
  onToggleStatus,
  onDelete
}) {
  const org = organization;

  return (
    <div className="org-card">
      <div className="org-card-header">
        <div className="org-card-brand">
          <img
            src={org.logo}
            alt={org.name}
            className="org-card-logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}&background=6366f1&color=fff`;
            }}
          />
          <div>
            <h4 className="org-card-title">{org.name}</h4>
            <span className="org-card-code">{org.code}</span>
          </div>
        </div>
        <OrganizationStatusBadge status={org.status} />
      </div>

      <div className="org-card-body">
        <div className="org-card-info-row">
          <span className="info-label">Industry:</span>
          <span className="org-industry-tag">{org.industry || 'N/A'}</span>
        </div>

        <div className="org-card-info-row">
          <span className="info-label">Contact:</span>
          <span className="info-val">{org.email}</span>
        </div>

        <div className="org-card-info-row">
          <span className="info-label">Phone:</span>
          <span className="info-val">{org.phone}</span>
        </div>

        <div className="org-card-info-row">
          <span className="info-label">Location:</span>
          <span className="info-val">
            {org.city}{org.state ? `, ${org.state}` : ''}, {org.country}
          </span>
        </div>
      </div>

      <div className="org-card-footer">
        <button
          type="button"
          className="org-card-btn btn-view"
          onClick={() => onView(org)}
          title="View details"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span>View</span>
        </button>

        <button
          type="button"
          className="org-card-btn btn-edit"
          onClick={() => onEdit(org)}
          title="Edit organization"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span>Edit</span>
        </button>

        <button
          type="button"
          className={`org-card-btn ${org.status === 'Active' ? 'btn-status-deactivate' : 'btn-status-activate'}`}
          onClick={() => onToggleStatus(org)}
          title={org.status === 'Active' ? 'Deactivate organization' : 'Activate organization'}
        >
          {org.status === 'Active' ? (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="10" y1="15" x2="10" y2="9"></line>
                <line x1="14" y1="15" x2="14" y2="9"></line>
              </svg>
              <span>Deactivate</span>
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Activate</span>
            </>
          )}
        </button>

        <button
          type="button"
          className="org-card-btn btn-delete"
          onClick={() => onDelete(org)}
          title="Delete organization"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
