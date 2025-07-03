/**
 * @class SiteFooter
 * @extends HTMLElement
 * @description Custom element for the site-wide footer.
 * It displays copyright information with a dynamically updated year.
 */
// TODO: [Component][SiteFooter] Implement props/attributes if needed (WCMP7, WCMP8)
// TODO: [Component][SiteFooter] Implement custom events if footer interactions need to notify outside (WCMP7)
// TODO: [Component][SiteFooter] Expose CSS Custom Properties for more granular theming if needed (WCMP18)
// TODO: [Component][SiteFooter] Enhance accessibility (e.g. ARIA for links if complex) (A11Y4, A11Y9)
class SiteFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * Called when the element is added to the document's DOM.
   * Renders the footer structure and styles into the Shadow DOM.
   * The current year is dynamically inserted into the copyright notice.
   */
  connectedCallback() {
    const currentYear = new Date().getFullYear();
    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        /* Component-specific styles for the footer */
        :host {
          display: block;
          margin-inline: auto;
          min-height: calc(var(--space-l-3xl) * 2); /* Ensure footer has enough height */
          position: relative; /* Ensure pseudo-element is positioned relative to the host */
          top: calc(-1 * var(--space-l-3xl));
          border-top: var(--border-width) solid var(--color-border);
        }

        :host::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #f7f3eb;
          background-image: radial-gradient(var(--color-primary) 0.7px, #f7f3eb 0.7px);
          background-size: 14px 14px;
          opacity: .7;
          z-index: -1; /* Ensure it stays behind the content */
        }

        .footer-content {
          width: var(--section-width);
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xl); /* Add space between children */
          padding: var(--space-xl) 0;
          max-width: var(--max-width);
          position: relative;
          margin: 0 auto;
          text-align: center;
          min-height: inherit; /* Ensure it takes up the host's min-height */
        }

        .footer-content__text {
          width: 100%;
        }

        .footer-tag {
          font-weight: bold;
          margin-bottom: 0;
          padding: 0;
        }

        .made-with {
          font-style: italic;
          color: var(--color-text-light);
          margin: 0;
          padding: 0;
          font-size: var(--size-step--1);
         
        }

        .social-links__list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: var(--space-s);
          justify-content: center;
        }

        a {
          display: inline-flex;
          cursor: pointer;
          text-decoration: none;
          transition: var(--transition-interactive);
          position: relative;
          overflow: hidden;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          padding: var(--space-xs) var(--space-xs);
          text-align: center;
          border-radius: var(--border-radius);
          color: var(--color-primary-hover);
          border-color: var(--color-primary-hover);
          font-family: var(--font-family-heading);
        }

        a:hover {
          color: var(--color-primary);
          border-color: var(--color-primary-alt);
          transform: var(--hover-transform-small);
        }

        a::after {
          content: " →";
          margin-left: 0.25em; /* Adjust spacing as needed */
        }

        a:focus {
          outline: var(--focus-outline);
          outline-offset: var(--focus-outline-offset);
        }

        @media (min-width: 64rem) {
          .footer-content {
            grid-template-columns: 1fr 1fr; /* Keep 2 per row on large screens */
            text-align: left;
          }

          .social-links {
            display: flex;
            align-items: center; /* Vertically center grid items */
            justify-content: flex-start;
          }

          .social-links__list {
            justify-content: flex-end;
            display: block;
          }
        }
      </style>
      <footer class="footer-content">
        <div class="footer-content__text">
          <p class="footer-tag">
            &copy; <span id="current-year">${currentYear}</span> Jason Swetzoff. All rights reserved.
          </p>
          <p class="made-with">
            Designed and Hand-coded by Jason Swetzoff with HTML, CSS, JS, Parcel and AI.
          </p>
        </div>

        <nav class="social-links">
          <ul class="social-links__list">
            <li>
              <a id="contact-link" href="mailto:swetzoff@gmail.com" class="button">
                Email
              </a>
            </li>
            <li>
              <a
                href="http://www.linkedin.com/in/swetzoff"
                aria-label="Jason's LinkedIn Profile"
                target="_blank"
                rel="noopener noreferrer"
                class="button"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Jaswetz"
                aria-label="Jason's GitHub Profile"
                target="_blank"
                rel="noopener noreferrer"
                class="button"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </footer>
    `;
  }

  // Future: observedAttributes and attributeChangedCallback if props are needed.
}

export default SiteFooter;
