import React, { useEffect, useState } from 'react';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { MdSavings } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { RiGovernmentFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { SiAnswer } from "react-icons/si";
import { TbLocationQuestion } from "react-icons/tb";
import { FcDebt, FcPaid } from "react-icons/fc";
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SidebarClient = ({ OpenSidebarToggle, OpenSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    axios.get("http://localhost:200/api/users/logout")
      .then(res => {
        if (res.status === 200) {
          localStorage.removeItem('token');
          navigate("/");
        } else {
          alert("Error logging out");
        }
      }).catch(err => {
        console.log(err);
        alert("Error logging out");
      });
  };

  return (
    <aside id='sidebar' className={OpenSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <RiGovernmentFill size={60} />
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>
      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <NavLink to="/dashboardclient">
            <BsFillGrid3X3GapFill className='icon' />Dashboard
          </NavLink>
        </li>
        <li className='sidebar-list-item'>
          <NavLink to="/dashboardclient/sendcomplaint">
            <TbLocationQuestion className='icon' />Send Complaint
          </NavLink>
        </li>
        <li className='sidebar-list-item'>
          <NavLink to="/dashboardclient/clientcomplains">
            <TbLocationQuestion className='icon' />My Complaints
          </NavLink>
        </li>
        <li className='sidebar-list-item'>
          <NavLink to="/dashboardclient/clientresponses">
            <SiAnswer className='icon' />My Responses
          </NavLink>
        </li>
        <li className='sidebar-list-item'>
          <NavLink to="/dashboardclient/settings">
            <IoMdSettings className='icon' />Settings
          </NavLink>
        </li>
        <li className='sidebar-list-item'>
          <NavLink to="" onClick={handleLogout}>
            <IoLogOutOutline className='icon' />Logout
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default SidebarClient;
