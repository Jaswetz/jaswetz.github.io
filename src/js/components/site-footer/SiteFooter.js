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
                /*css*/
                /* Component-specific styles for the footer */
                :host {
                    display: block;
                    background-color: var(--color-background-footer, #333); /* Example, can be themed */
                    color: var(--color-text-footer, #fff);
                    padding: var(--spacing-md) var(--spacing-md);
                    text-align: center;
                    font-size: var(--font-size-sm, 0.9em);
                }
                .footer-content {
                    max-width: 1200px; /* Example max-width */
                    margin: 0 auto;
                }
                .footer-content p {
                    margin: 0;
                    padding: var(--spacing-xs) 0;
                }
                .footer-content a {
                    color: var(--color-text-footer-link, #fff); /* Can be themed */
                    text-decoration: underline;
                }
                .footer-content a:hover,
                .footer-content a:focus {
                    text-decoration: none;
                }
            </style>
            <footer class="footer-content">
                <p>&copy; <span id="current-year">${currentYear}</span> Your Name. All rights reserved.</p>
                <!-- Example: <p><a href="/privacy-policy.html">Privacy Policy</a></p> -->
                <!-- Add other footer links or social media icons here -->
            </footer>
        `;
  }

  // Future: observedAttributes and attributeChangedCallback if props are needed.
}

export default SiteFooter;
