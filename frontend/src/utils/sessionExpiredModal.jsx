import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaSignInAlt, FaTimes } from 'react-icons/fa';
import './sessionExpiredModal.css';

const SessionExpiredModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Countdown timer
      let countdown = 5;
      const countdownInterval = setInterval(() => {
        countdown--;
        const countdownElement = document.querySelector('.countdown-number');
        if (countdownElement) {
          countdownElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          handleRedirect();
        }
      }, 1000);
      
      // Auto-redirect after 5 seconds (fallback)
      const timer = setTimeout(() => {
        handleRedirect();
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const handleRedirect = () => {
    // Clear all stored data
    localStorage.clear();
    sessionStorage.clear();
    
    // Close modal and redirect
    onClose();
    navigate('/login');
  };

  const handleClose = () => {
    onClose();
    handleRedirect();
  };

  if (!isOpen) return null;

  return (
    <div className="session-modal-overlay">
      <div className="session-modal-container">
        {/* Animated background elements */}
        <div className="modal-bg-elements">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
        </div>

        <div className="session-modal-content">
          {/* Close button */}
          <button className="modal-close-btn" onClick={handleClose}>
            <FaTimes />
          </button>

          {/* Main content */}
          <div className="modal-icon-container">
            <div className="icon-wrapper">
              <FaExclamationTriangle className="warning-icon" />
            </div>
          </div>

          <h2 className="modal-title">Session Expired</h2>
          
          <p className="modal-description">
            Your session has expired for security reasons. Please log in again to continue using the application.
          </p>

          <div className="modal-features">
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>Secure session management</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>Automatic redirect in 5 seconds</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>Your data is safe</span>
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn-primary" onClick={handleRedirect}>
              <FaSignInAlt />
              <span>Login Now</span>
            </button>
            
            <div className="countdown-container">
              <div className="countdown-text">Redirecting in</div>
              <div className="countdown-timer">
                <div className="countdown-number">5</div>
                <div className="countdown-unit">seconds</div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <p className="footer-text">
              Need help? Contact our support team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
