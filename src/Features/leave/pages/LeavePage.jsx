import { useState, useEffect } from 'react';
import { leaveApi } from '../api/leaveApi';
import { LEAVE_TYPE_OPTIONS } from '../api/leaveMockData';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import StatusBadge from '../../../components/common/StatusBadge';
import Toast from '../../../components/feedback/Toast';

export default function LeavePage({ currentUserRole = 'EMPLOYEE' }) {
  const isManager = currentUserRole === 'MANAGER' || currentUserRole === 'SUPER_ADMIN';
  const [activeTab, setActiveTab] = useState('my');

  const [myLeaves, setMyLeaves] = useState([]);
  const [teamLeaves, setTeamLeaves] = useState([]);
  const [balances, setBalances] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Apply Leave Modal State
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({
    leaveType: 'Annual Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    totalDays: 1,
    reason: ''
  });

  // Rejection Reason Modal State
  const [rejectingLeaveId, setRejectingLeaveId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  const simulatedUser = {
    id: isManager ? 'emp-101' : 'emp-102',
    firstName: isManager ? 'Sarah' : 'John',
    lastName: isManager ? 'Jenkins' : 'Doe',
    department: 'Engineering'
  };

  const teamEmployeeIds = ['emp-102', 'emp-103', 'emp-104'];

  useEffect(() => {
    loadLeaveData();
  }, [activeTab, currentUserRole]);

  const loadLeaveData = async () => {
    setIsLoading(true);
    try {
      const [balData, myData] = await Promise.all([
        leaveApi.getLeaveBalance(),
        leaveApi.getMyLeaves(simulatedUser.id)
      ]);
      setBalances(balData);
      setMyLeaves(myData);

      if (isManager) {
        const tData = await leaveApi.getTeamLeaves(teamEmployeeIds);
        setTeamLeaves(tData);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyForm.reason.trim()) {
      showToast('Please provide a reason for your leave request.', 'error');
      return;
    }
    try {
      await leaveApi.applyLeave(applyForm, simulatedUser);
      showToast('Leave request submitted successfully!');
      setIsApplyOpen(false);
      loadLeaveData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCancelLeave = async (leaveId) => {
    try {
      await leaveApi.cancelLeave(leaveId);
      showToast('Leave request cancelled.');
      loadLeaveData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      await leaveApi.approveLeave(leaveId);
      showToast('Team leave request Approved!');
      loadLeaveData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectingLeaveId) return;
    try {
      await leaveApi.rejectLeave(rejectingLeaveId, rejectReason);
      showToast('Leave request Rejected.');
      setRejectingLeaveId(null);
      setRejectReason('');
      loadLeaveData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="org-page-container">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="org-page-header">
        <div>
          <div className="page-breadcrumb">
            <span>Time Off</span>
            <span className="separator">/</span>
            <span className="active">Leave Management</span>
          </div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">
            Apply for leave, track remaining leave balances, and review team approval requests.
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
                My Leaves
              </button>
              <button
                type="button"
                className={`filter-pill ${activeTab === 'team' ? 'active' : ''}`}
                onClick={() => setActiveTab('team')}
              >
                Leave Approvals ({teamLeaves.filter((l) => l.status === 'PENDING').length})
              </button>
            </div>
          )}

          {activeTab === 'my' && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsApplyOpen(true)}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              }
            >
              Apply for Leave
            </Button>
          )}
        </div>
      </div>

      {/* Leave Balances Grid (For My View) */}
      {activeTab === 'my' && balances && (
        <div className="stats-cards-grid" style={{ marginBottom: '24px' }}>
          <div className="stat-card">
            <div className="stat-card-content">
              <span className="stat-label">Annual Leave Balance</span>
              <span className="stat-number text-primary">{balances.annual.remaining} Days</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Used: {balances.annual.used} | Pending: {balances.annual.pending}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <span className="stat-label">Sick Leave Balance</span>
              <span className="stat-number text-success">{balances.sick.remaining} Days</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Used: {balances.sick.used} | Pending: {balances.sick.pending}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <span className="stat-label">Casual Leave Balance</span>
              <span className="stat-number text-warning">{balances.casual.remaining} Days</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Used: {balances.casual.used} | Pending: {balances.casual.pending}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {isLoading ? (
        <div className="loading-state-wrapper">
          <Loader text="Loading leave records..." />
        </div>
      ) : activeTab === 'my' ? (
        <div className="org-table-wrapper">
          <table className="org-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Dates</th>
                <th>Total Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myLeaves.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 600 }}>{l.leaveType}</td>
                  <td>{l.startDate} to {l.endDate}</td>
                  <td>{l.totalDays} day(s)</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{l.reason}</td>
                  <td>
                    <StatusBadge status={l.status === 'APPROVED' ? 'Active' : l.status === 'REJECTED' ? 'Inactive' : 'Pending'} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {l.status === 'PENDING' && (
                      <Button variant="outline" size="sm" onClick={() => handleCancelLeave(l.id)}>
                        Cancel Request
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Team Leave Approvals for Manager */
        <div className="org-table-wrapper">
          <table className="org-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Approvals</th>
              </tr>
            </thead>
            <tbody>
              {teamLeaves.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 600 }}>{l.employeeName}</td>
                  <td>{l.leaveType}</td>
                  <td>{l.startDate} to {l.endDate}</td>
                  <td>{l.totalDays} day(s)</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{l.reason}</td>
                  <td>
                    <StatusBadge status={l.status === 'APPROVED' ? 'Active' : l.status === 'REJECTED' ? 'Inactive' : 'Pending'} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {l.status === 'PENDING' ? (
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <Button variant="success" size="sm" onClick={() => handleApprove(l.id)}>
                          Approve
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setRejectingLeaveId(l.id)}>
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Decision Recorded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Apply Leave Modal */}
      <Modal isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} title="Apply for Leave">
        <form onSubmit={handleApplySubmit} className="hrms-form-container">
          <Select
            label="Leave Type *"
            value={applyForm.leaveType}
            onChange={(e) => setApplyForm({ ...applyForm, leaveType: e.target.value })}
            options={LEAVE_TYPE_OPTIONS.map((t) => ({ value: t, label: t }))}
          />

          <div className="form-grid-2">
            <Input
              label="Start Date *"
              type="date"
              value={applyForm.startDate}
              onChange={(e) => setApplyForm({ ...applyForm, startDate: e.target.value })}
            />
            <Input
              label="End Date *"
              type="date"
              value={applyForm.endDate}
              onChange={(e) => setApplyForm({ ...applyForm, endDate: e.target.value })}
            />
          </div>

          <Input
            label="Total Duration (Days) *"
            type="number"
            min="0.5"
            step="0.5"
            value={applyForm.totalDays}
            onChange={(e) => setApplyForm({ ...applyForm, totalDays: e.target.value })}
          />

          <Input
            label="Reason for Leave *"
            value={applyForm.reason}
            onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
            placeholder="Brief explanation..."
          />

          <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button type="button" variant="outline" onClick={() => setIsApplyOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Leave Application</Button>
          </div>
        </form>
      </Modal>

      {/* Reject Reason Modal */}
      <Modal isOpen={!!rejectingLeaveId} onClose={() => setRejectingLeaveId(null)} title="Reject Leave Request">
        <div className="hrms-form-container">
          <Input
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Provide context for rejection..."
          />
          <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="outline" onClick={() => setRejectingLeaveId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleRejectConfirm}>Confirm Rejection</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
