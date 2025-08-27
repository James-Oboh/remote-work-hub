import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import './Navbar.css';

const Navbar: React.FC = () => {
    const { user, logout, role } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">🚀</span>
                    <span className="brand-text">RemoteHub</span>
                </Link>

                {/* ✨ FIX: Restored the navigation links that were accidentally removed */}
                <div className={`navbar-menu ${isOpen ? 'is-active' : ''}`}>
                    <Link to="/" onClick={() => setIsOpen(false)} className="nav-link">Home</Link>
                    {user && (
                        <>
                            <Link to="/teams" onClick={() => setIsOpen(false)} className="nav-link">Teams</Link>
                            <Link to="/tasks" onClick={() => setIsOpen(false)} className="nav-link">Tasks</Link>
                        </>
                    )}
                </div>

                <div className="user-menu">
                    {user ? (
                        <>
                            <div className="user-info hidden md:flex">
                                <span className="username">{user.username}</span>
                                {role && <span className="user-role">({role})</span>}
                            </div>
                            <button onClick={handleLogout} className="btn-logout">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-link">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;