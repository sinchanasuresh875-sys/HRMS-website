import { INITIAL_ATTENDANCE } from './attendanceMockData';

const STORAGE_KEY = 'hrms_attendance_mock';

const getStoredAttendance = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ATTENDANCE));
  return INITIAL_ATTENDANCE;
};

const saveAttendance = (records) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const attendanceApi = {
  async getMyAttendance(employeeId) {
    await delay();
    const records = getStoredAttendance();
    return records.filter((r) => r.employeeId === employeeId);
  },

  async getTeamAttendance(teamEmployeeIds = []) {
    await delay();
    const records = getStoredAttendance();
    return records.filter((r) => teamEmployeeIds.includes(r.employeeId));
  },

  async checkIn(employee) {
    await delay(400);
    const records = getStoredAttendance();
    const todayStr = new Date().toISOString().split('T')[0];
    const existing = records.find((r) => r.employeeId === employee.id && r.date === todayStr);

    if (existing && existing.checkIn) {
      throw new Error('Already checked in for today!');
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isLate = new Date().getHours() >= 9 && new Date().getMinutes() > 15;

    const newRecord = {
      id: `att-${Date.now()}`,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      date: todayStr,
      checkIn: timeStr,
      checkOut: null,
      workingHours: 0,
      status: isLate ? 'LATE' : 'PRESENT',
      notes: isLate ? 'Late arrival' : 'On time'
    };

    const updated = [newRecord, ...records];
    saveAttendance(updated);
    return newRecord;
  },

  async checkOut(employeeId) {
    await delay(400);
    const records = getStoredAttendance();
    const todayStr = new Date().toISOString().split('T')[0];
    const index = records.findIndex((r) => r.employeeId === employeeId && r.date === todayStr);

    if (index === -1 || !records[index].checkIn) {
      throw new Error('You must check in first before checking out.');
    }

    if (records[index].checkOut) {
      throw new Error('Already checked out for today.');
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    records[index] = {
      ...records[index],
      checkOut: timeStr,
      workingHours: 8.0
    };

    saveAttendance(records);
    return records[index];
  }
};
