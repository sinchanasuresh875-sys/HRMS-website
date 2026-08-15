export const INITIAL_TASKS = [
  {
    id: 'task-001',
    title: 'Migrate Frontend Routing to React Router v6',
    description: 'Refactor navigation and active role simulation hooks to support sub-route parameters cleanly.',
    assignedToId: 'emp-102',
    assignedToName: 'John Doe',
    assignedById: 'emp-101',
    assignedByName: 'Sarah Jenkins',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    startDate: '2026-08-10',
    dueDate: '2026-08-18',
    comments: [
      { id: 'c1', author: 'Sarah Jenkins', text: 'Please ensure active state highlighting works on mobile sidebar.', date: '2026-08-11T11:00:00Z' }
    ],
    createdAt: '2026-08-10T09:00:00.000Z'
  },
  {
    id: 'task-002',
    title: 'Audit Employee Attendance Export Logic',
    description: 'Verify quarterly attendance summaries generate correct PDF report totals.',
    assignedToId: 'emp-103',
    assignedToName: 'Emily Watson',
    assignedById: 'emp-101',
    assignedByName: 'Sarah Jenkins',
    priority: 'MEDIUM',
    status: 'TODO',
    startDate: '2026-08-16',
    dueDate: '2026-08-22',
    comments: [],
    createdAt: '2026-08-12T14:30:00.000Z'
  },
  {
    id: 'task-003',
    title: 'Update OAuth Security Handshake',
    description: 'Integrate PKCE authorization grant extension for mobile JWT tokens.',
    assignedToId: 'emp-104',
    assignedToName: 'Alex Chen',
    assignedById: 'emp-101',
    assignedByName: 'Sarah Jenkins',
    priority: 'URGENT',
    status: 'COMPLETED',
    startDate: '2026-08-01',
    dueDate: '2026-08-12',
    comments: [
      { id: 'c2', author: 'Alex Chen', text: 'Tested with mobile test harnesses. Security handshake verified!', date: '2026-08-12T16:00:00Z' }
    ],
    createdAt: '2026-08-01T08:00:00.000Z'
  }
];

export const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
export const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
