import { useState, useEffect } from 'react';
import { activityLogApi } from '../api/activityLogApi';
import Loader from '../../../components/common/Loader';

export default function ActivityLogPage({ currentUserRole = 'EMPLOYEE' }) {
  const isManager = currentUserRole === 'MANAGER' || currentUserRole === 'SUPER_ADMIN';
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const teamEmployeeIds = ['emp-102', 'emp-103', 'emp-104'];

  useEffect(() => {
    async function loadLogs() {
      setIsLoading(true);
      try {
        if (isManager) {
          const tLogs = await activityLogApi.getTeamLogs(teamEmployeeIds);
          setLogs(tLogs);
        } else {
          const mLogs = await activityLogApi.getMyLogs('emp-102');
          setLogs(mLogs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLogs();
  }, [currentUserRole]);

  return (
    <div className="org-page-container">
      <div className="org-page-header">
        <div>
          <div className="page-breadcrumb">
            <span>Audit & Compliance</span>
            <span className="separator">/</span>
            <span className="active">Activity Audit Logs</span>
          </div>
          <h1 className="page-title">Activity Audit Trail</h1>
          <p className="page-subtitle">
            {isManager
              ? 'View operational audit events, logins, leave submissions, and task updates across your team.'
              : 'View your personal system activity history.'}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state-wrapper">
          <Loader text="Loading activity logs..." />
        </div>
      ) : (
        <div className="org-table-wrapper">
          <table className="org-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Employee</th>
                <th>Action</th>
                <th>Category</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
                    {l.date} {l.time}
                  </td>
                  <td style={{ fontWeight: 600 }}>{l.employeeName}</td>
                  <td>
                    <span className="nav-badge" style={{ background: 'var(--primary-100)', color: 'var(--primary-700)' }}>
                      {l.action}
                    </span>
                  </td>
                  <td>{l.category}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{l.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
