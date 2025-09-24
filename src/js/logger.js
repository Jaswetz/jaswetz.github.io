/**
 * Development logger utility
 * Only logs in development environments, silent in production
 */

// Check if we're in development environment
const isDevelopment = () => {
  // Check for localhost or common development hostnames
  const hostname = window.location.hostname;
  return hostname === 'localhost' ||
         hostname === '127.0.0.1' ||
         hostname === '0.0.0.0' ||
         hostname.includes('.local');
};

// Logger object with conditional logging
const logger = {
  log: (...args) => {
    if (isDevelopment()) {
      console.log(...args);
    }
  },
  info: (...args) => {
    if (isDevelopment()) {
      console.info(...args);
    }
  },
  debug: (...args) => {
    if (isDevelopment()) {
      console.debug(...args);
    }
  },
  trace: (...args) => {
    if (isDevelopment()) {
      console.trace(...args);
    }
  }
};

export default logger;