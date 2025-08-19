import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import { AuthContext } from '../context/AuthContext';
import './Register.css'; // Assuming the same styling for both

const Login: React.FC = () => {
    // We need to use the login function from our AuthContext
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Call the authService API to log in
            const response = await authService.login(formData);
            const { username, token } = response;

            // If login is successful, use the login function from AuthContext
            // to update the application's state and navigate.
            login(username, token);
            
            // The navigate call inside AuthContext.login() will handle the redirect.
            // You can remove the 'navigate('/')' call here.

        } catch (err: any) {
            setError(err.message || 'Login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2 className="title">Login</h2>
                    <p className="subtitle">Welcome back! Please log in.</p>
                </div>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="form-input"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="form-input"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="register-footer">
                    <p>
                        Don’t have an account?{' '}
                        <Link className="link" to="/register">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;