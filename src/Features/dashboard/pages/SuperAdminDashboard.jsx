import { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import { organizationApi } from '../../organization/api/organizationApi';
import { employeeApi } from '../../emp/api/employeeApi';

export default function SuperAdminDashboard({ onNavigate }) {
  const [orgStats, setOrgStats] = useState({ total: 0, active: 0 });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [orgs, emps] = await Promise.all([
          organizationApi.fetchOrganizations(),
          employeeApi.fetchAllEmployees()
        ]);
        setOrgStats({
          total: orgs.length,
          active: orgs.filter((o) => o.status === 'Active').length
        });
        setEmployees(emps || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const totalManagers = employees.filter((e) => e.role === 'MANAGER').length;
  const totalEmployees = employees.filter((e) => e.role === 'EMPLOYEE').length;

  return (
    <div className="org-page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="stat-card" style={{ padding: '24px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', tracking: '1px', opacity: 0.8 }}>Super Admin Control Panel</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '4px' }}>Global HRMS Administration</h1>
          <p style={{ opacity: 0.9, fontSize: '0.875rem', marginTop: '4px' }}>
            System-wide organization management, manager assignments, and tenant configuration.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => onNavigate && onNavigate('organizations')}>
          Manage Organizations
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-cards-grid">
        <div className="stat-card" onClick={() => onNavigate && onNavigate('organizations')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-content">
            <span className="stat-label">Total Organizations</span>
            <span className="stat-number text-primary">{orgStats.total} Registered</span>
          </div>
        </div>
        <div className="stat-card" onClick={() => onNavigate && onNavigate('employees')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-content">
            <span className="stat-label">Active Managers</span>
            <span className="stat-number text-success">{totalManagers} Managers</span>
          </div>
        </div>
        <div className="stat-card" onClick={() => onNavigate && onNavigate('employees')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-content">
            <span className="stat-label">Total System Employees</span>
            <span className="stat-number text-warning">{totalEmployees} Employees</span>
          </div>
        </div>
      </div>
    </div>
  );
}
