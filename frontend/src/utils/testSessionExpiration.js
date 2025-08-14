/**
 * Test utility for session expiration functionality
 * This file can be used to test the session expired modal
 */

import sessionManager from './sessionManager.js';

/**
 * Test function to simulate session expiration
 * Call this in browser console to test the modal
 */
export const testSessionExpiration = () => {
  console.log('🧪 Testing session expiration...');
  
  // Get current token
  const currentToken = localStorage.getItem('token');
  
  if (!currentToken) {
    console.log('❌ No token found. Please login first.');
    return;
  }
  
  console.log('✅ Current token found');
  console.log('🔍 Token expiration:', sessionManager.getTokenExpiration(currentToken));
  console.log('⏰ Time until expiration:', sessionManager.getTimeUntilExpiration(currentToken), 'seconds');
  
  // Force session expiration
  console.log('🚀 Triggering session expiration...');
  sessionManager.handleSessionExpired();
  
  console.log('✅ Session expiration test completed');
};

/**
 * Test function to create an expired token for testing
 * This creates a token that expires in 1 second
 */
export const createExpiredToken = () => {
  console.log('🔧 Creating expired token for testing...');
  
  // Create a fake expired token
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: 'test@example.com',
    exp: Math.floor(Date.now() / 1000) - 60, // Expired 1 minute ago
    iat: Math.floor(Date.now() / 1000) - 3600 // Issued 1 hour ago
  }));
  const signature = 'fake-signature';
  
  const expiredToken = `${header}.${payload}.${signature}`;
  
  // Store the expired token
  localStorage.setItem('token', expiredToken);
  localStorage.setItem('email', 'test@example.com');
  
  console.log('✅ Expired token created and stored');
  console.log('🔄 Refresh the page to see the session expired modal');
};

/**
 * Test function to create a token that expires soon
 * This creates a token that expires in 10 seconds
 */
export const createSoonExpiringToken = () => {
  console.log('⏰ Creating token that expires soon...');
  
  // Create a token that expires in 10 seconds
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: 'test@example.com',
    exp: Math.floor(Date.now() / 1000) + 10, // Expires in 10 seconds
    iat: Math.floor(Date.now() / 1000) - 3600 // Issued 1 hour ago
  }));
  const signature = 'fake-signature';
  
  const soonExpiringToken = `${header}.${payload}.${signature}`;
  
  // Store the token
  localStorage.setItem('token', soonExpiringToken);
  localStorage.setItem('email', 'test@example.com');
  
  console.log('✅ Soon-expiring token created and stored');
  console.log('⏳ Token will expire in 10 seconds');
  console.log('🔄 The session expired modal should appear automatically');
};

/**
 * Clear test data
 */
export const clearTestData = () => {
  console.log('🧹 Clearing test data...');
  localStorage.clear();
  sessionStorage.clear();
  console.log('✅ Test data cleared');
};

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  window.testSessionExpiration = testSessionExpiration;
  window.createExpiredToken = createExpiredToken;
  window.createSoonExpiringToken = createSoonExpiringToken;
  window.clearTestData = clearTestData;
  
  console.log('🧪 Session expiration test utilities loaded!');
  console.log('📝 Available functions:');
  console.log('  - testSessionExpiration() - Test the modal manually');
  console.log('  - createExpiredToken() - Create an expired token');
  console.log('  - createSoonExpiringToken() - Create a token that expires soon');
  console.log('  - clearTestData() - Clear all test data');
}
