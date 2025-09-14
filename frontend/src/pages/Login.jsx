import React, { useState } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleLogin } from '@react-oauth/google';

const baseUrl = import.meta.env.VITE_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting login:', formData);
      const { data } = await axios.post(
        `${baseUrl}/Login`,
        {
          email: formData.email.trim(),
          password: formData.password.trim()
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Backend response:', data);

      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email || formData.email);
        localStorage.setItem('role', data.role || 'user');

        toast.success('Logged in successfully!');

        setTimeout(() => {
          if (data.role === 'admin') navigate('/admin');
          else navigate('/');
        }, 1000);
      } else {
        toast.error(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        // Backend responded with error
        console.log('Error data:', err.response.data);
        toast.error(err.response.data.message || 'Unable to login');
      } else if (err.request) {
        // Request made but no response
        toast.error('No response from server. Please check your backend.');
      } else {
        // Something else
        toast.error(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      console.log('Google credential:', credentialResponse);
      const { data } = await axios.post(
        `${baseUrl}/auth/google`,
        { token: credentialResponse.credential },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Google login response:', data);

      if (data && data.user && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('role', data.user.userType || 'user');

        toast.success('Google login successful!');

        setTimeout(() => {
          if (data.user.userType === 'admin') navigate('/admin');
          else navigate('/');
        }, 1000);
      } else {
        toast.error(data.message || 'Google login failed.');
      }
    } catch (err) {
      console.error('Google login error:', err);
      toast.error('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className="login-wrapper">
      <ToastContainer />
      <div className="login-card">
        <h2>Let's Sign you in</h2>
        <p>Welcome Back,<br />You have been missed</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <div className="password-field">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <div className="forgotpassword">
            <Link to="/forgotPassword">Forgot Password?</Link>
          </div>

          <button type="submit" className="sign-in-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="divider"><span>or</span></div>

          <div className="social-icons">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              disabled={loading}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="300"
            />
          </div>

          <p className="register-link">
            Don’t have an account? <Link to="/register">Register Now</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
