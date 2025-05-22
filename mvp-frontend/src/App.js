import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import { Home, Contact, Login, Register, Reset } from './pages';
import SeeAllUsers from './pages/getting/members/SeeAllUsers';
import SendComplaint from './pages/complaint/SendComplaint';
import Dash from './pages/dashboards/admin-users/Dash';
import DashClient from './pages/dashboards/admin-users/DashClient';
import DashAgent from './pages/dashboards/admin-users/DashAgent';
import Respond from './pages/repond/Repond';
import ComplaintsPage from './pages/getting/complaints/ConplaintsPage';
import ComplaintsAdminPage from './pages/getting/complaints/ComplaintsAdminPage';
import ClientComplaintsPage from './pages/getting/complaints/ClientComplainsPage';
import GetAllResponses from './pages/getting/reponses/GetAllResponses';
import MyResponsesPage from './pages/getting/reponses/MyResponsesPage';
// Layouts & Utils
import PagesLayout from './components/layouts/PagesLayout';
import AdminLayout from './components/layouts/AdminLayout';
import ClientLayout from './components/layouts/ClientLayout';
import AgentLayout from './components/layouts/AgentLayout';
import PrivateRoutes from './pages/utils/PrivateRoutes';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<PagesLayout />}>
          <Route index element={<Home />} />
          {/* <Route path="contact" element={<Contact />} /> */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reset" element={<Reset />} />
        </Route>

        {/* Admin */}
        <Route path="/dashboardadmin" element={<AdminLayout />}>
          <Route index element={<Dash />} />
          <Route path="seeallusers" element={<SeeAllUsers />} />
          <Route path="complaints" element={<ComplaintsAdminPage />} />
          <Route path="getallresponses" element={<GetAllResponses />} />
        </Route>

        {/* Client */}
       {/* Client Routes */}
      <Route path="/dashboardclient" element={<ClientLayout />}>
        <Route index element={<DashClient />} />
        <Route element={<PrivateRoutes />}>
          <Route path="sendcomplaint" element={<SendComplaint />} />
          <Route path="clientcomplains" element={<ClientComplaintsPage />} />
          <Route path="clientresponses" element={<MyResponsesPage />} />
          {/* <Route path="settings" element={<Settings />} /> */}
        </Route>
      </Route>

        {/* Agent */}
 <Route path="/dashboardagent" element={<AgentLayout />}>
        <Route index element={<DashAgent />} />
        
        {/* Protect these routes with PrivateRoutes */}
        <Route element={<PrivateRoutes />}>
          <Route path="respond" element={<Respond />} />
          <Route path="boardcomplaints" element={<ComplaintsPage />} />
        </Route>
      </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
