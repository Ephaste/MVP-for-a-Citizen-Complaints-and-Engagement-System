import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarClient from '../../pages/dashboards/admin-users/SidebarClient';
import DashHeader from '../../pages/dashboards/admin-users/DashHeader';

const ClientLayout = () => {
  return (
    <div>
      <DashHeader />
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <SidebarClient />
        <main style={{ flex: 1, padding: '1rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
