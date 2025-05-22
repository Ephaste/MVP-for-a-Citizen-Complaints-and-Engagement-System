import {React, useEffect, useState} from 'react'
import { BsCart3 , BsPeopleFill, BsFillGrid3X3GapFill} from 'react-icons/bs'
import { RiGovernmentFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { TbLocationQuestion } from "react-icons/tb";
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const SidebarClient = ({OpenSidebarToggle, OpenSidebar}) => {
  const  navigate = useNavigate();
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
 <aside id='sidebar' className={OpenSidebarToggle ? "sidebar-responsive": ""}>
    <div className='sidebar-title'>
        <div className='sidebar-brand'>
        <RiGovernmentFill size={60} />
        </div>
<span className='icon close_icon' onClick={OpenSidebar}>X</span>
    </div>
    <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
            <NavLink to="/dashboardagent">
      <BsFillGrid3X3GapFill className='icon'/>Dashboard
      </NavLink>
        </li>
        <li className='sidebar-list-item'>
          <NavLink to= "/dashboardagent/boardcomplaints">
          <TbLocationQuestion  className='icon'/>Complains
          </NavLink>
        </li>
        <li className='sidebar-list-item'>
          <NavLink to=  "/settings" > 
           <IoMdSettings  className='icon'/>Settings
           </NavLink>
        </li>
        <li className='sidebar-list-item'>
        <NavLink to="" onClick={handleLogout}>
            <IoLogOutOutline className='icon' />Logout
          </NavLink>
        </li>
    </ul>
 </aside>
  )
}

export default SidebarClient

