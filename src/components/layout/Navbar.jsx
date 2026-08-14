export default function Navbar({ currentUserRole, onRoleChange }) {
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
            <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
            <option value="EMPLOYEE">Regular Employee (Restricted)</option>
          </select>
        </div>

        {/* User Profile Badge */}
        <div className="user-profile-badge">
          <div className="avatar">SA</div>
          <div className="user-info">
            <span className="user-name">Alex Morgan</span>
            <span className="user-role-tag">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
