import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FiHome, FiBook, FiVideo, FiCheckSquare, FiFileText, FiBell, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/student/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/student/courses', icon: <FiBook />, label: 'Courses' },
    { path: '/student/classes', icon: <FiVideo />, label: 'Classes' },
    { path: '/student/attendance', icon: <FiCheckSquare />, label: 'Attendance' },
    { path: '/student/resources', icon: <FiFileText />, label: 'Resources' },
    { path: '/student/alerts', icon: <FiBell />, label: 'Alerts' },
    { path: '/student/profile', icon: <FiUser />, label: 'Profile' },
  ];

  return (
    <div>
      <aside className={`layout-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold', borderBottom: '1px solid #1e293b' }}>
          ShikshaLok
        </div>
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {navItems.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              style={({isActive}) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem',
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive ? '#1e293b' : 'transparent',
                textDecoration: 'none'
              })}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '1rem', borderTop: '1px solid #1e293b' }}>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', width: '100%' }}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
      
      <div className="layout-content">
        <header className="layout-navbar">
          <button className="btn btn-outline d-md-none" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu />
          </button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Hi, {user?.name}</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main style={{ padding: '1.5rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
