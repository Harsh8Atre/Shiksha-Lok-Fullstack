import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  // Close the mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !toggleRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/features', label: 'Features' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className="main-layout">
      <header className="layout-navbar main-navbar">
        <Link
          to="/"
          className="main-brand"
          onClick={closeMenu}
        >
          ShikshaLok
        </Link>

        {/* Desktop navigation */}
        <nav className="main-desktop-nav">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `main-nav-link ${isActive ? 'active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {user ? (
            <Link
              to={`/${user.role}/dashboard`}
              className="btn btn-primary"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          ref={toggleRef}
          type="button"
          className="main-menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="main-mobile-nav"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Mobile navigation panel */}
        <nav
          id="main-mobile-nav"
          ref={menuRef}
          className={`main-mobile-nav ${menuOpen ? 'open' : ''}`}
          aria-hidden={!menuOpen}
        >
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `main-mobile-link ${isActive ? 'active' : ''}`
              }
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              {item.label}
            </NavLink>
          ))}

          {user ? (
            <Link
              to={`/${user.role}/dashboard`}
              className="btn btn-primary main-mobile-action"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              Dashboard
            </Link>
          ) : (
            <div className="main-mobile-actions">
              <Link
                to="/login"
                className="btn btn-outline"
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer
        style={{
          padding: '2rem',
          textAlign: 'center',
          borderTop: '1px solid var(--border)',
          marginTop: '2rem',
        }}
      >
        <p>
          &copy; {new Date().getFullYear()} ShikshaLok. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default MainLayout;
