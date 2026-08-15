import { useState } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import { DEPARTMENT_OPTIONS, EMPLOYMENT_TYPE_OPTIONS } from '../api/employeeMockData';

export default function EmployeeFormModal({ isOpen, onClose, onSubmit, initialData = null, isLoading = false, currentManager = null }) {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    gender: initialData?.gender || 'Male',
    dateOfBirth: initialData?.dateOfBirth || '1995-01-01',
    profilePhoto: initialData?.profilePhoto || '',
    address: initialData?.address || '',
    employeeId: initialData?.employeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`,
    department: initialData?.department || 'Engineering',
    designation: initialData?.designation || 'Software Engineer',
    joiningDate: initialData?.joiningDate || new Date().toISOString().split('T')[0],
    employmentType: initialData?.employmentType || 'Full-Time',
    employmentStatus: initialData?.employmentStatus || 'ACTIVE'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!formData.email.trim()) errs.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email format.';
    if (!formData.employeeId.trim()) errs.employeeId = 'Employee ID is required.';
    if (!formData.department) errs.department = 'Department is required.';
    if (!formData.designation.trim()) errs.designation = 'Designation is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Employee: ${initialData?.firstName} ${initialData?.lastName}` : 'Add New Team Employee'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="hrms-form-container">
        {/* Notice of automated organization & manager pinning */}
        {!isEdit && currentManager && (
          <div className="alert-box alert-info" style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '8px', background: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-100)' }}>
            <strong>Automatic Organization & Manager Assignment:</strong><br />
            This employee will automatically belong to organization <strong>{currentManager.organizationName || 'Current Org'}</strong> and report directly to you (<strong>{currentManager.firstName} {currentManager.lastName}</strong>) as their manager.
          </div>
        )}

        <div className="form-section-title">Personal Information</div>
        <div className="form-grid-2">
          <Input
            label="First Name *"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            placeholder="John"
          />
          <Input
            label="Last Name *"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            placeholder="Doe"
          />
        </div>

        <div className="form-grid-2">
          <Input
            label="Email Address *"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="john.doe@company.com"
          />
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="form-grid-3">
          <Select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' }
            ]}
          />
          <Input
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <Input
            label="Profile Photo URL"
            name="profilePhoto"
            value={formData.profilePhoto}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Full residential street address..."
        />

        <div className="form-section-title" style={{ marginTop: '20px' }}>Employment Details</div>
        <div className="form-grid-2">
          <Input
            label="Employee ID *"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            error={errors.employeeId}
            placeholder="EMP-105"
          />
          <Select
            label="Department *"
            name="department"
            value={formData.department}
            onChange={handleChange}
            options={DEPARTMENT_OPTIONS.map((d) => ({ value: d, label: d }))}
            error={errors.department}
          />
        </div>

        <div className="form-grid-2">
          <Input
            label="Designation *"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            error={errors.designation}
            placeholder="Frontend Engineer"
          />
          <Input
            label="Joining Date"
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-grid-2">
          <Select
            label="Employment Type"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            options={EMPLOYMENT_TYPE_OPTIONS.map((t) => ({ value: t, label: t }))}
          />
          <Select
            label="Employment Status"
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={handleChange}
            options={[
              { value: 'ACTIVE', label: 'ACTIVE' },
              { value: 'INACTIVE', label: 'INACTIVE (Deactivated)' }
            ]}
          />
        </div>

        <div className="modal-footer" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEdit ? 'Save Changes' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
