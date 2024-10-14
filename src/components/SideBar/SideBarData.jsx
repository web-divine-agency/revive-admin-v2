import React from 'react';
import users_list from '../../assets/images/users_list.png';
import users_management from '../../assets/images/users_management.png';
import staff_logs from '../../assets/images/staff_logs.png';
import tickets_history from '../../assets/images/tickets_history.png';
import branches from '../../assets/images/branches.png';
import log_out from '../../assets/images/log_out.png';
import generate_ticket from '../../assets/images/generate_ticket.png';
import queue_list from '../../assets/images/queue_list.png';
import "./SideBar.css";


export const AdminSidebarData = [
  {
    title: 'Users List',
    path: '/userlist',
    icon: <img className='navIcon' src={users_list} alt="Custom Icon" style={{ width: '24px', height: '24px' }} />,
    cName: 'nav-text'
  },
  {
    title: 'User Management',
    path: '/user-management',
    icon: <img className='navIcon' src={users_management} alt="Custom Icon" style={{ width: '24px', height: '24px' }} />,
    cName: 'nav-text'
  },
  {
    title: 'Staff Logs',
    path: '/staff-logs',
    icon: <img className='navIcon' src={staff_logs} alt="Custom Icon" style={{ width: '24px', height: '24px' }} />,
    cName: 'nav-text'
  },
  {
    title: 'Tickets History',
    path: '/tickets-history',
    icon: <img className='navIcon' src={tickets_history} alt="Custom Icon" style={{ width: '24px', height: '24px' }} />,
    cName: 'nav-text'
  },
  {
    title: 'Branches',
    path: '/branches',
    icon: <img className='navIcon' src={branches} alt="Custom Icon" style={{ width: '24px', height: '24px' }} />,
    cName: 'nav-text'
  },
  {
    title: 'Logout',
    path: '/',
    icon: <img className='navIcon' src={log_out} alt="Custom Icon" style={{ width: '24px', height: '24px' }} />,
    cName: 'nav-text',
    onClick: (event, logout) => logout(event)
  }
];

export const StaffSidebarData = [
  {
    title: 'Generate Ticket',
    path: '/generate-tickets',
    icon: <img className='navIcon' src={generate_ticket} alt="Custom Icon" style={{ width: '24px', height: '24px' }} />,
    cName: 'nav-text'
  },
  {
    title: 'History',
    path: '/history',
    icon: <img className='navIcon' src={tickets_history} alt="Custom Icon" style={{ width: '24px', height: '24px' }} />,
    cName: 'nav-text'
  },
  // {
  //   title: 'Queue List',
  //   path: '/queue-list',
  //   icon: <img src={queue_list} alt="Custom Icon" style={{ width: '24px', height: '24px' }} />,
  //   cName: 'nav-text'
  // },
  {
    title: 'Logout',
    path: '/',
    icon: <img className='navIcon' src={log_out} alt="Custom Icon" style={{ width: '24px', height: '24px' }} />,
    cName: 'nav-text',
    onClick: (event, logout) => logout(event)
  }
];
