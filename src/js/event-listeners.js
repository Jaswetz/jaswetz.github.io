/**
 * Event Listeners for Custom GA4 Event Tracking
 */
document.addEventListener("DOMContentLoaded", () => {
  // Track project card clicks
  document.querySelectorAll("[data-track-project-name]").forEach((card) => {
    card.addEventListener("click", () => {
      const projectName = card.getAttribute("data-track-project-name");
      const projectType = card.getAttribute("data-track-project-type");
      if (window.trackProjectClick) {
        window.trackProjectClick(projectName, projectType);
      }
    });
  });

  // Track resume downloads
  document.querySelectorAll('a[href*="Resume.pdf"]').forEach((link) => {
    link.addEventListener("click", () => {
      if (window.trackResumeDownload) {
        window.trackResumeDownload();
      }
    });
  });

  // Track external link clicks
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    if (
      link instanceof HTMLAnchorElement &&
      link.hostname !== window.location.hostname
    ) {
      link.addEventListener("click", () => {
        if (window.trackExternalLink) {
          window.trackExternalLink(link.href, link.textContent?.trim() || "");
        }
      });
    }
  });

  // Track scroll depth
  if (window.trackScrollDepth) {
    window.addEventListener("scroll", window.trackScrollDepth, {
      passive: true,
    });
  }

  // Track time on page
  if (window.trackTimeOnPage) {
    window.addEventListener("beforeunload", window.trackTimeOnPage);
  }

  // Track contact form submissions
  const contactForm = document.querySelector("#contact-form"); // Assuming form has id="contact-form"
  if (contactForm && window.trackContactForm) {
    contactForm.addEventListener("submit", () => {
      // This assumes submission is successful. For more accuracy, you'd hook into a success callback.
      window.trackContactForm("form_submit", "Contact Form");
    });
  }
});
