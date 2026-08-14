import { useState } from 'react';
import { useOrganizations } from '../hooks/useOrganizations';
import OrganizationTable from '../components/OrganizationTable';
import OrganizationCard from '../components/OrganizationCard';
import OrganizationForm from '../components/OrganizationForm';
import OrganizationDetailsModal from '../components/OrganizationDetailsModal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import SearchInput from '../../../components/common/SearchInput';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import Toast from '../../../components/feedback/Toast';

export default function OrganizationPage({ currentUserRole = 'SUPER_ADMIN' }) {
  const {
    organizations,
    filteredOrganizations,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    stats,
    isLoading,
    isSaving,
    isDeleting,
    isStatusUpdating,
    error,
    toast,
    clearToast,
    loadOrganizations,
    addOrganization,
    editOrganization,
    removeOrganization,
    changeStatus,
    resetDemoData
  } = useOrganizations();

  // Layout View mode: 'table' (desktop default) or 'grid' (cards)
  const [viewMode, setViewMode] = useState('table');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrgForEdit, setSelectedOrgForEdit] = useState(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrgForDetails, setSelectedOrgForDetails] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOrgForDelete, setSelectedOrgForDelete] = useState(null);

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedOrgForStatus, setSelectedOrgForStatus] = useState(null);

  // Super Admin Authorization Check
  const isSuperAdmin = currentUserRole === 'SUPER_ADMIN';

  if (!isSuperAdmin) {
    return (
      <div className="org-page-container">
        <div className="unauthorized-card">
          <div className="unauthorized-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2>Access Restricted</h2>
          <p>
            Organization Management is exclusively reserved for the <strong>Super Admin</strong> role.
            You are currently logged in with limited permissions.
          </p>
        </div>
      </div>
    );
  }

  // Action Handlers
  const handleOpenCreate = () => {
    setSelectedOrgForEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (org) => {
    setSelectedOrgForEdit(org);
    setIsFormOpen(true);
  };

  const handleOpenViewDetails = (org) => {
    setSelectedOrgForDetails(org);
    setIsDetailsOpen(true);
  };

  const handleOpenDelete = (org) => {
    setSelectedOrgForDelete(org);
    setIsDeleteOpen(true);
  };

  const handleOpenToggleStatus = (org) => {
    setSelectedOrgForStatus(org);
    setIsStatusOpen(true);
  };

  // Submit Create / Edit
  const handleFormSubmit = async (formData) => {
    try {
      if (selectedOrgForEdit) {
        await editOrganization(selectedOrgForEdit.id, formData);
      } else {
        await addOrganization(formData);
      }
      setIsFormOpen(false);
      setSelectedOrgForEdit(null);
    } catch {
      // Error handled inside hook with toast
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!selectedOrgForDelete) return;
    try {
      await removeOrganization(selectedOrgForDelete.id);
      setIsDeleteOpen(false);
      setSelectedOrgForDelete(null);
    } catch {
      // Handled in hook
    }
  };

  // Confirm Status Toggle
  const handleConfirmStatusToggle = async () => {
    if (!selectedOrgForStatus) return;
    const targetStatus = selectedOrgForStatus.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await changeStatus(selectedOrgForStatus.id, targetStatus);
      setIsStatusOpen(false);
      setSelectedOrgForStatus(null);
    } catch {
      // Handled in hook
    }
  };

  return (
    <div className="org-page-container">
      {/* Toast Notification Banner */}
      <Toast toast={toast} onClose={clearToast} />

      {/* Page Header */}
      <div className="org-page-header">
        <div>
          <div className="page-breadcrumb">
            <span>Administration</span>
            <span className="separator">/</span>
            <span className="active">Organization Management</span>
          </div>
          <h1 className="page-title">Organization Management</h1>
          <p className="page-subtitle">
            Manage company profiles, contact channels, regional settings, and operational statuses.
          </p>
        </div>

        <div className="header-actions">
          <Button
            variant="outline"
            size="md"
            onClick={resetDemoData}
            title="Reset to default mock data"
          >
            Reset Mock Data
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            }
          >
            Add Organization
          </Button>
        </div>
      </div>

      {/* Organization Summary Statistics Cards */}
      <div className="stats-cards-grid">
        <div className="stat-card">
          <div className="stat-card-icon icon-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
              <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
              <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
              <path d="M10 6h4"></path>
              <path d="M10 10h4"></path>
              <path d="M10 14h4"></path>
              <path d="M10 18h4"></path>
            </svg>
          </div>
          <div className="stat-card-content">
            <span className="stat-label">Total Organizations</span>
            <span className="stat-number">{stats.totalCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon icon-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="stat-card-content">
            <span className="stat-label">Active Organizations</span>
            <span className="stat-number text-success">{stats.activeCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon icon-warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div className="stat-card-content">
            <span className="stat-label">Inactive Organizations</span>
            <span className="stat-number text-warning">{stats.inactiveCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar Section */}
      <div className="toolbar-container">
        <div className="toolbar-left">
          {/* Search Box */}
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, code, industry, city, state, email..."
          />

          {/* Status Filter Tabs */}
          <div className="filter-pill-group">
            <button
              type="button"
              className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({organizations.length})
            </button>
            <button
              type="button"
              className={`filter-pill ${statusFilter === 'Active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Active')}
            >
              Active ({stats.activeCount})
            </button>
            <button
              type="button"
              className={`filter-pill ${statusFilter === 'Inactive' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Inactive')}
            >
              Inactive ({stats.inactiveCount})
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          {/* View Mode Switcher */}
          <div className="view-mode-toggle" title="Switch view layout">
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              aria-label="Table view"
              title="Table View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid card view"
              title="Grid Card View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="loading-state-wrapper">
          <Loader text="Loading organizations..." />
        </div>
      ) : error ? (
        <div className="error-state-card">
          <h3>Failed to load organizations</h3>
          <p>{error}</p>
          <Button variant="outline" onClick={loadOrganizations}>
            Try Again
          </Button>
        </div>
      ) : filteredOrganizations.length === 0 ? (
        <EmptyState
          title={
            searchTerm || statusFilter !== 'all'
              ? 'No matching organizations found'
              : 'No organizations available'
          }
          description={
            searchTerm || statusFilter !== 'all'
              ? `No records matched your search "${searchTerm}" or filter "${statusFilter}". Try resetting your filters.`
              : 'There are currently no registered organizations in the system. Click "Add Organization" to create one.'
          }
          action={
            searchTerm || statusFilter !== 'all' ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Clear Search & Filters
              </Button>
            ) : (
              <Button variant="primary" onClick={handleOpenCreate}>
                Add First Organization
              </Button>
            )
          }
        />
      ) : viewMode === 'table' ? (
        <OrganizationTable
          organizations={filteredOrganizations}
          onView={handleOpenViewDetails}
          onEdit={handleOpenEdit}
          onToggleStatus={handleOpenToggleStatus}
          onDelete={handleOpenDelete}
        />
      ) : (
        <div className="org-cards-grid">
          {filteredOrganizations.map((org) => (
            <OrganizationCard
              key={org.id}
              organization={org}
              onView={handleOpenViewDetails}
              onEdit={handleOpenEdit}
              onToggleStatus={handleOpenToggleStatus}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      {/* Modals & Dialogs */}

      {/* Create / Edit Form Modal */}
      <OrganizationForm
        key={selectedOrgForEdit ? selectedOrgForEdit.id : (isFormOpen ? 'open-new' : 'closed')}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedOrgForEdit(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedOrgForEdit}
        isLoading={isSaving}
      />

      {/* View Details Profile Modal */}
      <OrganizationDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedOrgForDetails(null);
        }}
        organization={selectedOrgForDetails}
        onEdit={handleOpenEdit}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title={`Delete "${selectedOrgForDelete?.name}"?`}
        message="This action is permanent and cannot be undone. All associate metadata will be removed."
        confirmText="Permanently Delete"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setSelectedOrgForDelete(null);
        }}
      />

      {/* Confirm Status Toggle Dialog */}
      <ConfirmDialog
        isOpen={isStatusOpen}
        title={`${selectedOrgForStatus?.status === 'Active' ? 'Deactivate' : 'Activate'} "${selectedOrgForStatus?.name}"?`}
        message={`Are you sure you want to change the status of ${selectedOrgForStatus?.name} to ${
          selectedOrgForStatus?.status === 'Active' ? 'Inactive' : 'Active'
        }?`}
        confirmText={selectedOrgForStatus?.status === 'Active' ? 'Deactivate' : 'Activate'}
        confirmVariant={selectedOrgForStatus?.status === 'Active' ? 'danger' : 'success'}
        isLoading={isStatusUpdating}
        onConfirm={handleConfirmStatusToggle}
        onCancel={() => {
          setIsStatusOpen(false);
          setSelectedOrgForStatus(null);
        }}
      />
    </div>
  );
}
