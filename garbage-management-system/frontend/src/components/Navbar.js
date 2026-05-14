import React from 'react';
import { getUser } from '../services/authService';
import './Navbar.css';

export default function Navbar() {
  const user = getUser();
  return (
    <header className="navbar">
      <span className="navbar-welcome">Welcome, <strong>{user?.name || 'User'}</strong> 👋</span>
      <span className="navbar-date">{new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</span>
    </header>
  );
}
