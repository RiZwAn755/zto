import { Outlet, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import sessionManager from '../utils/sessionManager.js';
import SessionExpiredModal from '../utils/sessionExpiredModal.jsx';

const PrivateComponent = () => {
  const auth = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  const [redirect, setRedirect] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  useEffect(() => {
    // Set up session expired callback
    sessionManager.setSessionExpiredCallback(() => {
      setShowSessionModal(true);
    });

    // Check if user is authenticated and token is valid
    if (!auth || !token || sessionManager.isTokenExpired(token)) {
      toast.warn("Please login or signup to visit these page", { toastId: "login-warning" });
      const timer = setTimeout(() => setRedirect(true), 1000);
      return () => clearTimeout(timer);
    }

    // Check session on mount
    sessionManager.checkSession();

    // Set up periodic session checking (every 30 seconds)
    const sessionCheckInterval = setInterval(() => {
      sessionManager.checkSession();
    }, 30000);

    // Set up token expiration monitoring
    if (token) {
      const timeUntilExpiration = sessionManager.getTimeUntilExpiration(token);
      
      // If token expires in less than 5 minutes, check more frequently
      if (timeUntilExpiration < 300) {
        const frequentCheckInterval = setInterval(() => {
          sessionManager.checkSession();
        }, 10000); // Check every 10 seconds

        return () => {
          clearInterval(sessionCheckInterval);
          clearInterval(frequentCheckInterval);
        };
      }
    }

    return () => {
      clearInterval(sessionCheckInterval);
    };
  }, [auth, token]);

  const handleSessionModalClose = () => {
    setShowSessionModal(false);
    sessionManager.resetModalState();
  };

  if (!auth || !token || sessionManager.isTokenExpired(token)) {
    if (redirect) {
      return <Navigate to="/landing" />;
    }
    return <ToastContainer />;
  }
  return (
    <>
      <ToastContainer />
      <Outlet />
      <SessionExpiredModal 
        isOpen={showSessionModal} 
        onClose={handleSessionModalClose} 
      />
    </>
  );
};

export default PrivateComponent;
