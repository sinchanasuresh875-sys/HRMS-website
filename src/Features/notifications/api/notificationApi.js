export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-001',
    employeeId: 'emp-102',
    title: 'New Task Assigned',
    message: 'Manager Sarah Jenkins assigned you: "Migrate Frontend Routing to React Router v6"',
    type: 'info',
    read: false,
    timestamp: '2026-08-14T09:00:00.000Z'
  },
  {
    id: 'notif-002',
    employeeId: 'emp-102',
    title: 'Leave Status Update',
    message: 'Your Sick Leave request for Aug 15 has been Approved by Sarah Jenkins.',
    type: 'success',
    read: true,
    timestamp: '2026-08-13T16:30:00.000Z'
  },
  {
    id: 'notif-003',
    employeeId: 'emp-101',
    title: 'Pending Leave Request',
    message: 'John Doe submitted a new Annual Leave request (3 days). Review required.',
    type: 'warning',
    read: false,
    timestamp: '2026-08-14T10:31:00.000Z'
  }
];

const STORAGE_KEY = 'hrms_notifications_mock';

const getStoredNotifications = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
  return INITIAL_NOTIFICATIONS;
};

export const notificationApi = {
  async getNotifications(employeeId) {
    const records = getStoredNotifications();
    return records.filter((n) => n.employeeId === employeeId);
  },

  async markAsRead(notificationId) {
    const records = getStoredNotifications();
    const index = records.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      records[index].read = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
    return records;
  }
};
