import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🚀</span>
          <span className="brand-text">RemoteHub</span>
        </Link>

        {/* Hamburger toggle */}
        <button
          className={`menu-toggle ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Menu Links */}
        <div className={`navbar-menu ${isOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
          {user && (
            <>
              <Link to="/teams" className="nav-link" onClick={() => setIsOpen(false)}>Teams</Link>
              <Link to="/tasks" className="nav-link" onClick={() => setIsOpen(false)}>Tasks</Link>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className={`user-menu ${isOpen ? "open" : ""}`}>
          {user ? (
            <>
              <span className="username">{user}</span>
              <button onClick={logout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
