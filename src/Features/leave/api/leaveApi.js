import { INITIAL_LEAVES, INITIAL_LEAVE_BALANCES } from './leaveMockData';

const STORAGE_KEY = 'hrms_leaves_mock';

const getStoredLeaves = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEAVES));
  return INITIAL_LEAVES;
};

const saveLeaves = (records) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const leaveApi = {
  async getMyLeaves(employeeId) {
    await delay();
    const records = getStoredLeaves();
    return records.filter((r) => r.employeeId === employeeId);
  },

  async getTeamLeaves(teamEmployeeIds = []) {
    await delay();
    const records = getStoredLeaves();
    return records.filter((r) => teamEmployeeIds.includes(r.employeeId));
  },

  async getLeaveBalance() {
    await delay(150);
    return INITIAL_LEAVE_BALANCES;
  },

  async applyLeave(data, currentEmployee) {
    await delay(400);
    const records = getStoredLeaves();

    const newLeave = {
      id: `leave-${Date.now()}`,
      employeeId: currentEmployee.id,
      employeeName: `${currentEmployee.firstName} ${currentEmployee.lastName}`,
      department: currentEmployee.department || 'General',
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays: Number(data.totalDays) || 1,
      reason: data.reason,
      status: 'PENDING',
      rejectionReason: '',
      createdAt: new Date().toISOString()
    };

    const updated = [newLeave, ...records];
    saveLeaves(updated);
    return newLeave;
  },

  async cancelLeave(leaveId) {
    await delay(300);
    const records = getStoredLeaves();
    const index = records.findIndex((r) => r.id === leaveId);

    if (index === -1) {
      throw new Error('Leave request not found.');
    }

    if (records[index].status !== 'PENDING') {
      throw new Error('Only PENDING leave requests can be cancelled.');
    }

    records[index] = {
      ...records[index],
      status: 'CANCELLED'
    };

    saveLeaves(records);
    return records[index];
  },

  async approveLeave(leaveId) {
    await delay(350);
    const records = getStoredLeaves();
    const index = records.findIndex((r) => r.id === leaveId);

    if (index === -1) throw new Error('Leave request not found.');

    records[index] = {
      ...records[index],
      status: 'APPROVED'
    };

    saveLeaves(records);
    return records[index];
  },

  async rejectLeave(leaveId, rejectionReason = '') {
    await delay(350);
    const records = getStoredLeaves();
    const index = records.findIndex((r) => r.id === leaveId);

    if (index === -1) throw new Error('Leave request not found.');

    records[index] = {
      ...records[index],
      status: 'REJECTED',
      rejectionReason
    };

    saveLeaves(records);
    return records[index];
  }
};
