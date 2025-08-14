import { toast } from 'react-toastify';

/**
 * Handles rate limit errors (429 status) and shows appropriate toast message
 * @param {Error} error - The error object from axios/fetch
 * @param {string} defaultMessage - Default error message if rate limit message can't be parsed
 */
export const handleRateLimitError = (error, defaultMessage = ' limit exceeded. Please try again later.') => {
  // Check if it's a 429 status code (rate limit exceeded)
  if (error.response?.status === 429) {
    const errorMessage = error.response?.data;
    
    // Extract retry time from the backend message: "you reached the requestLimit, Try again in X seconds"
    if (typeof errorMessage === 'string' && errorMessage.includes('Try again in')) {
      const match = errorMessage.match(/Try again in (\d+) seconds/);
      if (match) {
        const seconds = match[1];
        toast.error(` limit reached. Please try again in ${seconds} seconds.`);
        return;
      }
    }
    
    // Fallback if we can't parse the time
    toast.error(errorMessage || defaultMessage);
    return;
  }
  
  // For non-rate-limit errors, throw the error to be handled by the calling function
  throw error;
};

/**
 * Handles rate limit errors for fetch requests
 * @param {Response} response - The fetch response object
 * @param {string} defaultMessage - Default error message if rate limit message can't be parsed
 */
export const handleFetchRateLimitError = async (response, defaultMessage = ' limit exceeded. Please try again later.') => {
  if (response.status === 429) {
    const errorText = await response.text();
    
    // Extract retry time from the backend message
    if (errorText.includes('Try again in')) {
      const match = errorText.match(/Try again in (\d+) seconds/);
      if (match) {
        const seconds = match[1];
        toast.error(`limit reached. Please try again in ${seconds} seconds.`);
        return true; // Indicates rate limit was handled
      }
    }
    
    // Fallback if we can't parse the time
    toast.error(errorText || defaultMessage);
    return true; // Indicates rate limit was handled
  }
  
  return false; // Not a rate limit error
};
