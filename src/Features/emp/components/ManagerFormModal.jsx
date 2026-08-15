import { useState } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import { DEPARTMENT_OPTIONS } from '../api/employeeMockData';

export default function ManagerFormModal({ isOpen, onClose, onSubmit, organizations = [], isLoading = false }) {
  const [formData, setFormData] = useState({
    organizationId: organizations[0]?.id || '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '1988-01-01',
    profilePhoto: '',
    address: '',
    employeeId: `MGR-${Math.floor(100 + Math.random() * 900)}`,
    department: 'Engineering',
    designation: 'Engineering Director',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-Time'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.organizationId) errs.organizationId = 'Please select a target organization.';
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!formData.email.trim()) errs.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email format.';
    if (!formData.employeeId.trim()) errs.employeeId = 'Manager Code / ID is required.';
    if (!formData.designation.trim()) errs.designation = 'Designation is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const selectedOrg = organizations.find((o) => o.id === formData.organizationId);
    onSubmit({
      ...formData,
      organizationName: selectedOrg ? selectedOrg.name : 'Organization'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Organization Manager (Super Admin)"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="hrms-form-container">
        <div className="form-section-title">Organization Assignment</div>
        <Select
          label="Target Organization *"
          name="organizationId"
          value={formData.organizationId}
          onChange={handleChange}
          options={organizations.map((org) => ({ value: org.id, label: `${org.name} (${org.code})` }))}
          error={errors.organizationId}
        />

        <div className="form-section-title" style={{ marginTop: '16px' }}>Manager Personal Information</div>
        <div className="form-grid-2">
          <Input
            label="First Name *"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            placeholder="Sarah"
          />
          <Input
            label="Last Name *"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            placeholder="Jenkins"
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
            placeholder="sarah.jenkins@organization.com"
          />
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="form-section-title" style={{ marginTop: '16px' }}>Employment Metadata</div>
        <div className="form-grid-2">
          <Input
            label="Manager ID / Code *"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            error={errors.employeeId}
          />
          <Select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            options={DEPARTMENT_OPTIONS.map((d) => ({ value: d, label: d }))}
          />
        </div>

        <div className="form-grid-2">
          <Input
            label="Designation *"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            error={errors.designation}
            placeholder="VP of Engineering"
          />
          <Input
            label="Joining Date"
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
          />
        </div>

        <div className="modal-footer" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create & Assign Manager
          </Button>
        </div>
      </form>
    </Modal>
  );
}
