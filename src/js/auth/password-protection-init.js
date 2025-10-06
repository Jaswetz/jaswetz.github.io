/**
 * Password Protection Initialization Utility
 *
 * Provides a lightweight way to set up password protection
 * that will be loaded dynamically when needed.
 */

/**
 * Set up password protection for a case study with lazy loading
 * @param {string} caseStudyId - The case study identifier
 */
export function protectCaseStudy(caseStudyId) {
  // Create a marker element that will trigger lazy loading
  const protectionMarker = document.createElement('div');
  protectionMarker.dataset.caseStudyId = caseStudyId;
  protectionMarker.dataset.lazyComponent = 'password-protection';
  protectionMarker.style.position = 'absolute';
  protectionMarker.style.top = '0';
  protectionMarker.style.left = '0';
  protectionMarker.style.width = '1px';
  protectionMarker.style.height = '1px';
  protectionMarker.style.opacity = '0';
  protectionMarker.style.pointerEvents = 'none';

  // Add to document body
  document.body.appendChild(protectionMarker);

  // The lazy loader will detect this element and load password protection
  // when it comes into view (which is immediately since it's at top of page)
}

// Make it globally available for backward compatibility
window.protectCaseStudy = protectCaseStudy;
