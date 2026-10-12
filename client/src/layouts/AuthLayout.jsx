import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div style={{ width: '100%', maxWidth: '850px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>
            🎓 ShikshaLok
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
