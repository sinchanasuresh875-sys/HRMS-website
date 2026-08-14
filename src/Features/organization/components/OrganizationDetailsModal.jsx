import { useState } from 'react';
import Modal from '../../../components/common/Modal';
import OrganizationStatusBadge from './OrganizationStatusBadge';
import Button from '../../../components/common/Button';

export default function OrganizationDetailsModal({
  isOpen,
  onClose,
  organization,
  onEdit
}) {
  const [activeSection, setActiveSection] = useState('overview');

  if (!organization) return null;
  const org = organization;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Organization Profile"
      subtitle={`Detailed overview for ${org.name}`}
      maxWidth="750px"
    >
      <div className="org-details-container">
        {/* Profile Header Hero */}
        <div className="org-details-hero">
          <img
            src={org.logo}
            alt={org.name}
            className="hero-logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}&background=6366f1&color=fff`;
            }}
          />
          <div className="hero-content">
            <div className="hero-title-row">
              <h2 className="hero-name">{org.name}</h2>
              <OrganizationStatusBadge status={org.status} />
            </div>
            <div className="hero-meta">
              <span className="hero-code">{org.code}</span>
              <span className="bullet-dot">•</span>
              <span className="hero-industry">{org.industry}</span>
              <span className="bullet-dot">•</span>
              <span className="hero-type">{org.type}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              if (onEdit) onEdit(org);
            }}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            }
          >
            Edit Profile
          </Button>
        </div>

        {/* Navigation Pills */}
        <div className="details-nav-pills">
          <button
            type="button"
            className={`pill-btn ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={`pill-btn ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveSection('contact')}
          >
            Contact & Location
          </button>
          <button
            type="button"
            className={`pill-btn ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            Settings & System
          </button>
        </div>

        {/* Content Section: Overview */}
        {activeSection === 'overview' && (
          <div className="details-content-grid">
            <div className="details-card">
              <h4 className="card-section-title">Basic Information</h4>
              <div className="details-list">
                <div className="details-item">
                  <span className="item-label">Organization Name</span>
                  <span className="item-value">{org.name}</span>
                </div>
                <div className="details-item">
                  <span className="item-label">Organization Code</span>
                  <span className="item-value font-mono">{org.code}</span>
                </div>
                <div className="details-item">
                  <span className="item-label">Organization Type</span>
                  <span className="item-value">{org.type || 'N/A'}</span>
                </div>
                <div className="details-item">
                  <span className="item-label">Industry</span>
                  <span className="item-value">{org.industry || 'N/A'}</span>
                </div>
                <div className="details-item full-width">
                  <span className="item-label">Description</span>
                  <p className="item-value desc-text">{org.description || 'No description provided.'}</p>
                </div>
              </div>
            </div>

            <div className="details-card">
              <h4 className="card-section-title">Company Registration</h4>
              <div className="details-list">
                <div className="details-item">
                  <span className="item-label">Registration Number</span>
                  <span className="item-value">{org.registrationNumber || 'Not specified'}</span>
                </div>
                <div className="details-item">
                  <span className="item-label">Tax ID (TIN / EIN)</span>
                  <span className="item-value">{org.taxId || 'Not specified'}</span>
                </div>
                <div className="details-item">
                  <span className="item-label">Established Date</span>
                  <span className="item-value">
                    {org.establishedDate ? new Date(org.establishedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Section: Contact & Location */}
        {activeSection === 'contact' && (
          <div className="details-content-grid">
            <div className="details-card">
              <h4 className="card-section-title">Contact Information</h4>
              <div className="details-list">
                <div className="details-item">
                  <span className="item-label">Official Email</span>
                  <a href={`mailto:${org.email}`} className="item-link">
                    {org.email}
                  </a>
                </div>
                <div className="details-item">
                  <span className="item-label">Phone Number</span>
                  <span className="item-value">{org.phone}</span>
                </div>
                <div className="details-item">
                  <span className="item-label">Alternate Phone</span>
                  <span className="item-value">{org.alternatePhone || 'None'}</span>
                </div>
                <div className="details-item">
                  <span className="item-label">Official Website</span>
                  {org.website ? (
                    <a href={org.website.startsWith('http') ? org.website : `https://${org.website}`} target="_blank" rel="noopener noreferrer" className="item-link">
                      {org.website}
                    </a>
                  ) : (
                    <span className="item-value">None</span>
                  )}
                </div>
              </div>
            </div>

            <div className="details-card">
              <h4 className="card-section-title">Registered Address</h4>
              <div className="details-list">
                <div className="details-item full-width">
                  <span className="item-label">Address Lines</span>
                  <span className="item-value">
                    {org.addressLine1}
                    {org.addressLine2 ? `, ${org.addressLine2}` : ''}
                  </span>
                </div>
                <div className="details-item">
                  <span className="item-label">City</span>
                  <span className="item-value">{org.city}</span>
                </div>
                <div className="details-item">
                  <span className="item-label">State / Province</span>
                  <span className="item-value">{org.state}</span>
                </div>
                <div className="details-item">
                  <span className="item-label">Country</span>
                  <span className="item-value">{org.country}</span>
                </div>
                <div className="details-item">
                  <span className="item-label">Postal / Zip Code</span>
                  <span className="item-value">{org.postalCode}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Section: Settings & System */}
        {activeSection === 'settings' && (
          <div className="details-content-grid">
            <div className="details-card">
              <h4 className="card-section-title">Organization Settings</h4>
              <div className="details-list">
                <div className="details-item">
                  <span className="item-label">Timezone</span>
                  <span className="item-value">{org.timezone}</span>
                </div>
                <div className="details-item">
                  <span className="item-label">Currency</span>
                  <span className="item-value">{org.currency}</span>
                </div>
                <div className="details-item">
                  <span className="item-label">Date Format</span>
                  <span className="item-value">{org.dateFormat}</span>
                </div>
              </div>
            </div>

            <div className="details-card">
              <h4 className="card-section-title">System Status & Metadata</h4>
              <div className="details-list">
                <div className="details-item">
                  <span className="item-label">System ID</span>
                  <span className="item-value font-mono">{org.id}</span>
                </div>
                <div className="details-item">
                  <span className="item-label">Status</span>
                  <OrganizationStatusBadge status={org.status} />
                </div>
                <div className="details-item">
                  <span className="item-label">Created At</span>
                  <span className="item-value">
                    {org.createdAt ? new Date(org.createdAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
                {org.updatedAt && (
                  <div className="details-item">
                    <span className="item-label">Last Updated</span>
                    <span className="item-value">{new Date(org.updatedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
