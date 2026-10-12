import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user } = useAuth();
  
  return (
    <div>
      <nav className="layout-navbar">
        <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          <Link to="/">ShikshaLok</Link>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/features">Features</Link>
          <Link to="/contact">Contact</Link>
          {user ? (
            <Link to={`/${user.role}/dashboard`} className="btn btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border)', marginTop: '2rem' }}>
        <p>&copy; {new Date().getFullYear()} ShikshaLok. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
