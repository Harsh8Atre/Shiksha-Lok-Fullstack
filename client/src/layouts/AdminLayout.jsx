import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  FiHome, FiUsers, FiBook, FiVideo, FiActivity,
  FiCheckSquare, FiBell, FiLogOut, FiMenu
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !hamburgerRef.current?.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [sidebarOpen]);

  const navItems = [
    { path: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { path: '/admin/courses', icon: <FiBook />, label: 'Courses' },
    { path: '/admin/classes', icon: <FiVideo />, label: 'Classes' },
    { path: '/admin/sessions', icon: <FiActivity />, label: 'Sessions' },
    { path: '/admin/attendance', icon: <FiCheckSquare />, label: 'Attendance' },
    { path: '/admin/alerts', icon: <FiBell />, label: 'Alerts' },
  ];

  return (
    <div>
      <aside
        ref={sidebarRef}
        className={`layout-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        <div
          style={{
            padding: '1.5rem',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            borderBottom: '1px solid #1e293b',
          }}
        >
          ShikshaLok Admin
        </div>

        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive ? '#1e293b' : 'transparent',
                textDecoration: 'none',
              })}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid #1e293b' }}>
          <button
            onClick={() => {
              setSidebarOpen(false);
              logout();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      <div className="layout-content">
        <header className="layout-navbar">
          <button
            ref={hamburgerRef}
            className="btn-outline hamburger d-md-none"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={sidebarOpen}
          >
            <FiMenu />
          </button>

          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <span>Admin: {user?.name}</span>
          </div>
        </header>

        <main style={{ padding: '1.5rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;