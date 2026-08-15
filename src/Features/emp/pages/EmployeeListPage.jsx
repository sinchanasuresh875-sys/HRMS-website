import { useState, useEffect, useMemo } from 'react';
import { employeeApi } from '../api/employeeApi';
import { organizationApi } from '../../organization/api/organizationApi';
import EmployeeFormModal from '../components/EmployeeFormModal';
import ManagerFormModal from '../components/ManagerFormModal';
import SearchInput from '../../../components/common/SearchInput';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import StatusBadge from '../../../components/common/StatusBadge';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import Toast from '../../../components/feedback/Toast';
import EmployeeDetailPage from './EmployeeDetailPage';

export default function EmployeeListPage({ currentUserRole = 'MANAGER', onNavigate }) {
  const [employees, setEmployees] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail View State
  const [viewingEmployeeId, setViewingEmployeeId] = useState(null);

  // Modal States
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [selectedEmpForEdit, setSelectedEmpForEdit] = useState(null);
  const [isCreateManagerOpen, setIsCreateManagerOpen] = useState(false);

  // Deactivate Confirm Dialog State
  const [deactivateEmp, setDeactivateEmp] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  // Currently simulated manager details
  const simulatedManager = useMemo(() => {
    if (currentUserRole === 'SUPER_ADMIN') return null;
    return {
      id: 'emp-101',
      employeeId: 'MGR-101',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      organizationId: 'org-001',
      organizationName: 'Acme Global Technologies',
      role: 'MANAGER'
    };
  }, [currentUserRole]);

  useEffect(() => {
    loadData();
  }, [currentUserRole]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (currentUserRole === 'SUPER_ADMIN') {
        const [empData, orgData] = await Promise.all([
          employeeApi.fetchAllEmployees(),
          organizationApi.fetchOrganizations()
        ]);
        setEmployees(empData);
        setOrganizations(orgData);
      } else {
        // Manager views their team
        const teamData = await employeeApi.fetchTeamEmployees('emp-101', 'org-001');
        setEmployees(teamData);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load employee data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'ACTIVE' && emp.employmentStatus === 'ACTIVE') ||
        (statusFilter === 'INACTIVE' && emp.employmentStatus === 'INACTIVE');

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchTerm, statusFilter]);

  // Handlers
  const handleFormSubmit = async (formData) => {
    try {
      if (selectedEmpForEdit) {
        await employeeApi.updateEmployee(selectedEmpForEdit.id, formData);
        showToast(`Employee "${formData.firstName} ${formData.lastName}" updated successfully.`);
      } else {
        await employeeApi.addEmployee(formData, simulatedManager);
        showToast(`New team employee "${formData.firstName} ${formData.lastName}" added successfully.`);
      }
      setIsAddEmployeeOpen(false);
      setSelectedEmpForEdit(null);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleManagerSubmit = async (formData) => {
    try {
      await employeeApi.createManager(formData);
      showToast(`Manager "${formData.firstName} ${formData.lastName}" created and assigned.`);
      setIsCreateManagerOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleDeactivate = async () => {
    if (!deactivateEmp) return;
    try {
      const updated = await employeeApi.deactivateEmployee(deactivateEmp.id);
      showToast(`Employee status changed to ${updated.employmentStatus}.`);
      setDeactivateEmp(null);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (viewingEmployeeId) {
    return (
      <EmployeeDetailPage
        employeeId={viewingEmployeeId}
        onBack={() => setViewingEmployeeId(null)}
        onEdit={(emp) => {
          setViewingEmployeeId(null);
          setSelectedEmpForEdit(emp);
          setIsAddEmployeeOpen(true);
        }}
      />
    );
  }

  return (
    <div className="org-page-container">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Page Header */}
      <div className="org-page-header">
        <div>
          <div className="page-breadcrumb">
            <span>Core HR</span>
            <span className="separator">/</span>
            <span className="active">{currentUserRole === 'SUPER_ADMIN' ? 'All System Employees' : 'My Team Employees'}</span>
          </div>
          <h1 className="page-title">
            {currentUserRole === 'SUPER_ADMIN' ? 'Employee & Manager Directory' : 'Team Employee Management'}
          </h1>
          <p className="page-subtitle">
            {currentUserRole === 'SUPER_ADMIN'
              ? 'Global employee registry across all registered organizations.'
              : `Manage team members under ${simulatedManager?.organizationName || 'your organization'}.`}
          </p>
        </div>

        <div className="header-actions">
          {currentUserRole === 'SUPER_ADMIN' && (
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsCreateManagerOpen(true)}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="19" y1="8" x2="19" y2="14"></line>
                  <line x1="16" y1="11" x2="22" y2="11"></line>
                </svg>
              }
            >
              Create Manager
            </Button>
          )}

          {currentUserRole === 'MANAGER' && (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setSelectedEmpForEdit(null);
                setIsAddEmployeeOpen(true);
              }}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              }
            >
              Add Employee
            </Button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar-container">
        <div className="toolbar-left">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, email, department, designation..."
          />

          <div className="filter-pill-group">
            <button
              type="button"
              className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({employees.length})
            </button>
            <button
              type="button"
              className={`filter-pill ${statusFilter === 'ACTIVE' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ACTIVE')}
            >
              Active ({employees.filter((e) => e.employmentStatus === 'ACTIVE').length})
            </button>
            <button
              type="button"
              className={`filter-pill ${statusFilter === 'INACTIVE' ? 'active' : ''}`}
              onClick={() => setStatusFilter('INACTIVE')}
            >
              Inactive ({employees.filter((e) => e.employmentStatus === 'INACTIVE').length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="loading-state-wrapper">
          <Loader text="Loading team members..." />
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="empty-state-container" style={{ padding: '60px', textAlign: 'center' }}>
          <h3>No employees found</h3>
          <p style={{ color: 'var(--text-muted)' }}>No employee records match your search or filter requirements.</p>
        </div>
      ) : (
        <div className="org-table-wrapper">
          <table className="org-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Profile</th>
                <th>Email / Phone</th>
                <th>Department & Designation</th>
                <th>Reporting Manager</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary-600)' }}>
                      {emp.employeeId}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={emp.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.firstName + ' ' + emp.lastName)}&background=4f46e5&color=fff`}
                        alt={emp.firstName}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <span style={{ fontWeight: 600, display: 'block' }}>{emp.firstName} {emp.lastName}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.role}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>
                      <div>{emp.email}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{emp.phone || 'N/A'}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>
                      <div style={{ fontWeight: 500 }}>{emp.designation}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{emp.department}</div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.875rem', color: emp.managerName ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      {emp.managerName || '—'}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={emp.employmentStatus === 'ACTIVE' ? 'Active' : 'Inactive'} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingEmployeeId(emp.id)}
                        title="View Full Profile Details"
                      >
                        View
                      </Button>

                      {currentUserRole === 'MANAGER' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedEmpForEdit(emp);
                              setIsAddEmployeeOpen(true);
                            }}
                            title="Edit Employee"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeactivateEmp(emp)}
                            title={emp.employmentStatus === 'ACTIVE' ? 'Deactivate Employee' : 'Activate Employee'}
                          >
                            {emp.employmentStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <EmployeeFormModal
        isOpen={isAddEmployeeOpen}
        onClose={() => {
          setIsAddEmployeeOpen(false);
          setSelectedEmpForEdit(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedEmpForEdit}
        currentManager={simulatedManager}
      />

      <ManagerFormModal
        isOpen={isCreateManagerOpen}
        onClose={() => setIsCreateManagerOpen(false)}
        onSubmit={handleManagerSubmit}
        organizations={organizations}
      />

      <ConfirmDialog
        isOpen={!!deactivateEmp}
        title={`${deactivateEmp?.employmentStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'} "${deactivateEmp?.firstName} ${deactivateEmp?.lastName}"?`}
        message={`Changing employment status to ${deactivateEmp?.employmentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}. All attendance, leave, and task history will be preserved.`}
        confirmText={deactivateEmp?.employmentStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        confirmVariant={deactivateEmp?.employmentStatus === 'ACTIVE' ? 'danger' : 'success'}
        onConfirm={handleToggleDeactivate}
        onCancel={() => setDeactivateEmp(null)}
      />
    </div>
  );
}
