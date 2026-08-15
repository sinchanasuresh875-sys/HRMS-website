import { INITIAL_TASKS } from './taskMockData';

const STORAGE_KEY = 'hrms_tasks_mock';

const getStoredTasks = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
  return INITIAL_TASKS;
};

const saveTasks = (records) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const taskApi = {
  async getMyTasks(employeeId) {
    await delay();
    const tasks = getStoredTasks();
    return tasks.filter((t) => t.assignedToId === employeeId);
  },

  async getTeamTasks(teamEmployeeIds = [], managerId) {
    await delay();
    const tasks = getStoredTasks();
    return tasks.filter(
      (t) => teamEmployeeIds.includes(t.assignedToId) || t.assignedById === managerId
    );
  },

  async createTask(data, currentManager, teamEmployees = []) {
    await delay(400);
    const tasks = getStoredTasks();
    const assignee = teamEmployees.find((e) => e.id === data.assignedToId);

    const newTask = {
      id: `task-${Date.now()}`,
      title: data.title,
      description: data.description,
      assignedToId: data.assignedToId,
      assignedToName: assignee ? `${assignee.firstName} ${assignee.lastName}` : 'Unassigned',
      assignedById: currentManager.id,
      assignedByName: `${currentManager.firstName} ${currentManager.lastName}`,
      priority: data.priority || 'MEDIUM',
      status: 'TODO',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      dueDate: data.dueDate,
      comments: [],
      createdAt: new Date().toISOString()
    };

    const updated = [newTask, ...tasks];
    saveTasks(updated);
    return newTask;
  },

  async updateTaskStatus(taskId, newStatus) {
    await delay(300);
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => t.id === taskId);

    if (index === -1) throw new Error('Task not found.');

    tasks[index] = {
      ...tasks[index],
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    saveTasks(tasks);
    return tasks[index];
  },

  async addTaskComment(taskId, authorName, text) {
    await delay(300);
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => t.id === taskId);

    if (index === -1) throw new Error('Task not found.');

    const newComment = {
      id: `c-${Date.now()}`,
      author: authorName,
      text,
      date: new Date().toISOString()
    };

    tasks[index] = {
      ...tasks[index],
      comments: [...(tasks[index].comments || []), newComment]
    };

    saveTasks(tasks);
    return tasks[index];
  }
};
