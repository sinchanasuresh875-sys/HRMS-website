import { useState, useEffect } from 'react';
import { taskApi } from '../api/taskApi';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../api/taskMockData';
import { employeeApi } from '../../emp/api/employeeApi';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Toast from '../../../components/feedback/Toast';

export default function TaskPage({ currentUserRole = 'EMPLOYEE' }) {
  const isManager = currentUserRole === 'MANAGER' || currentUserRole === 'SUPER_ADMIN';
  const [activeTab, setActiveTab] = useState('my');

  const [myTasks, setMyTasks] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [teamEmployees, setTeamEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Assign Task Modal State
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedToId: '',
    priority: 'MEDIUM',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  });

  // Comment Modal State
  const [commentingTaskId, setCommentingTaskId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  const simulatedUser = {
    id: isManager ? 'emp-101' : 'emp-102',
    firstName: isManager ? 'Sarah' : 'John',
    lastName: isManager ? 'Jenkins' : 'Doe'
  };

  useEffect(() => {
    loadTasks();
  }, [activeTab, currentUserRole]);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'my') {
        const data = await taskApi.getMyTasks(simulatedUser.id);
        setMyTasks(data);
      } else {
        const team = await employeeApi.fetchTeamEmployees('emp-101', 'org-001');
        setTeamEmployees(team);
        const teamIds = team.map((e) => e.id);
        const tTasks = await taskApi.getTeamTasks(teamIds, simulatedUser.id);
        setTeamTasks(tTasks);

        if (team.length > 0 && !taskForm.assignedToId) {
          setTaskForm((prev) => ({ ...prev, assignedToId: team[0].id }));
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      showToast(`Task status updated to ${newStatus}`);
      loadTasks();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCreateTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      showToast('Task title is required.', 'error');
      return;
    }
    try {
      await taskApi.createTask(taskForm, simulatedUser, teamEmployees);
      showToast('Task assigned successfully!');
      setIsCreateTaskOpen(false);
      loadTasks();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAddCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      await taskApi.addTaskComment(commentingTaskId, `${simulatedUser.firstName} ${simulatedUser.lastName}`, commentText);
      showToast('Comment added.');
      setCommentingTaskId(null);
      setCommentText('');
      loadTasks();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const getPriorityBadgeStyle = (priority) => {
    switch (priority) {
      case 'URGENT': return { background: 'var(--danger-50)', color: 'var(--danger-700)' };
      case 'HIGH': return { background: 'var(--warning-50)', color: 'var(--warning-600)' };
      case 'MEDIUM': return { background: 'var(--primary-50)', color: 'var(--primary-700)' };
      default: return { background: 'var(--gray-100)', color: 'var(--gray-700)' };
    }
  };

  return (
    <div className="org-page-container">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="org-page-header">
        <div>
          <div className="page-breadcrumb">
            <span>Workplace</span>
            <span className="separator">/</span>
            <span className="active">Task Management</span>
          </div>
          <h1 className="page-title">Task & Activity Tracker</h1>
          <p className="page-subtitle">
            Assign tasks, track completion status, set priorities, and collaborate with team notes.
          </p>
        </div>

        <div className="header-actions">
          {isManager && (
            <div className="filter-pill-group">
              <button
                type="button"
                className={`filter-pill ${activeTab === 'my' ? 'active' : ''}`}
                onClick={() => setActiveTab('my')}
              >
                My Assigned Tasks
              </button>
              <button
                type="button"
                className={`filter-pill ${activeTab === 'team' ? 'active' : ''}`}
                onClick={() => setActiveTab('team')}
              >
                Team Tasks (Manager)
              </button>
            </div>
          )}

          {isManager && activeTab === 'team' && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateTaskOpen(true)}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              }
            >
              Assign New Task
            </Button>
          )}
        </div>
      </div>

      {/* Main Task List Table */}
      {isLoading ? (
        <div className="loading-state-wrapper">
          <Loader text="Loading tasks..." />
        </div>
      ) : (
        <div className="org-table-wrapper">
          <table className="org-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Assignee / Assigned By</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'my' ? myTasks : teamTasks).map((t) => (
                <tr key={t.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{t.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                      {t.description}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>
                      <div>To: <strong>{t.assignedToName}</strong></div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>By: {t.assignedByName}</div>
                    </div>
                  </td>
                  <td>
                    <span
                      className="nav-badge"
                      style={getPriorityBadgeStyle(t.priority)}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem' }}>{t.dueDate}</td>
                  <td>
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusChange(t.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-card)',
                        color: 'var(--text-main)',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCommentingTaskId(t.id)}
                    >
                      Comments ({t.comments?.length || 0})
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Task Modal */}
      <Modal isOpen={isCreateTaskOpen} onClose={() => setIsCreateTaskOpen(false)} title="Assign Task to Team Employee">
        <form onSubmit={handleCreateTaskSubmit} className="hrms-form-container">
          <Input
            label="Task Title *"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            placeholder="e.g. Implement React Router v6"
          />

          <Input
            label="Description"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            placeholder="Detailed instructions or acceptance criteria..."
          />

          <Select
            label="Assignee (Team Member) *"
            value={taskForm.assignedToId}
            onChange={(e) => setTaskForm({ ...taskForm, assignedToId: e.target.value })}
            options={teamEmployees.map((e) => ({ value: e.id, label: `${e.firstName} ${e.lastName} (${e.designation})` }))}
          />

          <div className="form-grid-2">
            <Select
              label="Priority *"
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              options={PRIORITY_OPTIONS.map((p) => ({ value: p, label: p }))}
            />
            <Input
              label="Due Date *"
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button type="button" variant="outline" onClick={() => setIsCreateTaskOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Assign Task</Button>
          </div>
        </form>
      </Modal>

      {/* Comment Modal */}
      <Modal isOpen={!!commentingTaskId} onClose={() => setCommentingTaskId(null)} title="Task Notes & Comments">
        <div className="hrms-form-container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
            {((activeTab === 'my' ? myTasks : teamTasks).find((t) => t.id === commentingTaskId)?.comments || []).map((c) => (
              <div key={c.id} style={{ background: 'var(--gray-50)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.875rem' }}>
                <div style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{c.author}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(c.date).toLocaleDateString()}</span>
                </div>
                <p style={{ marginTop: '4px' }}>{c.text}</p>
              </div>
            ))}
          </div>

          <Input
            label="Add Comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type comment or status note..."
          />

          <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="outline" onClick={() => setCommentingTaskId(null)}>Close</Button>
            <Button variant="primary" onClick={handleAddCommentSubmit}>Post Comment</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
