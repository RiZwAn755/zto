import { toast } from 'react-toastify';


class SessionManager {
  constructor() {
    this.sessionExpiredCallback = null;
    this.isModalShown = false;
  }

  /**
   * Set callback function to show session expired modal
   * @param {Function} callback - Function to show modal
   */
  setSessionExpiredCallback(callback) {
    this.sessionExpiredCallback = callback;
  }

  /**
   * Check if JWT token is expired
   * @param {string} token - JWT token
   * @returns {boolean} - True if token is expired
   */
  isTokenExpired(token) {
    if (!token) return true;

    try {
      // Decode JWT token (without verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired (with 30 seconds buffer)
      return payload.exp < (currentTime + 30);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return true;
    }
  }

  /**
   * Check current session status
   * @returns {boolean} - True if session is valid
   */
  checkSession() {
    const token = localStorage.getItem('token');
    
    if (this.isTokenExpired(token)) {
      this.handleSessionExpired();
      return false;
    }
    
    return true;
  }

  /**
   * Handle session expiration
   */
  handleSessionExpired() {
    if (this.isModalShown) return; // Prevent multiple modals
    
    this.isModalShown = true;
    
    // Clear any existing toasts
    toast.dismiss();
    
    // Show session expired modal
    if (this.sessionExpiredCallback) {
      this.sessionExpiredCallback();
    } else {
      // Fallback: redirect to login
      this.redirectToLogin();
    }
  }

  /**
   * Redirect to login page
   */
  redirectToLogin() {
    // Clear all stored data
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to login
    window.location.href = '/login';
  }

  /**
   * Reset modal state (called after modal is closed)
   */
  resetModalState() {
    this.isModalShown = false;
  }

  /**
   * Get token expiration time
   * @param {string} token - JWT token
   * @returns {Date|null} - Expiration date or null
   */
  getTokenExpiration(token) {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  }

  /**
   * Get time until token expires
   * @param {string} token - JWT token
   * @returns {number} - Time in seconds until expiration
   */
  getTimeUntilExpiration(token) {
    if (!token) return 0;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return Math.max(0, payload.exp - currentTime);
    } catch (error) {
      console.error('Error getting time until expiration:', error);
      return 0;
    }
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

export default sessionManager;
