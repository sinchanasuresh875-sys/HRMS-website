import { useState, useEffect } from 'react';
import { attendanceApi } from '../api/attendanceApi';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import StatusBadge from '../../../components/common/StatusBadge';
import Toast from '../../../components/feedback/Toast';

export default function AttendancePage({ currentUserRole = 'EMPLOYEE' }) {
  const isManager = currentUserRole === 'MANAGER' || currentUserRole === 'SUPER_ADMIN';
  const [activeTab, setActiveTab] = useState('my');

  const [myAttendance, setMyAttendance] = useState([]);
  const [teamAttendance, setTeamAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  const simulatedUser = {
    id: isManager ? 'emp-101' : 'emp-102',
    firstName: isManager ? 'Sarah' : 'John',
    lastName: isManager ? 'Jenkins' : 'Doe'
  };

  const teamEmployeeIds = ['emp-102', 'emp-103', 'emp-104'];

  useEffect(() => {
    loadAttendance();
  }, [activeTab, currentUserRole]);

  const loadAttendance = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'my') {
        const data = await attendanceApi.getMyAttendance(simulatedUser.id);
        setMyAttendance(data);
      } else {
        const teamData = await attendanceApi.getTeamAttendance(teamEmployeeIds);
        setTeamAttendance(teamData);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = myAttendance.find((a) => a.date === todayStr);

  const handleCheckIn = async () => {
    try {
      const record = await attendanceApi.checkIn(simulatedUser);
      showToast(`Checked in successfully at ${record.checkIn}!`);
      loadAttendance();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCheckOut = async () => {
    try {
      const record = await attendanceApi.checkOut(simulatedUser.id);
      showToast(`Checked out successfully at ${record.checkOut}!`);
      loadAttendance();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="org-page-container">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="org-page-header">
        <div>
          <div className="page-breadcrumb">
            <span>Time & Attendance</span>
            <span className="separator">/</span>
            <span className="active">Attendance Tracker</span>
          </div>
          <h1 className="page-title">Attendance & Time Tracker</h1>
          <p className="page-subtitle">
            Track daily work shifts, check-in timestamps, working hours, and team attendance records.
          </p>
        </div>

        {/* Tab Selector */}
        {isManager && (
          <div className="filter-pill-group">
            <button
              type="button"
              className={`filter-pill ${activeTab === 'my' ? 'active' : ''}`}
              onClick={() => setActiveTab('my')}
            >
              My Attendance
            </button>
            <button
              type="button"
              className={`filter-pill ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              Team Attendance (Manager)
            </button>
          </div>
        )}
      </div>

      {/* Clock In / Out Banner Card (For Personal View) */}
      {activeTab === 'my' && (
        <div className="stat-card" style={{ padding: '24px', background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', color: '#fff', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', tracking: '1px', opacity: 0.8 }}>
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '4px' }}>
              Welcome, {simulatedUser.firstName}!
            </h2>
            <p style={{ opacity: 0.9, fontSize: '0.875rem', marginTop: '4px' }}>
              {todayRecord?.checkIn
                ? `Checked in at ${todayRecord.checkIn} ${todayRecord.checkOut ? `• Checked out at ${todayRecord.checkOut}` : '• Shift active'}`
                : 'You have not checked in for today yet.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="success"
              size="lg"
              disabled={!!todayRecord?.checkIn}
              onClick={handleCheckIn}
            >
              ⏱️ Check In
            </Button>
            <Button
              variant="danger"
              size="lg"
              disabled={!todayRecord?.checkIn || !!todayRecord?.checkOut}
              onClick={handleCheckOut}
            >
              🚪 Check Out
            </Button>
          </div>
        </div>
      )}

      {/* Main Attendance Table */}
      {isLoading ? (
        <div className="loading-state-wrapper">
          <Loader text="Loading attendance logs..." />
        </div>
      ) : activeTab === 'my' ? (
        <div className="org-table-wrapper">
          <table className="org-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {myAttendance.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.date}</td>
                  <td>{a.checkIn || '—'}</td>
                  <td>{a.checkOut || '—'}</td>
                  <td>{a.workingHours ? `${a.workingHours} hrs` : '—'}</td>
                  <td>
                    <StatusBadge status={a.status === 'PRESENT' ? 'Active' : a.status === 'LATE' ? 'Inactive' : 'Pending'} />
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{a.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Team Attendance View for Manager */
        <div className="org-table-wrapper">
          <table className="org-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {teamAttendance.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.employeeName}</td>
                  <td>{a.date}</td>
                  <td>{a.checkIn || '—'}</td>
                  <td>{a.checkOut || '—'}</td>
                  <td>{a.workingHours ? `${a.workingHours} hrs` : '—'}</td>
                  <td>
                    <StatusBadge status={a.status === 'PRESENT' ? 'Active' : a.status === 'LATE' ? 'Inactive' : 'Pending'} />
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{a.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
