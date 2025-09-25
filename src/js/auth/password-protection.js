/**
 * Password Protection System
 *
 * This module handles the password authentication for protected case studies.
 * It provides a secure, user-friendly interface for password protection.
 */

import { PASSWORD_CONFIG, getCaseStudyConfig } from "./password-config.js";

export class PasswordProtection {
  constructor(caseStudyId) {
    this.caseStudyId = caseStudyId;
    this.config = getCaseStudyConfig(caseStudyId);
    this.storageKey = `${PASSWORD_CONFIG.global.storagePrefix}${caseStudyId}`;

    // Bind methods to maintain context
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  /**
   * Initialize password protection for the current page
   */
  init() {
    if (!this.config) {
      console.warn(
        `No password configuration found for case study: ${this.caseStudyId}`
      );
      return;
    }

    // Check if user is already authenticated
    if (this.isAuthenticated()) {
      this.showContent();
      return;
    }

    // Hide main content and show password prompt
    this.hideContent();
    this.showPasswordPrompt();
  }

  /**
   * Check if user is authenticated for this case study
   * @returns {boolean} True if authenticated and session is valid
   */
  isAuthenticated() {
    try {
      const authData = localStorage.getItem(this.storageKey);
      if (!authData) {return false;}

      const { timestamp } = JSON.parse(authData);
      const now = Date.now();
      const sessionDuration = PASSWORD_CONFIG.global.sessionDuration;

      // Check if session has expired
      if (now - timestamp > sessionDuration) {
        localStorage.removeItem(this.storageKey);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }

  /**
   * Authenticate user with provided password
   * @param {string} password - The password to verify
   * @returns {boolean} True if password is correct
   */
  authenticate(password) {
    if (password === this.config.password) {
      // Store authentication timestamp
      const authData = {
        timestamp: Date.now(),
        caseStudyId: this.caseStudyId,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(authData));
      return true;
    }
    return false;
  }

  /**
   * Hide the main content of the page
   */
  hideContent() {
    const mainContent = document.querySelector("main");
    const footer = document.querySelector("site-footer");

    if (mainContent && mainContent instanceof HTMLElement) {
      mainContent.style.display = "none";
    }
    if (footer && footer instanceof HTMLElement) {
      footer.style.display = "none";
    }
  }

  /**
   * Show the main content of the page
   */
  showContent() {
    const mainContent = document.querySelector("main");
    const footer = document.querySelector("site-footer");

    if (mainContent && mainContent instanceof HTMLElement) {
      mainContent.style.display = "block";
    }
    if (footer && footer instanceof HTMLElement) {
      footer.style.display = "block";
    }

    // Remove password prompt if it exists
    const passwordOverlay = document.getElementById(
      "password-protection-overlay"
    );
    if (passwordOverlay) {
      passwordOverlay.remove();
    }
  }

  /**
   * Create and show the password prompt interface
   */
  showPasswordPrompt() {
    const overlay = document.createElement("div");
    overlay.id = "password-protection-overlay";
    overlay.className = "password-protection-overlay";

    overlay.innerHTML = `
      <div class="password-protection-modal">
        <div class="password-protection-content">
          <div class="password-protection-header">
            <h1 class="password-protection-description">${this.config.description}</h1>
          </div>
          
          <form class="password-protection-form" id="password-form">
            <div class="form-group">
              <label for="case-study-password" class="form-label">Password</label>
              <input 
                type="password" 
                id="case-study-password" 
                class="form-input password-input" 
                placeholder="Enter password"
                required
                autocomplete="off"
              >
            </div>
            
            <div class="password-error" id="password-error" style="display: none;">
              Incorrect password. Please try again.
            </div>
            
            <div class="form-actions">
              <button type="button" class="button button--secondary" id="cancel-btn">
                Cancel
              </button>
              <button type="submit" class="button">
                Access Case Study
              </button>
            </div>
          </form>
          

        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Add event listeners
    const form = document.getElementById("password-form");
    const cancelBtn = document.getElementById("cancel-btn");
    const passwordInput = document.getElementById("case-study-password");

    form.addEventListener("submit", this.handleSubmit);
    cancelBtn.addEventListener("click", this.handleCancel);
    passwordInput.addEventListener("keypress", this.handleKeyPress);

    // Focus on password input
    setTimeout(() => passwordInput.focus(), 100);
  }

  /**
   * Handle form submission
   * @param {Event} event - The form submit event
   */
  handleSubmit(event) {
    event.preventDefault();

    const passwordInput = document.getElementById("case-study-password");
    const errorDiv = document.getElementById("password-error");

    if (!(passwordInput instanceof HTMLInputElement)) {
      console.error("Password input not found");
      return;
    }

    const password = passwordInput.value.trim();

    if (this.authenticate(password)) {
      // Success - show content
      this.showContent();
    } else {
      // Show error
      if (errorDiv) {
        errorDiv.style.display = "block";
      }
      passwordInput.value = "";
      passwordInput.focus();

      // Shake animation for better UX feedback
      passwordInput.classList.add("shake");
      setTimeout(() => passwordInput.classList.remove("shake"), 500);
    }
  }

  /**
   * Handle cancel button click
   */
  handleCancel() {
    // Try to go back to the previous page in browser history
    if (window.history.length > 1 && document.referrer) {
      window.history.back();
    } else {
      // Fallback to configured redirect URL if no previous page
      const redirectUrl =
        this.config.redirectOnCancel || PASSWORD_CONFIG.global.defaultRedirect;
      window.location.href = redirectUrl;
    }
  }

  /**
   * Handle keypress events for better UX
   * @param {KeyboardEvent} event - The keypress event
   */
  handleKeyPress(event) {
    if (event.key === "Escape") {
      this.handleCancel();
    }
  }

  /**
   * Clear authentication for this case study
   */
  logout() {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Clear all case study authentications
   */
  static logoutAll() {
    const keys = Object.keys(localStorage);
    const prefix = PASSWORD_CONFIG.global.storagePrefix;

    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

/**
 * Initialize password protection for a case study
 * This is the main function to call from case study pages
 * @param {string} caseStudyId - The case study identifier
 */
export function initPasswordProtection(caseStudyId) {
  const protection = new PasswordProtection(caseStudyId);

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => protection.init());
  } else {
    protection.init();
  }

  return protection;
}
