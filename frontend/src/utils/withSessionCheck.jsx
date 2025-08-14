import React, { useState, useEffect } from 'react';
import SessionExpiredModal from './sessionExpiredModal.jsx';
import sessionManager from './sessionManager.js';

/**
 * Higher-Order Component to add session checking to any component
 * @param {React.Component} WrappedComponent - Component to wrap
 * @returns {React.Component} - Wrapped component with session checking
 */
const withSessionCheck = (WrappedComponent) => {
  const WithSessionCheck = (props) => {
    const [showSessionModal, setShowSessionModal] = useState(false);

    useEffect(() => {
      // Set up session expired callback
      sessionManager.setSessionExpiredCallback(() => {
        setShowSessionModal(true);
      });

      // Check session on mount
      sessionManager.checkSession();

      // Set up periodic session checking (every 30 seconds)
      const sessionCheckInterval = setInterval(() => {
        sessionManager.checkSession();
      }, 30000);

      // Set up token expiration monitoring
      const token = localStorage.getItem('token');
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
    }, []);

    const handleSessionModalClose = () => {
      setShowSessionModal(false);
      sessionManager.resetModalState();
    };

    return (
      <>
        <WrappedComponent {...props} />
        <SessionExpiredModal 
          isOpen={showSessionModal} 
          onClose={handleSessionModalClose} 
        />
      </>
    );
  };

  // Set display name for debugging
  WithSessionCheck.displayName = `withSessionCheck(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithSessionCheck;
};

export default withSessionCheck;
