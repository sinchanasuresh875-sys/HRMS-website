import { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import StatusBadge from '../../../components/common/StatusBadge';
import { employeeApi } from '../api/employeeApi';
import { attendanceApi } from '../../attendernce/api/attendanceApi';
import { leaveApi } from '../../leave/api/leaveApi';
import { taskApi } from '../../tasks/api/taskApi';

export default function EmployeeDetailPage({ employeeId, onBack, onEdit }) {
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDetails() {
      setIsLoading(true);
      try {
        const empData = await employeeApi.getEmployeeById(employeeId);
        setEmployee(empData);

        const [attData, leaveData, taskData] = await Promise.all([
          attendanceApi.getMyAttendance(employeeId),
          leaveApi.getMyLeaves(employeeId),
          taskApi.getMyTasks(employeeId)
        ]);

        setAttendance(attData || []);
        setLeaves(leaveData || []);
        setTasks(taskData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (employeeId) loadDetails();
  }, [employeeId]);

  if (isLoading) {
    return (
      <div className="loading-state-wrapper" style={{ padding: '60px', textAlignment: 'center' }}>
        <Loader text="Loading employee profile..." />
      </div>
    );
  }

  if (!employee) {
    return (
      <div style={{ padding: '24px' }}>
        <Button variant="outline" onClick={onBack}>← Back to Employees</Button>
        <p style={{ marginTop: '20px' }}>Employee record not found.</p>
      </div>
    );
  }

  // Calculate summaries
  const presentCount = attendance.filter((a) => a.status === 'PRESENT').length;
  const lateCount = attendance.filter((a) => a.status === 'LATE').length;
  const halfDayCount = attendance.filter((a) => a.status === 'HALF_DAY').length;
  const leaveCount = attendance.filter((a) => a.status === 'ON_LEAVE').length;
  const totalHours = attendance.reduce((acc, curr) => acc + (curr.workingHours || 0), 0);

  const pendingLeaves = leaves.filter((l) => l.status === 'PENDING').length;
  const approvedLeaves = leaves.filter((l) => l.status === 'APPROVED').length;
  const rejectedLeaves = leaves.filter((l) => l.status === 'REJECTED').length;

  const todoTasks = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div className="employee-detail-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant="outline" size="sm" onClick={onBack}>
            ← Back
          </Button>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.5rem', margin: 0 }}>
              {employee.firstName} {employee.lastName}
            </h1>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {employee.designation} • {employee.department}
            </span>
          </div>
        </div>

        {onEdit && (
          <Button variant="primary" size="sm" onClick={() => onEdit(employee)}>
            Edit Employee
          </Button>
        )}
      </div>

      {/* Hero Profile Header Card */}
      <div className="stat-card" style={{ padding: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
        <img
          src={employee.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.firstName + ' ' + employee.lastName)}&background=4f46e5&color=fff`}
          alt={employee.firstName}
          style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border-color)' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{employee.firstName} {employee.lastName}</h2>
            <StatusBadge status={employee.employmentStatus === 'ACTIVE' ? 'Active' : 'Inactive'} />
            <span className="nav-badge" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)' }}>
              {employee.role}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            ID: <strong>{employee.employeeId}</strong> | Organization: <strong>{employee.organizationName}</strong>
          </p>
          <div style={{ display: 'flex', gap: '24px', marginTop: '12px', fontSize: '0.875rem' }}>
            <span>📧 {employee.email}</span>
            <span>📞 {employee.phone || 'N/A'}</span>
            <span>📍 {employee.address || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Grid of Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Personal & Employment Information */}
        <div className="stat-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Employment Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.875rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Reporting Manager:</span>
              <p style={{ fontWeight: 500 }}>{employee.managerName || 'None (Top Level)'}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Employment Type:</span>
              <p style={{ fontWeight: 500 }}>{employee.employmentType}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Joining Date:</span>
              <p style={{ fontWeight: 500 }}>{employee.joiningDate}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Gender / DOB:</span>
              <p style={{ fontWeight: 500 }}>{employee.gender} / {employee.dateOfBirth}</p>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="stat-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Attendance Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
            <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success-600)' }}>{presentCount}</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Present</p>
            </div>
            <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--warning-600)' }}>{lateCount}</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Late</p>
            </div>
            <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-600)' }}>{totalHours} hrs</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Hours</p>
            </div>
          </div>
        </div>

        {/* Leave Summary */}
        <div className="stat-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Leave Breakdown
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
            <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--warning-600)' }}>{pendingLeaves}</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending</p>
            </div>
            <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success-600)' }}>{approvedLeaves}</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Approved</p>
            </div>
            <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--danger-600)' }}>{rejectedLeaves}</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rejected</p>
            </div>
          </div>
        </div>

        {/* Tasks Summary */}
        <div className="stat-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Assigned Tasks ({tasks.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
            <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-700)' }}>{todoTasks}</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>To Do</p>
            </div>
            <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-600)' }}>{inProgressTasks}</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>In Progress</p>
            </div>
            <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success-600)' }}>{completedTasks}</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
