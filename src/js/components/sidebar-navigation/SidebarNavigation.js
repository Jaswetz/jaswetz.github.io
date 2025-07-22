/**
 * Sidebar Navigation Component
 * Handles scroll spy functionality to highlight active navigation items
 * based on the current section in view.
 */

class SidebarNavigation {
  constructor() {
    this.sidebarNav = document.querySelector(".sidebar-nav");
    this.navLinks = [];
    this.sections = [];
    this.currentActiveLink = null;
    this.observer = null;

    this.init();
  }

  init() {
    if (!this.sidebarNav) {
      return; // No sidebar navigation found
    }

    this.setupNavLinks();
    this.setupIntersectionObserver();
    this.bindEvents();
  }

  setupNavLinks() {
    // Get all navigation links
    const links = this.sidebarNav.querySelectorAll("a[href^=\"#\"]");

    links.forEach((link) => {
      const targetId = link.getAttribute("href").substring(1);

      // Enhanced selector logic to catch sections that contain ID elements
      // Try multiple approaches to find the target section:
      // 1. Direct ID match (section[id] or h2[id])
      // 2. Section containing an element with the target ID
      // 3. Section containing h2 with the target ID
      let targetSection = document.getElementById(targetId);

      // If direct ID lookup fails, try to find parent section
      if (!targetSection) {
        // Look for any element with the target ID and find its parent section
        const targetElement = document.querySelector(`#${targetId}`);
        if (targetElement) {
          targetSection = targetElement.closest("section") || targetElement;
        }
      }

      // Additional fallback: look for section containing h2 with target ID
      if (!targetSection) {
        targetSection = document.querySelector(
          `section:has(#${targetId}), section:has(h2#${targetId})`
        );
      }

      // Final fallback: use CSS selector for broader matching
      if (!targetSection) {
        const possibleTargets = document.querySelectorAll(
          `section[id="${targetId}"], section:has([id="${targetId}"])`
        );
        if (possibleTargets.length > 0) {
          targetSection = possibleTargets[0];
        }
      }

      if (targetSection) {
        // Ensure we're working with a section element for consistent behavior
        const actualSection =
          targetSection.tagName.toLowerCase() === "section"
            ? targetSection
            : targetSection.closest("section") || targetSection;

        this.navLinks.push({
          link: link,
          section: actualSection,
          id: targetId,
          targetElement: document.getElementById(targetId) || actualSection, // Keep reference to actual target
        });
        this.sections.push(actualSection);
      }
    });
  }

  /**
   * Dynamically calculates scroll offset based on header height and extra padding.
   * Accounts for <site-header> web component or <header> element.
   * @returns {number} Offset in pixels
   */
  calculateScrollOffset() {
    const header =
      document.querySelector("site-header") || document.querySelector("header");
    // Cast to HTMLElement to safely access offsetHeight
    const headerHeight =
      header && header instanceof HTMLElement ? header.offsetHeight : 0;
    // Add extra padding for comfortable reading (can be adjusted)
    return headerHeight + 20;
  }

  setupIntersectionObserver() {
    // Use dynamic offset for intersection detection
    const dynamicOffset = this.calculateScrollOffset();

    // Calculate bottom margin to ensure last section is detected accurately
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const bottomMargin = Math.round(viewportHeight * 0.2); // 20% of viewport height

    const options = {
      root: null,
      // Dynamic top and bottom margins for better accuracy
      rootMargin: `-${dynamicOffset}px 0px -${bottomMargin}px 0px`,
      // Multiple thresholds for fine-grained detection
      threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0],
    };

    this.observer = new IntersectionObserver((entries) => {
      this.handleIntersection(entries);
    }, options);

    // Observe all sections
    this.sections.forEach((section) => {
      this.observer.observe(section);
    });
  }

  handleIntersection(entries) {
    // Track intersecting sections with their intersection ratios
    const intersectingSections = [];

    entries.forEach((entry) => {
      // Only consider entries with intersectionRatio > 0
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        // Find the corresponding nav link for this section
        const navItem = this.navLinks.find(
          ({ section }) => section === entry.target
        );
        if (navItem) {
          intersectingSections.push({
            id: navItem.id,
            ratio: entry.intersectionRatio,
            target: entry.target,
            bounding: entry.boundingClientRect,
            isFullyVisible: entry.intersectionRatio >= 0.99,
          });
        }
      }
    });

    // Edge case: If no section is intersecting, try to activate the closest one to viewport top
    if (intersectingSections.length === 0 && entries.length > 0) {
      // Find the entry whose boundingClientRect.top is closest to dynamic offset
      const offset = this.calculateScrollOffset();
      /**
       * Explicitly type closest as navLink object or null
       */
      let closest = null;
      let minDistance = Infinity;
      entries.forEach((entry) => {
        const navItem = this.navLinks.find(
          ({ section }) => section === entry.target
        );
        if (navItem && typeof navItem.id === "string") {
          const distance = Math.abs(entry.boundingClientRect.top - offset);
          if (distance < minDistance) {
            minDistance = distance;
            closest = navItem;
          }
        }
      });
      if (closest && closest.id) {
        this.setActiveLink(closest.id);
        return;
      }
    }

    // If we have intersecting sections, activate the one with highest intersection ratio
    // or the first one if ratios are similar
    if (intersectingSections.length > 0) {
      // Sort by intersection ratio (descending) and then by document order
      intersectingSections.sort((a, b) => {
        if (Math.abs(a.ratio - b.ratio) < 0.05) {
          // If ratios are very similar, prefer the one that appears first in document
          return (
            Array.from(document.querySelectorAll("section")).indexOf(a.target) -
            Array.from(document.querySelectorAll("section")).indexOf(b.target)
          );
        }
        return b.ratio - a.ratio;
      });

      // Prefer fully visible section if available
      const fullyVisible = intersectingSections.find((s) => s.isFullyVisible);
      if (fullyVisible) {
        this.setActiveLink(fullyVisible.id);
      } else {
        this.setActiveLink(intersectingSections[0].id);
      }
    }
  }

  setActiveLink(sectionId) {
    // Remove active class from all links
    this.navLinks.forEach(({ link }) => {
      link.classList.remove("active");
    });

    // Add active class to current link
    const activeNavItem = this.navLinks.find(({ id }) => id === sectionId);
    if (activeNavItem) {
      activeNavItem.link.classList.add("active");
      this.currentActiveLink = activeNavItem.link;
    }
  }

  bindEvents() {
    // Shared variable to track and cancel any ongoing scroll animation
    let scrollAnimationFrame = null;

    /**
     * Enhanced smooth scroll with animation cancellation and consistent positioning
     * Uses dynamic offset calculation for proper header clearance
     * @param {number} targetY - Target Y position to scroll to
     * @param {number} duration - Duration of animation in ms
     */
    const smoothScrollTo = (targetY, duration = 400) => {
      // Cancel any ongoing animation first to prevent jumpy behavior with rapid clicks
      if (scrollAnimationFrame) {
        cancelAnimationFrame(scrollAnimationFrame);
        scrollAnimationFrame = null;
      }

      const startY = window.pageYOffset;
      const distance = targetY - startY;
      let startTime = null;

      // Don't animate for very small distances
      if (Math.abs(distance) < 5) {
        window.scrollTo(0, targetY);
        return;
      }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Improved easing function for smoother animation
        // Ease-in-out cubic for natural feeling motion
        const ease =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo({
          top: startY + distance * ease,
          behavior: "auto", // We're handling the animation manually
        });

        if (progress < 1) {
          scrollAnimationFrame = requestAnimationFrame(step);
        } else {
          // Animation complete - clean up
          scrollAnimationFrame = null;
        }
      }

      scrollAnimationFrame = requestAnimationFrame(step);
    };

    /**
     * Get the target scroll position for a section with proper offset
     * Uses dynamic offset calculation for consistent positioning across different header heights
     * @param {HTMLElement} section - The section to scroll to
     * @returns {number} - The calculated Y position
     */
    const getTargetPosition = (section) => {
      // Get dynamic offset based on current header height
      const offset = this.calculateScrollOffset();

      // Get the absolute position of the section
      // Using getBoundingClientRect() for more accurate positioning
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top + window.pageYOffset;

      // Calculate final position with offset
      // Ensure we never scroll to a negative position
      return Math.max(0, sectionTop - offset);
    };

    // Enhanced click handler for navigation links with improved scroll positioning
    this.navLinks.forEach(({ link, section, targetElement, id }) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // Update active state immediately for better UX
        this.setActiveLink(id);

        // Use the actual target element if available, otherwise use the section
        const elementToScrollTo = targetElement || section;

        // Calculate target position with dynamic offset
        const targetPosition = getTargetPosition(elementToScrollTo);

        // Adjust duration based on distance for more natural feeling
        // Shorter distances = shorter duration, longer distances = longer duration (with limits)
        const distance = Math.abs(window.pageYOffset - targetPosition);
        const duration = Math.min(800, Math.max(400, distance / 2));

        // Perform the smooth scroll with cancellation support
        smoothScrollTo(targetPosition, duration);

        // Update URL hash without triggering another scroll
        const currentURL = window.location.pathname + window.location.search;
        window.history.replaceState(null, "", currentURL + `#${id}`);
      });
    });

    // Handle URL hash on initial load and browser history navigation
    const handleHashChange = () => {
      if (window.location.hash) {
        const initialSection = window.location.hash.substring(1);
        const navItem = this.navLinks.find(({ id }) => id === initialSection);

        if (navItem) {
          // Update active state
          this.setActiveLink(initialSection);

          // Calculate position with proper offset
          const elementToScrollTo = navItem.targetElement || navItem.section;
          const targetPosition = getTargetPosition(elementToScrollTo);

          // Small delay to ensure DOM is ready
          setTimeout(() => {
            smoothScrollTo(targetPosition, 400);
          }, 50);
        }
      } else if (this.navLinks.length > 0) {
        // If no hash, activate first link
        this.setActiveLink(this.navLinks[0].id);
      }
    };

    // Handle initial page load with a small delay to ensure DOM is fully loaded
    setTimeout(handleHashChange, 100);

    // Listen for hash changes (browser back/forward navigation)
    window.addEventListener("hashchange", handleHashChange);

    // Add window resize handler to recalculate positions if header height changes
    let resizeTimeout;
    window.addEventListener("resize", () => {
      // Throttle resize events
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      
      resizeTimeout = setTimeout(() => {
        // If we have an active section and user is not actively scrolling,
        // readjust position based on new header size
        if (this.currentActiveLink && !scrollAnimationFrame) {
          const activeId = this.currentActiveLink.getAttribute("href").substring(1);
          const navItem = this.navLinks.find(({ id }) => id === activeId);
          
          if (navItem) {
            const elementToScrollTo = navItem.targetElement || navItem.section;
            const targetPosition = getTargetPosition(elementToScrollTo);
            
            // Use immediate scroll without animation for resize adjustments
            window.scrollTo({
              top: targetPosition,
              behavior: "auto"
            });
          }
        }
      }, 100);
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

export default SidebarNavigation;