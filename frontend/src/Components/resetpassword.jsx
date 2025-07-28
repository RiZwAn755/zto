import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ResetPassword.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [tokenValid, setTokenValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            // You can add token validation here if needed
            setTokenValid(true);
        } else {
            toast.error('Invalid reset link. Please request a new password reset.');
            setTimeout(() => navigate('/login'), 2000);
        }
    }, [searchParams, navigate]);

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "password":
                if (!value) error = "Password is required";
                else if (value.length < 6) error = "Password must be at least 6 characters";
                else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    error = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
                }
                break;
            case "confirmPassword":
                if (!value) error = "Please confirm your password";
                else if (value !== formData.password) error = "Passwords do not match";
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate this field as user types
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validate all fields
        const newErrors = {};
        Object.keys(formData).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/reset-password`, {
                token: token,
                password: formData.password
            });

            toast.success('Password reset successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to reset password. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!tokenValid) {
        return (
            <div className="reset-password-wrapper">
                <div className="reset-password-card">
                    <div className="loading-message">
                        <div className="spinner"></div>
                        <p>Validating reset link...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-wrapper">
            <ToastContainer />
            <div className="reset-password-card">
                <div className="reset-password-header">
                    <h1>Reset Your Password</h1>
                    <p>Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit} className="reset-password-form">
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your new password"
                                required
                                disabled={loading}
                                className={errors.password ? 'error-input' : ''}
                            />
                            <span 
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </span>
                        </div>
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="password-input-container">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your new password"
                                required
                                disabled={loading}
                                className={errors.confirmPassword ? 'error-input' : ''}
                            />
                            <span 
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? '🙈' : '👁️'}
                            </span>
                        </div>
                        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                    </div>

                    <button 
                        type="submit" 
                        className="reset-button" 
                        disabled={loading}
                    >
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </form>

                <div className="back-to-login">
                    <span>Remember your password? </span>
                    <a href="/login">Back to Login</a>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;