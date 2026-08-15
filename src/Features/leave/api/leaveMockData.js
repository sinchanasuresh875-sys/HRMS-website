export const INITIAL_LEAVES = [
  {
    id: 'leave-001',
    employeeId: 'emp-102',
    employeeName: 'John Doe',
    department: 'Engineering',
    leaveType: 'Annual Leave',
    startDate: '2026-08-20',
    endDate: '2026-08-23',
    totalDays: 3,
    reason: 'Summer vacation with family',
    status: 'PENDING',
    rejectionReason: '',
    createdAt: '2026-08-14T10:30:00.000Z'
  },
  {
    id: 'leave-002',
    employeeId: 'emp-103',
    employeeName: 'Emily Watson',
    department: 'Engineering',
    leaveType: 'Casual Leave',
    startDate: '2026-08-18',
    endDate: '2026-08-18',
    totalDays: 1,
    reason: 'Personal errand',
    status: 'APPROVED',
    rejectionReason: '',
    createdAt: '2026-08-10T14:15:00.000Z'
  },
  {
    id: 'leave-003',
    employeeId: 'emp-104',
    employeeName: 'Alex Chen',
    department: 'Engineering',
    leaveType: 'Sick Leave',
    startDate: '2026-08-15',
    endDate: '2026-08-16',
    totalDays: 2,
    reason: 'Fever and rest recommended by doctor',
    status: 'APPROVED',
    rejectionReason: '',
    createdAt: '2026-08-14T08:00:00.000Z'
  }
];

export const INITIAL_LEAVE_BALANCES = {
  annual: { total: 18, used: 4, pending: 3, remaining: 11 },
  sick: { total: 12, used: 2, pending: 0, remaining: 10 },
  casual: { total: 8, used: 1, pending: 0, remaining: 7 }
};

export const LEAVE_TYPE_OPTIONS = [
  'Annual Leave',
  'Sick Leave',
  'Casual Leave',
  'Maternity Leave',
  'Paternity Leave',
  'Unpaid Leave'
];
