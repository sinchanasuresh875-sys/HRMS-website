export default function Navbar({ currentUserRole, onRoleChange }) {
  const getRoleUser = () => {
    switch (currentUserRole) {
      case 'SUPER_ADMIN':
        return { name: 'Alex Morgan', tag: 'Super Admin', avatar: 'SA', bg: '#1e293b' };
      case 'MANAGER':
        return { name: 'Sarah Jenkins', tag: 'Manager (Acme Tech)', avatar: 'SJ', bg: '#047857' };
      default:
        return { name: 'John Doe', tag: 'Employee', avatar: 'JD', bg: '#4f46e5' };
    }
  };

  const user = getRoleUser();

  return (
    <header className="hrms-navbar">
      <div className="navbar-brand">
        <div className="brand-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <span className="brand-title">HRMS Portal</span>
      </div>

      <div className="navbar-right">
        {/* Role Simulator Switcher */}
        <div className="role-simulator">
          <span className="role-sim-label">Simulate Role:</span>
          <select
            value={currentUserRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="role-sim-select"
            title="Switch User Role for Access Testing"
          >
            <option value="SUPER_ADMIN">Super Admin (Org Owner)</option>
            <option value="MANAGER">Manager (Sarah Jenkins)</option>
            <option value="EMPLOYEE">Employee (John Doe)</option>
          </select>
        </div>

        {/* User Profile Badge */}
        <div className="user-profile-badge">
          <div className="avatar" style={{ backgroundColor: user.bg }}>{user.avatar}</div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role-tag">{user.tag}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
