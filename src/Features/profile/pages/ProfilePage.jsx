import { useState } from 'react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Toast from '../../../components/feedback/Toast';

export default function ProfilePage({ currentUserRole = 'EMPLOYEE' }) {
  const isManager = currentUserRole === 'MANAGER';
  const isSuperAdmin = currentUserRole === 'SUPER_ADMIN';

  const [profile, setProfile] = useState({
    firstName: isSuperAdmin ? 'Alex' : isManager ? 'Sarah' : 'John',
    lastName: isSuperAdmin ? 'Morgan' : isManager ? 'Jenkins' : 'Doe',
    email: isSuperAdmin ? 'admin@hrms.com' : isManager ? 'sarah.jenkins@acmeglobal.com' : 'john.doe@acmeglobal.com',
    phone: '+1 (555) 819-2049',
    address: '742 Evergreen Terrace, San Francisco, CA',
    department: isSuperAdmin ? 'Executive Board' : 'Engineering',
    designation: isSuperAdmin ? 'Chief System Administrator' : isManager ? 'Engineering Director' : 'Senior Frontend Developer',
    role: currentUserRole,
    organization: isSuperAdmin ? 'Global Enterprise' : 'Acme Global Technologies'
  });

  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({ message: 'Profile information updated successfully!', type: 'success' });
  };

  return (
    <div className="org-page-container">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="org-page-header">
        <div>
          <div className="page-breadcrumb">
            <span>Account</span>
            <span className="separator">/</span>
            <span className="active">My Profile</span>
          </div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">View and update permitted personal information.</p>
        </div>
      </div>

      <div className="stat-card" style={{ padding: '32px', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} className="hrms-form-container">
          <div className="form-section-title">Personal Contact Details</div>
          <div className="form-grid-2">
            <Input
              label="First Name"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
            <Input
              label="Last Name"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            />
          </div>

          <div className="form-grid-2">
            <Input
              label="Email Address (Read Only)"
              value={profile.email}
              disabled
            />
            <Input
              label="Phone Number"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>

          <Input
            label="Residential Address"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          />

          <div className="form-section-title" style={{ marginTop: '24px' }}>Employment Details (Managed by HR)</div>
          <div className="form-grid-2">
            <Input label="Role" value={profile.role} disabled />
            <Input label="Organization" value={profile.organization} disabled />
          </div>

          <div className="form-grid-2">
            <Input label="Department" value={profile.department} disabled />
            <Input label="Designation" value={profile.designation} disabled />
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary">Save Profile Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
