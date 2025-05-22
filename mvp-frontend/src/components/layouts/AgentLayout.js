import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarAgent from '../../pages/dashboards/admin-users/SidebarAgent';
import DashHeader from '../../pages/dashboards/admin-users/DashHeader';

const AgentLayout = () => {
  return (
    <div>
      <DashHeader />
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <SidebarAgent />
        <main style={{ flex: 1, padding: '1rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AgentLayout;
