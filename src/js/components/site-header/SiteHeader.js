/**
 * Custom element for the site-wide header, including navigation.
 * It encapsulates its own structure, styles, and basic behavior.
 * @extends HTMLElement
 */
// TODO: [Component][SiteHeader] Implement props/attributes if needed (e.g., for different versions of header) (WCMP7, WCMP8)
// TODO: [Component][SiteHeader] Implement custom events if header interactions need to notify outside (WCMP7)
// TODO: [Component][SiteHeader] Expose CSS Custom Properties for more granular theming if needed (WCMP18)
// TODO: [Component][SiteHeader] Enhance accessibility (e.g. ARIA for nav, focus management if complex) (A11Y4, A11Y9)
// TODO: Add pressed states for all buttons and links (WCMP9)
// TODO: Update spacing to use CSS Custom Properties (WCMP10)

class SiteHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isMenuOpen = false;
    this.lastScrollY = 0;
    this.updateActiveSection = null; // Store reference for cleanup
  }

  /**
   * Called when the element is added to the document's DOM.
   * Renders the header structure and styles into the Shadow DOM.
   */
  connectedCallback() {
    // Check if we're on the home page to determine navigation behavior
    const currentPath = window.location.pathname;
    console.log("SiteHeader - Current path:", currentPath); // Debug logging

    const isHomePage =
      currentPath === "/" ||
      currentPath === "/index.html" ||
      currentPath.endsWith("/index.html") ||
      currentPath === "" ||
      currentPath.includes("index.html");

    this.shadowRoot.innerHTML = /*html*/ `  
    <style>
      :host {
      display: block;
      position: fixed;
      top: var(--space-s);
      left: 50%; 
      transform: translateX(-50%);
      width: var(--section-width);
      z-index: 1000;
      /* MODIFIED transition property */
      transition: top 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
            width 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
            max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
            box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: top, width, max-width, box-shadow; /* ADDED */
      max-width: var(--max-width);
      outline: none; /* Prevent any outline on the host element */
      }

      :host:focus {
      outline: none; /* Explicitly prevent focus outline on host */
      }

      :host(.scrolled) {
      top: 0;
      left: 0;
      transform: none;
      width: 100%;
      border-radius: 0;
      max-width: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      }

      .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: var(--border-width) solid var(--color-border);
      padding: var(--space-s) var(--space-m);
      border-radius: var(--border-radius);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      /* MODIFIED transition property */
      transition: padding 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
            border-radius 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
            background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: padding, border-radius, background-color, box-shadow; /* ADDED */
      outline: none; /* Prevent outline on header content */
      backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        background-color: rgba(255, 255, 255, 0.3);
      }

      .header-content:focus {
      outline: none; /* Explicitly prevent focus outline on header content */
      }

      :host(.scrolled) .header-content {
      border-radius: 0;
      padding: var(--space-xs) var(--space-m);
      box-shadow: none; /* ADDED to remove inner shadow when host has shadow */
      background-color: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        border-right: none;
        border-left: none;
        border-top: none;
      }

      .logo a {
      font-weight: var(--font-weight-medium);
      font-family: var(--font-family-heading);
      text-decoration: none;
      color: var(--color-text);
      font-size: var(--text-size-heading-4);
      z-index: 2;
      transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: var(--space-2xs, 0.5em);
      padding: var(--space-2xs) var(--space-xs);
      border-radius: var(--border-radius);
      position: relative;
      overflow: hidden;
      }



      .logo-text {
      margin-left: var(--space-2xs, 0.25em);
      display: inline-block;
      }

      .beta-tag {
        background-color: color-mix(in srgb, var(--color-warning), white 65%); /* Lighten --color-primary by mixing it with 25% white *//* A nice yellow */
        font-size: var(--size-step--2);
        padding: 0.2em 0.5em;
        border-radius: var(--border-radius);
        margin-left: var(--space-xs);
        vertical-align: middle; /* Align with the text */
        border: var(--border-width) solid var(--color-warning);
      }

      :host(.scrolled) .logo a {
      font-size: var(--font-size-lg);
      }

      .menu-toggle {
      display: none;
      background: none;
      border: none;
      padding: var(--space-2xs);
      cursor: pointer;
      z-index: 1001;
      position: relative;
      color: var(--color-text);
      border-radius: var(--border-radius);
      transition: var(--transition-interactive);
      overflow: hidden;
      }

      .menu-toggle::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay-gradient-primary);
      opacity: 0;
      transition: var(--transition-quick);
      pointer-events: none;
      z-index: -1;
      }

      .menu-toggle:hover {
      transform: var(--hover-transform) scale(var(--hover-scale));
      box-shadow: var(--hover-shadow);
      }

      .menu-toggle:focus {
      outline: var(--focus-outline);
      outline-offset: var(--focus-outline-offset);
      transform: var(--hover-transform) scale(var(--hover-scale));
      box-shadow: var(--focus-shadow-enhanced);
      }

      .menu-toggle:active {
      transform: translateY(0) scale(0.98);
      box-shadow: var(--active-shadow);
      }

      .menu-toggle:hover::before {
      opacity: 1;
      }

      .menu-toggle:focus::before {
      opacity: 1;
      }

      .menu-toggle:active::before {
      opacity: 1;
      background: var(--overlay-gradient-enhanced);
      }

      .plus-icon {
      display: block;
      width: 24px;
      height: 24px;
      position: relative;
      }
      .plus-icon span {
      position: absolute;
      background: var(--color-text);
      border-radius: 1px;
      transition: transform .5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .plus-icon .vertical {
      left: 50%;
      top: 4px;
      width: 2px;
      height: 16px;
      transform: translateX(-50%);
      }
      .plus-icon .horizontal {
      top: 50%;
      left: 4px;
      width: 16px;
      height: 2px;
      transform: translateY(-50%);
      }
      .menu-toggle.active .plus-icon .vertical {
      transform: translateX(-50%) rotate(90deg);
      }
      .menu-toggle.active .plus-icon .horizontal {
      transform: translateY(-50%) rotate(90deg);
      }

      nav {
      display: flex;
      align-items: center;
      }

      nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      align-items: center;
      gap: var(--space-m);
      }

      nav li a {
      text-decoration: none;
      color: var(--color-text);
      padding: var(--space-2xs) var(--space-xs);
      font-size: var(--text-size-heading-5);
      border-radius: var(--border-radius);
      transition: var(--transition-interactive);
      font-family: var(--font-family-heading);
      font-weight: var(--font-weight-medium);
      position: relative;
      overflow: hidden;
      }

      nav li a.active {
      color: var(--color-primary-alt);
      background-color: rgba(37, 105, 237, 0.1);
      }

      nav li a:hover,
      nav li a:focus,
      .logo a:hover,
      .logo a:focus  {
      color: var(--color-primary-alt);
      transform: var(--hover-transform) scale(var(--hover-scale));
      box-shadow: var(--hover-shadow);
      text-decoration: none;
      }

      nav li a:active {
      color: var(--color-primary-alt);
      transform: translateY(0) scale(0.98);
      box-shadow: var(--active-shadow);
      text-decoration: none;
      }

      nav li a:hover::before,
      nav li a:focus::before {
      opacity: 1;
      }

      nav li a:active::before {
      opacity: 1;
      background: var(--overlay-gradient-enhanced);
      }

      .logo a:active {
      color: var(--color-primary-alt);
      transform: translateY(0) scale(0.98);
      box-shadow: var(--active-shadow);
      text-decoration: none;
      }

      .logo a:hover::before,
      .logo a:focus::before {
      opacity: 1;
      }

      .logo a:active::before {
      opacity: 1;
      background: linear-gradient(135deg, rgba(37, 105, 237, 0.1), rgba(23, 70, 160, 0.15));
      }

      .logo a:hover .logo-svg,
      .logo a:focus .logo-svg {
      transform: scale(var(--hover-scale-large));
      }

      .logo a:active .logo-svg {
      transform: scale(var(--hover-scale));
      }
      .logo-svg {
      height: var(--space-m-l);
      width: auto;
      min-width: 1em;
      min-height: 1em;
      display: inline-block;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* External link icon */
      .external-icon {
      width: 16px;
      height: 16px;
      margin-left: var(--space-2xs);
      vertical-align: middle;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      a:hover .external-icon,
      a:focus .external-icon {
      transform: scale(1.1);
      }

      /* Added button styles */
      .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      text-decoration: none;
      text-align: center;
      border: 2px solid var(--color-primary);
      border-radius: var(--border-radius);
      background-color: var(--color-primary);
      color: white;
      cursor: pointer;
      transition: var(--transition-interactive);
      position: relative;
      overflow: hidden;
      gap: var(--space-xs);
      }

      .button::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay-gradient-light);
      opacity: 0;
      transition: var(--transition-quick);
      pointer-events: none;
      z-index: 1;
      }

      /* Hover state */
      .button:hover {
      background-color: var(--color-primary-alt);
      border-color: var(--color-primary-alt);
      color: white;
      transform: var(--hover-transform);
      box-shadow: var(--hover-shadow);
      text-decoration: none;
      }

      .button:hover::before {
      opacity: 1;
      }

      /* Focus state */
      .button:focus {
      outline: var(--focus-outline);
      outline-offset: var(--focus-outline-offset);
      background-color: var(--color-primary-alt);
      border-color: var(--color-primary-alt);
      color: white;
      transform: var(--hover-transform);
      box-shadow: var(--focus-shadow-enhanced);
      text-decoration: none;
      }

      .button:focus::before {
      opacity: 1;
      }

      /* Active/pressed state */
      .button:active {
      background-color: var(--color-primary-alt);
      border-color: var(--color-primary-alt);
      color: white;
      transform: var(--active-transform);
      box-shadow: var(--active-shadow);
      text-decoration: none;
      }

      .button:active::before {
      opacity: 1;
      background: var(--overlay-gradient-enhanced);
      }

      /* Secondary button styles */
      .button--secondary {
      background-color: transparent;
      color: var(--color-primary);
      border-color: var(--color-primary);
      }

      .button--secondary::before {
      background: var(--overlay-gradient-primary);
      }

      .button--secondary:hover {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
      color: white;
      transform: var(--hover-transform);
      }
      /* End of added button styles */


      @media (max-width: 47.9375rem) {
    

      .menu-toggle {
      display: flex;
      align-items: center;
      }

      nav {
      position: absolute;
      right: 0;
      border-radius: var(--border-radius);
      top: calc(100% + var(--space-2xs));
      max-width: 300px;
      width: var(--space-4xl);
      background-color: var(--color-surface);
      padding: var(--space-xs);
      opacity: 0;
      visibility: hidden;
      transition: opacity .3s ease, transform .3s ease, visibility .3s ease;
      z-index: 1000;
      display: block;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      width: calc(var(--space-2xl-3xl) * 3.0);
      }

      nav.active {
      opacity: 1;
      visibility: visible;
      }

      nav ul {
      flex-direction: column;
      gap: var(--space-2xs);
      align-items: stretch;
      }

      nav li a {
      font-size: var(--font-size-base);
      padding: var(--space-2xs) var(--space-xs);
      display: block;
      text-align: center;
      }

      nav li a.button {
      width: 87%;
      justify-content: center;
      }
      }
    </style>
    <header class="header-content">
      <div class="logo">
      <a href="/index.html">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="logo-svg" viewBox="0 0 39 39">
        <defs>
        <clipPath id="clipPath2973389018">
        <path d="M0 0L39 0L39 39L0 39L0 0Z" fill-rule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
        </clipPath>
        </defs>
        <g clip-path="url(#clipPath2973389018)">
        <path d="M9 0L18 17L0 17L9 0Z" fill-rule="nonzero" transform="matrix(1 0 0 1 10.5 10)" fill="#2569ed"/>
        <path d="M16 -0.5Q19.3566 -0.5 22.4227 0.796857Q25.3838 2.04931 27.6673 4.33274Q29.9507 6.61615 31.2031 9.5773Q32.5 12.6434 32.5 16Q32.5 19.3566 31.2031 22.4227Q29.9507 25.3838 27.6673 27.6673Q25.3839 29.9507 22.4227 31.2031Q19.3566 32.5 16 32.5Q12.6434 32.5 9.5773 31.2031Q6.61615 29.9507 4.33274 27.6673Q2.04931 25.3838 0.796855 22.4227Q-0.500002 19.3566 -0.500002 16Q-0.5 12.6434 0.796857 9.5773Q2.04931 6.61617 4.33274 4.33274Q6.61617 2.04931 9.5773 0.796855Q12.6434 -0.500002 16 -0.500002L16 -0.5ZM16 0.499998Q12.8462 0.499998 9.96685 1.71786Q7.18536 2.89433 5.03984 5.03984Q2.89433 7.18535 1.71786 9.96685Q0.5 12.8462 0.499998 16Q0.499998 19.1538 1.71786 22.0331Q2.89433 24.8147 5.03984 26.9602Q7.18534 29.1057 9.96685 30.2821Q12.8462 31.5 16 31.5Q19.1538 31.5 22.0331 30.2821Q24.8147 29.1057 26.9602 26.9602Q29.1057 24.8147 30.2821 22.0331Q31.5 19.1538 31.5 16Q31.5 12.8462 30.2821 9.96685Q29.1057 7.18534 26.9602 5.03984Q24.8146 2.89434 22.0331 1.71786Q19.1538 0.5 16 0.5L16 0.499998Z" fill-rule="nonzero" transform="matrix(1 0 0 1 3.5 3.5)" fill="#2569ed"/>
        <path d="M-0.5 -0.5L38.5 -0.5L38.5 38.5L-0.5 38.5L-0.5 -0.5ZM0.5 0.5L0.5 37.5L37.5 37.5L37.5 0.5L0.5 0.5Z" fill-rule="nonzero" transform="matrix(1 0 0 1 0.5 0.5)" fill="#2569ed"/>
        </g>
      </svg>
      <span class="logo-text">Jason Swetzoff</span>
      <span class="beta-tag">Beta :)</span>
      </a>
      </div>
      <button class="menu-toggle" aria-label="Toggle menu">
      <span class="plus-icon">
        <span class="vertical"></span>
        <span class="horizontal"></span>
      </span>
      </button>
      <nav>
      <ul>
   
        <li><a href="${
          isHomePage ? "#" : "/index.html#"
        }featured-projects" data-scroll="true">Work</a></li>
        <li><a href="${
          isHomePage ? "#" : "/index.html#"
        }about" data-scroll="true">About</a></li>
        <li><a href="${
          isHomePage ? "#" : "/index.html#"
        }quotes" data-scroll="true">Testimonials</a></li>
        <li><a href="https://www.linkedin.com/in/swetzoff/" class="button" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile (opens in new tab)">Say Hello!<svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 17 10-10"></path><path d="M7 7h10v10"></path></svg></a></li>

      </ul>
      </nav>
    </header>
    `;

    // Add event listeners
    const menuToggle = this.shadowRoot.querySelector(".menu-toggle");
    const nav = this.shadowRoot.querySelector("nav");

    menuToggle.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent any default behavior
      e.stopPropagation(); // Stop event bubbling

      this.isMenuOpen = !this.isMenuOpen;
      menuToggle.classList.toggle("active");
      nav.classList.toggle("active");

      // Keep focus on the button after click
      if (menuToggle instanceof HTMLElement) {
        menuToggle.focus();
      }
    });

    // Add smooth scrolling for section navigation (only on home page)
    if (isHomePage) {
      const scrollLinks = this.shadowRoot.querySelectorAll(
        "a[data-scroll=\"true\"]"
      );
      scrollLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = link.getAttribute("href");
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            // Close mobile menu if open
            this.isMenuOpen = false;
            menuToggle.classList.remove("active");
            nav.classList.remove("active");

            // Smooth scroll to target using native behavior
            const targetId = link.getAttribute("href");
            if (targetId.startsWith("#")) {
              window.location.hash = targetId;
            }
          }
        });
      });

      // Add scroll detection for active section highlighting
      const sections = [
        "hero",
        "featured-projects",
        "about",
        "quotes",
        "footer",
      ];
      this.updateActiveSection = () => {
        const headerHeight = this.offsetHeight || 80;
        const scrollPosition = window.scrollY + headerHeight + 100; // Increased offset for better detection

        let activeSection = "hero"; // Default to hero

        // Check sections in order they appear on page
        for (const sectionId of sections) {
          const sectionElement = document.querySelector(`#${sectionId}`);
          if (
            sectionElement instanceof HTMLElement &&
            scrollPosition >= sectionElement.offsetTop
          ) {
            activeSection = sectionId;
          }
        }

        // Update active states
        scrollLinks.forEach((link) => {
          const href = link.getAttribute("href");
          const targetSection = href.replace(/^.*#/, ""); // Extract section name from href
          if (targetSection === activeSection) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      };

      // Set initial active section
      this.updateActiveSection();

      // Listen for scroll events
      window.addEventListener("scroll", this.updateActiveSection, {
        passive: true,
      });
    }

    // Handle scroll events
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    const header = this;

    if (currentScrollY > 10) {
      // Changed from 50 to 10 for earlier animation
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    this.lastScrollY = currentScrollY;
  }

  disconnectedCallback() {
    // Clean up event listeners
    if (this.updateActiveSection) {
      window.removeEventListener("scroll", this.updateActiveSection);
    }
    window.removeEventListener("scroll", this.handleScroll.bind(this));
  }
}

export default SiteHeader;
