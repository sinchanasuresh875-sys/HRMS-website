import { useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import OrganizationPage from './Features/organization/pages/OrganizationPage';

function App() {
  const [currentUserRole, setCurrentUserRole] = useState('SUPER_ADMIN');

  return (
    <AppLayout currentUserRole={currentUserRole} onRoleChange={setCurrentUserRole}>
      <OrganizationPage currentUserRole={currentUserRole} />
    </AppLayout>
  );
}

export default App;
