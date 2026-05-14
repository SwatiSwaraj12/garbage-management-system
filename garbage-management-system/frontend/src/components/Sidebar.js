// Sidebar.js - Navigation sidebar for authenticated users
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getUser, logout, isAdmin } from '../services/authService';
import './Sidebar.css';

export default function Sidebar() {
  const user = getUser();
  const navigate = useNavigate();
  const admin = isAdmin();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // User menu items
  const userLinks = [
    { to: '/dashboard',    icon: '🏠', label: 'Dashboard' },
    { to: '/request/new',  icon: '➕', label: 'New Request' },
    { to: '/track',        icon: '📍', label: 'Track Status' },
  ];

  // Admin menu items
  const adminLinks = [
    { to: '/admin',          icon: '📊', label: 'Dashboard' },
    { to: '/admin/requests', icon: '📋', label: 'All Requests' },
    { to: '/admin/users',    icon: '👥', label: 'Manage Users' },
  ];

  const links = admin ? adminLinks : userLinks;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">♻️</div>
        <div>
          <h2>GarbageMS</h2>
          <span>{admin ? 'Admin Panel' : 'User Portal'}</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="sidebar-nav">
        <p className="sidebar-section-title">MENU</p>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* User Info + Logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.name}</p>
            <p className="sidebar-user-role">{user?.role}</p>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
