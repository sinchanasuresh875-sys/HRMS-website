import { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import StatusBadge from '../../../components/common/StatusBadge';
import { attendanceApi } from '../../attendernce/api/attendanceApi';
import { leaveApi } from '../../leave/api/leaveApi';
import { taskApi } from '../../tasks/api/taskApi';

export default function EmployeeDashboard({ onNavigate }) {
  const [attendance, setAttendance] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState(null);
  const [tasks, setTasks] = useState([]);

  const simulatedEmployee = { id: 'emp-102', firstName: 'John', lastName: 'Doe' };

  useEffect(() => {
    async function loadData() {
      try {
        const [att, bal, tks] = await Promise.all([
          attendanceApi.getMyAttendance('emp-102'),
          leaveApi.getLeaveBalance(),
          taskApi.getMyTasks('emp-102')
        ]);
        setAttendance(att || []);
        setLeaveBalances(bal);
        setTasks(tks || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAtt = attendance.find((a) => a.date === todayStr);

  return (
    <div className="org-page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="stat-card" style={{ padding: '24px', background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', tracking: '1px', opacity: 0.8 }}>Employee Portal</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '4px' }}>Welcome back, John Doe!</h1>
          <p style={{ opacity: 0.9, fontSize: '0.875rem', marginTop: '4px' }}>
            {todayAtt?.checkIn ? `Shift active • Checked in at ${todayAtt.checkIn}` : 'You have not checked in for today.'}
          </p>
        </div>
        <Button variant="success" size="md" onClick={() => onNavigate && onNavigate('attendance')}>
          {todayAtt?.checkIn ? 'View Shift Logs' : '⏱️ Quick Check In'}
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-cards-grid">
        <div className="stat-card" onClick={() => onNavigate && onNavigate('leave')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-content">
            <span className="stat-label">Annual Leave Balance</span>
            <span className="stat-number text-primary">{leaveBalances?.annual?.remaining || 11} Days</span>
          </div>
        </div>
        <div className="stat-card" onClick={() => onNavigate && onNavigate('tasks')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-content">
            <span className="stat-label">Pending Assigned Tasks</span>
            <span className="stat-number text-warning">{tasks.filter((t) => t.status !== 'COMPLETED').length} Tasks</span>
          </div>
        </div>
        <div className="stat-card" onClick={() => onNavigate && onNavigate('attendance')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-content">
            <span className="stat-label">Days Present This Month</span>
            <span className="stat-number text-success">{attendance.filter((a) => a.status === 'PRESENT').length} Days</span>
          </div>
        </div>
      </div>

      {/* Tasks Overview Card */}
      <div className="stat-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>My High Priority Tasks</h2>
          <Button variant="outline" size="sm" onClick={() => onNavigate && onNavigate('tasks')}>View All Tasks</Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tasks.slice(0, 3).map((t) => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--gray-50)', borderRadius: '8px' }}>
              <div>
                <span style={{ fontWeight: 600 }}>{t.title}</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due: {t.dueDate} | Assigned by: {t.assignedByName}</p>
              </div>
              <StatusBadge status={t.status === 'COMPLETED' ? 'Active' : 'Pending'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
