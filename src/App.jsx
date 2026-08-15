import { useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import OrganizationPage from './Features/organization/pages/OrganizationPage';
import EmployeeListPage from './Features/emp/pages/EmployeeListPage';
import AttendancePage from './Features/attendernce/pages/AttendancePage';
import LeavePage from './Features/leave/pages/LeavePage';
import TaskPage from './Features/tasks/pages/TaskPage';
import CalendarPage from './Features/calendar/pages/CalendarPage';
import ActivityLogPage from './Features/activityLogs/pages/ActivityLogPage';
import NotificationPage from './Features/notifications/pages/NotificationPage';
import ProfilePage from './Features/profile/pages/ProfilePage';

import SuperAdminDashboard from './Features/dashboard/pages/SuperAdminDashboard';
import ManagerDashboard from './Features/dashboard/pages/ManagerDashboard';
import EmployeeDashboard from './Features/dashboard/pages/EmployeeDashboard';

function App() {
  const [currentUserRole, setCurrentUserRole] = useState('SUPER_ADMIN');
  const [activeNav, setActiveNav] = useState('dashboard');

  const handleRoleChange = (newRole) => {
    setCurrentUserRole(newRole);
    // Reset active nav when role changes
    if (newRole === 'SUPER_ADMIN') {
      setActiveNav('organizations');
    } else {
      setActiveNav('dashboard');
    }
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'organizations':
        return <OrganizationPage currentUserRole={currentUserRole} />;
      case 'employees':
        return <EmployeeListPage currentUserRole={currentUserRole} onNavigate={setActiveNav} />;
      case 'attendance':
        return <AttendancePage currentUserRole={currentUserRole} />;
      case 'leave':
        return <LeavePage currentUserRole={currentUserRole} />;
      case 'tasks':
        return <TaskPage currentUserRole={currentUserRole} />;
      case 'calendar':
        return <CalendarPage currentUserRole={currentUserRole} />;
      case 'activityLogs':
        return <ActivityLogPage currentUserRole={currentUserRole} />;
      case 'notifications':
        return <NotificationPage currentUserRole={currentUserRole} />;
      case 'profile':
        return <ProfilePage currentUserRole={currentUserRole} />;
      case 'dashboard':
      default:
        if (currentUserRole === 'SUPER_ADMIN') {
          return <SuperAdminDashboard onNavigate={setActiveNav} />;
        }
        if (currentUserRole === 'MANAGER') {
          return <ManagerDashboard onNavigate={setActiveNav} />;
        }
        return <EmployeeDashboard onNavigate={setActiveNav} />;
    }
  };

  return (
    <AppLayout
      currentUserRole={currentUserRole}
      onRoleChange={handleRoleChange}
      activeNav={activeNav}
      onNavSelect={setActiveNav}
    >
      {renderContent()}
    </AppLayout>
  );
}

export default App;
