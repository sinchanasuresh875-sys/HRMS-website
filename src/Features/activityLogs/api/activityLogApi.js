export const INITIAL_ACTIVITY_LOGS = [
  {
    id: 'log-001',
    employeeId: 'emp-102',
    employeeName: 'John Doe',
    action: 'Check In',
    category: 'Attendance',
    date: '2026-08-15',
    time: '09:02 AM',
    description: 'Checked in via web portal'
  },
  {
    id: 'log-002',
    employeeId: 'emp-102',
    employeeName: 'John Doe',
    action: 'Leave Applied',
    category: 'Leave',
    date: '2026-08-14',
    time: '10:30 AM',
    description: 'Submitted Annual Leave request for Aug 20 - Aug 23'
  },
  {
    id: 'log-003',
    employeeId: 'emp-103',
    employeeName: 'Emily Watson',
    action: 'Task Updated',
    category: 'Task',
    date: '2026-08-14',
    time: '02:15 PM',
    description: 'Updated task "Audit Attendance" status to IN_PROGRESS'
  },
  {
    id: 'log-004',
    employeeId: 'emp-104',
    employeeName: 'Alex Chen',
    action: 'Profile Updated',
    category: 'Profile',
    date: '2026-08-13',
    time: '04:45 PM',
    description: 'Updated emergency contact details'
  }
];

const STORAGE_KEY = 'hrms_activity_logs_mock';

const getStoredLogs = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ACTIVITY_LOGS));
  return INITIAL_ACTIVITY_LOGS;
};

export const activityLogApi = {
  async getMyLogs(employeeId) {
    const logs = getStoredLogs();
    return logs.filter((l) => l.employeeId === employeeId);
  },

  async getTeamLogs(teamEmployeeIds = []) {
    const logs = getStoredLogs();
    return logs.filter((l) => teamEmployeeIds.includes(l.employeeId));
  },

  async logAction(employee, action, category, description) {
    const logs = getStoredLogs();
    const now = new Date();
    const newLog = {
      id: `log-${Date.now()}`,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      action,
      category,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description
    };
    const updated = [newLog, ...logs];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newLog;
  }
};
