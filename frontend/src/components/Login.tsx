import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {authService} from '../services/auth';
import { AuthContext } from '../context/AuthContext';

import './Register.css'; 

const Login = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await authService.login(formData);
            const { username, token } = response;
            login(username, token);
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your username and password.');
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
                        <label className="form-label" htmlFor="username">Username</label>
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
                        <label className="form-label" htmlFor="password">Password</label>
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
                    <p>
                        <Link className="link" to="/forgot-password">
                            Forgot Password?
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Login;
