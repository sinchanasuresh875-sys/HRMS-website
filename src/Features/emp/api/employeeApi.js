import { INITIAL_EMPLOYEES } from './employeeMockData';

const STORAGE_KEY = 'hrms_employees_mock';
const SIMULATED_DELAY_MS = 300;

const getStoredEmployees = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read employees from localStorage:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
  return INITIAL_EMPLOYEES;
};

const saveEmployees = (employees) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  } catch (e) {
    console.error('Failed to save employees to localStorage:', e);
  }
};

const delay = (ms = SIMULATED_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

export const employeeApi = {
  // Fetch all employees (Super Admin scope)
  async fetchAllEmployees() {
    await delay();
    return getStoredEmployees();
  },

  // Fetch employees for a specific manager's team (Manager scope)
  async fetchTeamEmployees(managerId, organizationId) {
    await delay();
    const employees = getStoredEmployees();
    return employees.filter(
      (emp) => emp.managerId === managerId && emp.organizationId === organizationId
    );
  },

  // Fetch single employee details
  async getEmployeeById(id) {
    await delay();
    const employees = getStoredEmployees();
    const found = employees.find((emp) => emp.id === id);
    if (!found) {
      throw new Error(`Employee with ID ${id} not found.`);
    }
    return { ...found };
  },

  // Add Employee by Manager
  async addEmployee(data, currentManager) {
    await delay(450);
    const employees = getStoredEmployees();

    if (employees.some((e) => e.email.trim().toLowerCase() === data.email.trim().toLowerCase())) {
      throw new Error(`Email "${data.email}" is already registered.`);
    }

    const newEmpId = data.employeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`;

    const newEmployee = {
      ...data,
      id: `emp-${Date.now().toString().slice(-6)}`,
      employeeId: newEmpId,
      // Automated manager rules enforced:
      organizationId: currentManager.organizationId,
      organizationName: currentManager.organizationName,
      managerId: currentManager.id,
      managerName: `${currentManager.firstName} ${currentManager.lastName}`,
      role: 'EMPLOYEE',
      employmentStatus: 'ACTIVE',
      profilePhoto: data.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.firstName + ' ' + data.lastName)}&background=4f46e5&color=fff`,
      createdAt: new Date().toISOString()
    };

    const updated = [newEmployee, ...employees];
    saveEmployees(updated);
    return newEmployee;
  },

  // Create Manager by Super Admin
  async createManager(data) {
    await delay(450);
    const employees = getStoredEmployees();

    if (employees.some((e) => e.email.trim().toLowerCase() === data.email.trim().toLowerCase())) {
      throw new Error(`Email "${data.email}" is already registered.`);
    }

    const newMgrId = data.employeeId || `MGR-${Math.floor(100 + Math.random() * 900)}`;

    const newManager = {
      ...data,
      id: `emp-${Date.now().toString().slice(-6)}`,
      employeeId: newMgrId,
      role: 'MANAGER',
      managerId: null,
      managerName: null,
      employmentStatus: 'ACTIVE',
      profilePhoto: data.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.firstName + ' ' + data.lastName)}&background=047857&color=fff`,
      createdAt: new Date().toISOString()
    };

    const updated = [newManager, ...employees];
    saveEmployees(updated);
    return newManager;
  },

  // Update Employee (Permitted fields)
  async updateEmployee(id, data) {
    await delay(350);
    const employees = getStoredEmployees();
    const index = employees.findIndex((e) => e.id === id);

    if (index === -1) {
      throw new Error('Employee not found for update.');
    }

    const updated = {
      ...employees[index],
      ...data,
      id, // Preserve ID
      updatedAt: new Date().toISOString()
    };

    employees[index] = updated;
    saveEmployees(employees);
    return updated;
  },

  // Deactivate Employee (Soft delete: employmentStatus = INACTIVE)
  async deactivateEmployee(id) {
    await delay(300);
    const employees = getStoredEmployees();
    const index = employees.findIndex((e) => e.id === id);

    if (index === -1) {
      throw new Error('Employee not found.');
    }

    employees[index] = {
      ...employees[index],
      employmentStatus: employees[index].employmentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      updatedAt: new Date().toISOString()
    };

    saveEmployees(employees);
    return employees[index];
  },

  // Reset to initial mock data
  async resetMockData() {
    await delay(200);
    saveEmployees(INITIAL_EMPLOYEES);
    return [...INITIAL_EMPLOYEES];
  }
};
