import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { handleRateLimitError } from '../utils/rateLimitHandler.js';
import './ForgotPassword.css';

const ForgotPassword = () => {      
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/forgotPassword`, { email });
            setEmailSent(true);
            setError('');
        } catch (error) {
            try {
                handleRateLimitError(error, 'Failed to send reset link. Please try again.');
            } catch (handledError) {
                if (handledError.response?.data?.error) {
                    setError(handledError.response.data.error);
                } else {
                    setError('Failed to send reset link. Please try again.');
                }
            }
            setEmailSent(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-wrapper">
            <div className="forgot-password-card">
                {!emailSent ? (
                    <>
                        <div className="forgot-password-header">
                            <h1>Forgot Password?</h1>
                            <p>Don't worry! It happens. Please enter the email address associated with your account.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="forgot-password-form">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className={error ? 'error-input' : ''}
                                />
                                {error && <div className="error-message">{error}</div>}
                            </div>

                            <button 
                                type="submit" 
                                className="reset-button" 
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>

                        <div className="back-to-login">
                            <span>Remember your password? </span>
                            <a href="/login">Back to Login</a>
                        </div>
                    </>
                ) : (
                    <div className="email-sent-success">
                        <div className="success-icon">✓</div>
                        <h2>Check Your Email!</h2>
                        <p>We've sent a password reset link to:</p>
                        <div className="email-display">{email}</div>
                        <p className="instruction-text">
                            Please check your email and click the reset link to create a new password.
                        </p>
                        <div className="action-buttons">
                            <button 
                                className="resend-button"
                                onClick={() => {
                                    setEmailSent(false);
                                    setError('');
                                }}
                            >
                                Try Different Email
                            </button>
                            <a href="/login" className="back-to-login-link">
                                Back to Login
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;