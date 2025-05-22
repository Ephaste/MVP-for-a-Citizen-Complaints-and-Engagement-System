import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../../pages/dashboards/admin-users/SidebarAdmin';
import DashHeader from '../../pages/dashboards/admin-users/DashHeader';

const AdminLayout = () => {
  return (
    <div>
      <DashHeader />
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <SidebarAdmin />
        <main style={{ flex: 1, padding: '1rem', backgroundColor: '#f5f5f5' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
