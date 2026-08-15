import { useState, useEffect } from 'react';
import { notificationApi } from '../api/notificationApi';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifs();
  }, []);

  const loadNotifs = async () => {
    setIsLoading(true);
    try {
      const data = await notificationApi.getNotifications('emp-102');
      setNotifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    await notificationApi.markAsRead(id);
    loadNotifs();
  };

  return (
    <div className="org-page-container">
      <div className="org-page-header">
        <div>
          <div className="page-breadcrumb">
            <span>Communications</span>
            <span className="separator">/</span>
            <span className="active">Notifications</span>
          </div>
          <h1 className="page-title">Notification Center</h1>
          <p className="page-subtitle">Stay up to date with task assignments, leave approvals, and system alerts.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state-wrapper">
          <Loader text="Loading notifications..." />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              className="stat-card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                borderLeft: n.read ? '4px solid var(--border-color)' : '4px solid var(--primary-600)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '1rem' }}>{n.title}</span>
                  {!n.read && (
                    <span className="nav-badge" style={{ background: 'var(--primary-100)', color: 'var(--primary-700)' }}>
                      New
                    </span>
                  )}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>{n.message}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '4px', display: 'block' }}>
                  {new Date(n.timestamp).toLocaleString()}
                </span>
              </div>

              {!n.read && (
                <Button variant="outline" size="sm" onClick={() => handleMarkRead(n.id)}>
                  Mark Read
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
