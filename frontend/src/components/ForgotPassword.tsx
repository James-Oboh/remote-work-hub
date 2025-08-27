// src/components/ForgotPassword.tsx
import React, { useState } from 'react';
import { authService } from '../services/auth';
import { Link } from 'react-router-dom';
import './Register.css'; // Re-use the same styles

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            // FIX: Pass an object with the email property
            const responseMessage = await authService.forgotPassword({ email });
            setMessage(responseMessage);
        } catch (err: any) {
            setError(err.message || 'Failed to send password reset link.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2 className="title">Forgot Password</h2>
                    <p className="subtitle">Enter your email to receive a password reset link.</p>
                </div>
                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="form-input"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <div className="register-footer">
                    <p>
                        Remember your password?{' '}
                        <Link className="link" to="/login">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;