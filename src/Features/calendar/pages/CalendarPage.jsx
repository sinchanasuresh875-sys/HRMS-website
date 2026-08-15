import { useState } from 'react';

export default function CalendarPage({ currentUserRole = 'EMPLOYEE' }) {
  const isManager = currentUserRole === 'MANAGER' || currentUserRole === 'SUPER_ADMIN';

  const events = [
    { date: '2026-08-15', title: 'Independence Day Holiday', type: 'holiday', color: 'var(--success-600)' },
    { date: '2026-08-18', title: 'Emily Watson (Casual Leave)', type: 'team-leave', color: 'var(--warning-600)' },
    { date: '2026-08-20', title: 'John Doe (Annual Leave Start)', type: 'team-leave', color: 'var(--primary-600)' },
    { date: '2026-08-22', title: 'Attendance Audit Due', type: 'task', color: 'var(--danger-600)' }
  ];

  return (
    <div className="org-page-container">
      <div className="org-page-header">
        <div>
          <div className="page-breadcrumb">
            <span>Workplace</span>
            <span className="separator">/</span>
            <span className="active">Unified Company Calendar</span>
          </div>
          <h1 className="page-title">Company & Team Calendar</h1>
          <p className="page-subtitle">
            Shared calendar view showing company holidays, personal leaves, assigned task deadlines, and team absence schedule.
          </p>
        </div>
      </div>

      <div className="stat-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>August 2026</h2>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success-600)' }}></span> Company Holiday
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-600)' }}></span> Personal / Team Leave
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--danger-600)' }}></span> Task Deadline
            </span>
          </div>
        </div>

        {/* Simplified Calendar Month Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} style={{ fontWeight: 700, padding: '8px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {day}
            </div>
          ))}

          {Array.from({ length: 31 }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `2026-08-${dayNum < 10 ? '0' + dayNum : dayNum}`;
            const dayEvents = events.filter((e) => e.date === dateStr);

            return (
              <div
                key={dayNum}
                style={{
                  minHeight: '80px',
                  background: 'var(--gray-50)',
                  borderRadius: '8px',
                  padding: '8px',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{dayNum}</span>
                {dayEvents.map((ev, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: ev.color,
                      color: '#fff',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={ev.title}
                  >
                    {ev.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
