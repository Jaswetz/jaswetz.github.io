/**
 * Password Protection Configuration
 *
 * This module manages which case studies require password protection
 * and their associated settings.
 */

export const PASSWORD_CONFIG = {
  // Global settings
  global: {
    // Session duration in milliseconds (24 hours)
    sessionDuration: 24 * 60 * 60 * 1000,
    // Storage key prefix
    storagePrefix: "protected_case_study_",
    // Default redirect after successful authentication
    defaultRedirect: "../work.html",
  },

  // Protected case studies configuration
  protectedCaseStudies: {
    "project-autodesk-di": {
      password: "CuriousDesign404",
      title: "Autodesk Fusion: Device Independence Case Study",
      description:
        "This case study contains confidential design work. Please enter the password to continue.",
      redirectOnCancel: "../work.html",
    },
    // Future case studies can be added here:
    // 'project-name': {
    //   password: 'YourPassword',
    //   title: 'Project Title',
    //   description: 'Description for password prompt',
    //   redirectOnCancel: '../work.html'
    // }
  },
};

/**
 * Get configuration for a specific case study
 * @param {string} caseStudyId - The case study identifier
 * @returns {object|null} Configuration object or null if not protected
 */
export function getCaseStudyConfig(caseStudyId) {
  return PASSWORD_CONFIG.protectedCaseStudies[caseStudyId] || null;
}

/**
 * Check if a case study is protected
 * @param {string} caseStudyId - The case study identifier
 * @returns {boolean} True if protected, false otherwise
 */
export function isCaseStudyProtected(caseStudyId) {
  return caseStudyId in PASSWORD_CONFIG.protectedCaseStudies;
}

/**
 * Get all protected case study IDs
 * @returns {string[]} Array of protected case study IDs
 */
export function getProtectedCaseStudyIds() {
  return Object.keys(PASSWORD_CONFIG.protectedCaseStudies);
}
