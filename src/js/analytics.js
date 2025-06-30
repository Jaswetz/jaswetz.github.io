/**
 * Google Analytics 4 Configuration and Custom Event Tracking
 * Measurement ID: G-Z5DNDF44NG
 */

// Initialize Google Analytics 4
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());

// Configure GA4 with enhanced measurement
gtag('config', 'G-Z5DNDF44NG', {
  // Enable enhanced measurement features
  enhanced_measurement: true,
  // Track page views automatically
  page_title: document.title,
  page_location: window.location.href,
  // Enable demographic reports (optional)
  allow_ad_personalization_signals: false, // Set to true if you want ad personalization
  // Enable Google Signals for cross-device tracking (optional)
  allow_google_signals: true,
});

/**
 * Custom Event Tracking Functions
 */

// Track project card clicks
function trackProjectClick(projectName, projectType) {
  gtag('event', 'project_view', {
    event_category: 'Projects',
    event_label: projectName,
    project_type: projectType,
    value: 1
  });
}

// Track resume downloads
function trackResumeDownload() {
  gtag('event', 'file_download', {
    event_category: 'Engagement',
    event_label: 'Resume PDF',
    file_name: 'Jason Swetzoff - Principal UX Designer - Resume.pdf',
    value: 1
  });
}

// Track contact form interactions
function trackContactForm(action, method = '') {
  gtag('event', action, {
    event_category: 'Contact',
    event_label: method,
    value: 1
  });
}

// Track external link clicks
function trackExternalLink(url, linkText) {
  gtag('event', 'click', {
    event_category: 'External Links',
    event_label: url,
    link_text: linkText,
    value: 1
  });
}

// Track scroll depth (custom implementation)
let scrollDepthTracked = [];
function trackScrollDepth() {
  const scrollPercent = Math.round(
    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
  );
  
  // Track at 25%, 50%, 75%, and 100%
  const milestones = [25, 50, 75, 100];
  milestones.forEach(milestone => {
    if (scrollPercent >= milestone && !scrollDepthTracked.includes(milestone)) {
      scrollDepthTracked.push(milestone);
      gtag('event', 'scroll', {
        event_category: 'Engagement',
        event_label: `${milestone}%`,
        value: milestone
      });
    }
  });
}

// Track time on page
let startTime = Date.now();
function trackTimeOnPage() {
  const timeSpent = Math.round((Date.now() - startTime) / 1000);
  gtag('event', 'timing_complete', {
    name: 'page_view_time',
    value: timeSpent
  });
}

/**
 * Auto-track common interactions when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
  
  // Track resume download clicks
  const resumeLinks = document.querySelectorAll('a[href*="resume"], a[href*="Resume"], a[href*="cv"], a[href*="CV"]');
  resumeLinks.forEach(link => {
    link.addEventListener('click', trackResumeDownload);
  });

  // Track project card clicks
  const projectLinks = document.querySelectorAll('.card__link, .project-card a, a[href*="project"]');
  projectLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const projectName = this.querySelector('h3, h2, .card__title')?.textContent || 'Unknown Project';
      const href = this.getAttribute('href') || '';
      let projectType = 'Other';
      
      if (href.includes('autodesk')) projectType = 'Autodesk';
      else if (href.includes('intel')) projectType = 'Intel';
      else if (href.includes('showcase')) projectType = 'Showcase';
      
      trackProjectClick(projectName, projectType);
    });
  });

  // Track external links
  const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
  externalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const url = this.getAttribute('href');
      const linkText = this.textContent || this.getAttribute('aria-label') || 'External Link';
      trackExternalLink(url, linkText);
    });
  });

  // Track scroll depth
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(trackScrollDepth, 100);
  });

  // Track time on page when user leaves
  window.addEventListener('beforeunload', trackTimeOnPage);
  
  // Also track time on page for single-page sessions after 30 seconds
  setTimeout(() => {
    if (document.visibilityState === 'visible') {
      trackTimeOnPage();
    }
  }, 30000);

  // Track page visibility changes
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      trackTimeOnPage();
    }
  });
});

// Export functions for manual tracking if needed
window.portfolioAnalytics = {
  trackProjectClick,
  trackResumeDownload,
  trackContactForm,
  trackExternalLink,
  trackScrollDepth,
  trackTimeOnPage
};
