import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>🏢 {user?.organisation?.name || 'HRMS'}</h2>
        </div>
        <div className="navbar-links">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/employees" 
            className={`nav-link ${isActive('/employees') ? 'active' : ''}`}
          >
            Employees
          </Link>
          <Link 
            to="/teams" 
            className={`nav-link ${isActive('/teams') ? 'active' : ''}`}
          >
            Teams
          </Link>
        </div>
        <div className="navbar-user">
          <span className="user-name">{user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;