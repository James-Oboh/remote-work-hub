import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import './Register.css'; 

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const resetToken = searchParams.get('token');
        if (!resetToken) {
            setError('No reset token found. Please use the link from your email.');
        } else {
            setToken(resetToken);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        if (!token) {
            setError('Invalid or missing token.');
            setIsLoading(false);
            return;
        }

        try {
            const responseMessage = await authService.resetPassword({ token, newPassword });
            setMessage(responseMessage);
            setTimeout(() => {
                navigate('/login');
            }, 3000); // Redirect to login after 3 seconds
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token && !error) {
        return <div className="register-container"><p>Loading...</p></div>;
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2 className="title">Reset Password</h2>
                    <p className="subtitle">Enter your new password below.</p>
                </div>
                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            className="form-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;