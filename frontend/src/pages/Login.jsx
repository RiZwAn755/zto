import React, { useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";

const baseUrl = import.meta.env.VITE_BASE_URL;

const Login = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${baseUrl}/Login`,
        {
          email: formData.email.trim(),
          password: formData.password.trim(),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role || "user");

        toast.success("Logged in successfully!");

        // 🔥 SEND STUDENT TO APP
        onSuccess(data.user || data);

        setTimeout(() => {
          navigate("/studentDashboard");
        }, 800);
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${baseUrl}/auth/google`,
        { token: credentialResponse.credential },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.userType || "user");

        toast.success("Google login successful!");

        onSuccess(data.user);

        setTimeout(() => {
          navigate("/studentDashboard");
        }, 800);
      } else {
        toast.error("Google login failed");
      }
    } catch (err) {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
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

          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <Link to="/forgotPassword">Forgot Password?</Link>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="divider"><span>or</span></div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google login failed")}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
