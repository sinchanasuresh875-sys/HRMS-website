import { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import StatusBadge from '../../../components/common/StatusBadge';
import { employeeApi } from '../../emp/api/employeeApi';
import { leaveApi } from '../../leave/api/leaveApi';
import { attendanceApi } from '../../attendernce/api/attendanceApi';
import { taskApi } from '../../tasks/api/taskApi';

export default function ManagerDashboard({ onNavigate }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [teamAttendance, setTeamAttendance] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);

  const simulatedManager = { id: 'emp-101', firstName: 'Sarah', lastName: 'Jenkins', organizationName: 'Acme Global Technologies' };
  const teamEmployeeIds = ['emp-102', 'emp-103', 'emp-104'];

  useEffect(() => {
    async function loadManagerOverview() {
      try {
        const [team, leaves, att, tks] = await Promise.all([
          employeeApi.fetchTeamEmployees('emp-101', 'org-001'),
          leaveApi.getTeamLeaves(teamEmployeeIds),
          attendanceApi.getTeamAttendance(teamEmployeeIds),
          taskApi.getTeamTasks(teamEmployeeIds, 'emp-101')
        ]);
        setTeamMembers(team || []);
        setPendingLeaves((leaves || []).filter((l) => l.status === 'PENDING'));
        setTeamAttendance(att || []);
        setTeamTasks(tks || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadManagerOverview();
  }, []);

  return (
    <div className="org-page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="stat-card" style={{ padding: '24px', background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', tracking: '1px', opacity: 0.8 }}>Manager Executive Portal</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '4px' }}>Welcome back, Sarah Jenkins!</h1>
          <p style={{ opacity: 0.9, fontSize: '0.875rem', marginTop: '4px' }}>
            Managing Engineering Team • {simulatedManager.organizationName} ({teamMembers.length} Direct Reports)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="primary" size="md" onClick={() => onNavigate && onNavigate('employees')}>
            + Add Team Employee
          </Button>
        </div>
      </div>

      {/* Team Executive Metrics Grid */}
      <div className="stats-cards-grid">
        <div className="stat-card" onClick={() => onNavigate && onNavigate('employees')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-content">
            <span className="stat-label">Total Team Members</span>
            <span className="stat-number text-primary">{teamMembers.length} Employees</span>
          </div>
        </div>
        <div className="stat-card" onClick={() => onNavigate && onNavigate('leave')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-content">
            <span className="stat-label">Pending Leave Approvals</span>
            <span className="stat-number text-warning">{pendingLeaves.length} Requests</span>
          </div>
        </div>
        <div className="stat-card" onClick={() => onNavigate && onNavigate('attendance')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-content">
            <span className="stat-label">Team Present Today</span>
            <span className="stat-number text-success">
              {teamAttendance.filter((a) => a.date === new Date().toISOString().split('T')[0] && a.status === 'PRESENT').length} Present
            </span>
          </div>
        </div>
        <div className="stat-card" onClick={() => onNavigate && onNavigate('tasks')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-content">
            <span className="stat-label">Active Team Tasks</span>
            <span className="stat-number text-primary">
              {teamTasks.filter((t) => t.status !== 'COMPLETED').length} Active
            </span>
          </div>
        </div>
      </div>

      {/* Pending Approvals & Team Member Quick Action Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        {/* Pending Leave Requests */}
        <div className="stat-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Pending Leave Approvals</h2>
            <Button variant="outline" size="sm" onClick={() => onNavigate && onNavigate('leave')}>Review Queue</Button>
          </div>
          {pendingLeaves.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No pending leave approvals.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingLeaves.map((l) => (
                <div key={l.id} style={{ padding: '10px 14px', background: 'var(--gray-50)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{l.employeeName}</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.leaveType} ({l.totalDays} days)</p>
                  </div>
                  <Button variant="success" size="sm" onClick={() => onNavigate && onNavigate('leave')}>Review</Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Members Snapshot */}
        <div className="stat-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Team Roster Overview</h2>
            <Button variant="outline" size="sm" onClick={() => onNavigate && onNavigate('employees')}>Manage Team</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {teamMembers.map((m) => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--gray-50)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={m.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.firstName + ' ' + m.lastName)}`}
                    alt={m.firstName}
                    style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                  />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{m.firstName} {m.lastName}</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.designation}</p>
                  </div>
                </div>
                <StatusBadge status={m.employmentStatus === 'ACTIVE' ? 'Active' : 'Inactive'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
