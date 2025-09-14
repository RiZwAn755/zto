import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("email"));
  const navigate = useNavigate();

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    toast.success('Log out successful!');
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setTimeout(() => navigate("/landing"), 1000);
  };

  return (
    <>
      <ToastContainer />
      <nav className={`navbar ${isOpen ? 'open' : ''} ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-logo">
          <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => navigate("/")}>
            <h1>ZTO</h1>
          </button>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span className={isOpen ? 'active' : ''}></span>
          <span className={isOpen ? 'active' : ''}></span>
          <span className={isOpen ? 'active' : ''}></span>
        </div>

        {isOpen ? (
          <div className="navbar-menu-group">
            <ul className="navbar-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/exams">Exams</Link></li>
              <li><Link to="/resources">Resources</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/checkresult">Results</Link></li>
            </ul>
            <div className="navbar-buttons">
              {!isLoggedIn && <button className="login-btn" onClick={handleLogin}>Login</button>}
              {isLoggedIn && <button className="getstarted-btn" onClick={handleLogout}>Logout</button>}
            </div>
          </div>
        ) : (
          <>
            <ul className="navbar-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/exams">Exams</Link></li>
              <li><Link to="/resources">Resources</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/checkresult">Results</Link></li>
<li>
  <Link
    to="/AskAI"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 22px',
      borderRadius: '50px',
      background: 'linear-gradient(270deg, #4facfe, #00f2fe, #43e97b, #4facfe)',
      backgroundSize: '600% 600%',
      color: '#fff',
      fontWeight: '600',
      fontSize: '14px',
      textDecoration: 'none',
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      animation: 'gradientShift 3s ease infinite',
      position: 'relative', // default for desktop
    }}
    onMouseEnter={e => {
      e.target.style.transform = 'scale(1.1)';
      e.target.style.boxShadow = '0 0 25px rgba(0, 255, 255, 0.6)';
    }}
    onMouseLeave={e => {
      e.target.style.transform = 'scale(1)';
      e.target.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
    }}
    className="ai-chat-btn"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="currentColor"
      viewBox="0 0 16 16"
      style={{ display: 'inline-block' }}
    >
      <path d="M8 1a7 7 0 0 0-6.993 6.728L1 8a7 7 0 1 0 7-7zm0 1a6 6 0 0 1 5.995 5.775L14 8a6 6 0 1 1-6-6z" />
      <path d="M8 3a5 5 0 0 0-4.995 4.775L3 8a5 5 0 1 0 5-5z" />
    </svg>
    Dobuts ?
  </Link>
</li>



            </ul>
            <div className="navbar-buttons">
              {!isLoggedIn && <button className="login-btn" onClick={handleLogin}>Login</button>}
              {isLoggedIn && <button className="getstarted-btn" onClick={handleLogout}>Logout</button>}
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;
