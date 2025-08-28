/**
 * Centralized logging utility with environment-based controls
 * Replaces scattered console.log statements throughout the codebase
 */

class Logger {
  constructor() {
    this.isDevelopment = this.checkEnvironment();
    this.logLevels = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
    };
    this.currentLevel = this.isDevelopment
      ? this.logLevels.DEBUG
      : this.logLevels.WARN;
  }

  /**
   * Check if we're in development environment
   * @returns {boolean} True if in development
   */
  checkEnvironment() {
    // Safely check process.env to avoid ReferenceError in browsers
    const nodeEnv =
      typeof process !== "undefined" && process.env && process.env.NODE_ENV;

    return (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "" ||
      window.location.protocol === "file:" ||
      nodeEnv === "development" ||
      // Additional dev environment indicators
      window.location.port !== "" ||
      window.location.hostname.includes("dev") ||
      window.location.hostname.includes("staging")
    );
  }

  /**
   * Set the minimum log level
   * @param {string} level - DEBUG, INFO, WARN, or ERROR
   */
  setLevel(level) {
    if (this.logLevels[level] !== undefined) {
      this.currentLevel = this.logLevels[level];
    }
  }

  /**
   * Format log message with timestamp and context
   * @param {string} level - Log level
   * @param {string} message - Main message
   * @param {...any} args - Additional arguments
   * @returns {Array} Formatted arguments for console
   */
  formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString().substr(11, 12);
    const prefix = `[${timestamp}] [${level}]`;
    return [prefix, message, ...args];
  }

  /**
   * Debug level logging - only in development
   * @param {string} message - Debug message
   * @param {...any} args - Additional arguments
   */
  debug(message, ...args) {
    if (this.currentLevel <= this.logLevels.DEBUG) {
      console.log(...this.formatMessage("DEBUG", message, ...args));
    }
  }

  /**
   * Info level logging
   * @param {string} message - Info message
   * @param {...any} args - Additional arguments
   */
  info(message, ...args) {
    if (this.currentLevel <= this.logLevels.INFO) {
      console.info(...this.formatMessage("INFO", message, ...args));
    }
  }

  /**
   * Warning level logging
   * @param {string} message - Warning message
   * @param {...any} args - Additional arguments
   */
  warn(message, ...args) {
    if (this.currentLevel <= this.logLevels.WARN) {
      console.warn(...this.formatMessage("WARN", message, ...args));
    }
  }

  /**
   * Error level logging - always shown
   * @param {string} message - Error message
   * @param {...any} args - Additional arguments
   */
  error(message, ...args) {
    if (this.currentLevel <= this.logLevels.ERROR) {
      console.error(...this.formatMessage("ERROR", message, ...args));
    }
  }

  /**
   * Group logging for related messages
   * @param {string} groupName - Name of the group
   * @param {Function} callback - Function containing grouped logs
   */
  group(groupName, callback) {
    if (this.isDevelopment) {
      console.group(groupName);
      try {
        callback();
      } finally {
        console.groupEnd();
      }
    }
  }

  /**
   * Performance timing utility
   * @param {string} label - Timer label
   * @returns {Function} Function to end the timer
   */
  time(label) {
    if (this.isDevelopment) {
      console.time(label);
      return () => console.timeEnd(label);
    }
    return () => {}; // No-op in production
  }

  /**
   * Table logging for structured data
   * @param {Array|Object} data - Data to display in table format
   * @param {string} label - Optional label
   */
  table(data, label = "") {
    if (this.isDevelopment) {
      if (label) {
        console.log(label);
      }
      console.table(data);
    }
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;

// Export individual methods for convenience
export const { debug, info, warn, error, group, time, table } = logger;
