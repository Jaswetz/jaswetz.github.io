/**
 * Password Protection Integration Script
 *
 * Simple script to integrate password protection into case study pages.
 * This script should be imported and called with the case study ID.
 */

import { initPasswordProtection } from "./auth/password-protection.js";

/**
 * Easy integration function for case studies
 * Call this function with your case study ID to enable password protection
 *
 * @param {string} caseStudyId - The case study identifier (should match config)
 * @example
 * import { protectCaseStudy } from './js/password-protection-init.js';
 * protectCaseStudy('project-autodesk-di');
 */
export function protectCaseStudy(caseStudyId) {
  return initPasswordProtection(caseStudyId);
}

/**
 * Extract case study ID from current page URL
 * Useful for automatic detection based on filename
 *
 * @returns {string|null} Case study ID or null if not found
 */
export function getCaseStudyIdFromUrl() {
  const path = window.location.pathname;
  const filename = path.split("/").pop();

  if (filename && filename.endsWith(".html")) {
    return filename.replace(".html", "");
  }

  return null;
}

/**
 * Auto-protect case study based on current URL
 * Automatically detects and protects case study if it's in the config
 */
export function autoProtectCaseStudy() {
  const caseStudyId = getCaseStudyIdFromUrl();

  if (caseStudyId) {
    return protectCaseStudy(caseStudyId);
  }

  console.warn("Could not determine case study ID from URL");
  return null;
}
