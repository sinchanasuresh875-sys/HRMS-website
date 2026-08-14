import OrganizationStatusBadge from './OrganizationStatusBadge';
import DataTable from '../../../components/common/DataTable';

export default function OrganizationTable({
  organizations = [],
  onView,
  onEdit,
  onToggleStatus,
  onDelete
}) {
  const columns = [
    {
      key: 'organization',
      title: 'Organization',
      render: (org) => (
        <div className="org-table-cell-main">
          <img
            src={org.logo}
            alt={org.name}
            className="org-table-logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}&background=6366f1&color=fff`;
            }}
          />
          <div className="org-table-name-group">
            <span className="org-table-name">{org.name}</span>
            <span className="org-table-code">{org.code}</span>
          </div>
        </div>
      )
    },
    {
      key: 'industry',
      title: 'Industry & Type',
      render: (org) => (
        <div className="org-table-industry-group">
          <span className="org-industry-tag">{org.industry || 'N/A'}</span>
          <span className="org-type-subtext">{org.type || 'Standard'}</span>
        </div>
      )
    },
    {
      key: 'contact',
      title: 'Contact Information',
      render: (org) => (
        <div className="org-table-contact">
          <a href={`mailto:${org.email}`} className="org-contact-link" onClick={(e) => e.stopPropagation()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>{org.email}</span>
          </a>
          <div className="org-contact-sub">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span>{org.phone}</span>
          </div>
        </div>
      )
    },
    {
      key: 'location',
      title: 'Location',
      render: (org) => (
        <div className="org-location-text">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loc-icon">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>
            {org.city}{org.state ? `, ${org.state}` : ''}, {org.country}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      align: 'center',
      render: (org) => <OrganizationStatusBadge status={org.status} />
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'right',
      render: (org) => (
        <div className="org-actions-cell">
          <button
            type="button"
            className="action-btn action-view"
            onClick={() => onView(org)}
            title="View details"
            aria-label={`View details for ${org.name}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>

          <button
            type="button"
            className="action-btn action-edit"
            onClick={() => onEdit(org)}
            title="Edit organization"
            aria-label={`Edit ${org.name}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>

          <button
            type="button"
            className={`action-btn ${org.status === 'Active' ? 'action-deactivate' : 'action-activate'}`}
            onClick={() => onToggleStatus(org)}
            title={org.status === 'Active' ? 'Deactivate organization' : 'Activate organization'}
            aria-label={`${org.status === 'Active' ? 'Deactivate' : 'Activate'} ${org.name}`}
          >
            {org.status === 'Active' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="10" y1="15" x2="10" y2="9"></line>
                <line x1="14" y1="15" x2="14" y2="9"></line>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>

          <button
            type="button"
            className="action-btn action-delete"
            onClick={() => onDelete(org)}
            title="Delete organization"
            aria-label={`Delete ${org.name}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      )
    }
  ];

  return <DataTable columns={columns} data={organizations} keyField="id" />;
}
