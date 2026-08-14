import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppLayout({ children, currentUserRole = 'SUPER_ADMIN', onRoleChange }) {
  const [activeNav, setActiveNav] = useState('organizations');

  return (
    <div className="hrms-app-wrapper">
      <Navbar currentUserRole={currentUserRole} onRoleChange={onRoleChange} />
      <div className="hrms-main-layout">
        <Sidebar activeNav={activeNav} onNavSelect={setActiveNav} />
        <main className="hrms-content-area">
          {children}
        </main>
      </div>
    </div>
  );
}
