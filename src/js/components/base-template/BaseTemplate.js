export class BaseTemplate extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const title = this.getAttribute("title") || "My Portfolio";
    document.title = title;

    // Create favicon links
    const faviconLinks = `
      <link rel="icon" type="image/x-icon" href="/assets/favicons/favicon.ico">
      <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png">
      <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicons/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="96x96" href="/assets/favicons/favicon-96x96.png">
      <link rel="apple-touch-icon" href="/assets/favicons/apple-icon.png">
    `;

    // Add favicon links to head
    document.head.insertAdjacentHTML("beforeend", faviconLinks);

    // Check if header and footer already exist
    const existingHeader = document.querySelector("site-header");
    const existingFooter = document.querySelector("site-footer");

    // Create header if it doesn't exist
    if (!existingHeader) {
      const header = document.createElement("site-header");
      document.body.insertBefore(header, document.body.firstChild);
    }

    // Create footer if it doesn't exist
    if (!existingFooter) {
      const footer = document.createElement("site-footer");
      document.body.appendChild(footer);
    }

    // Move content into main element
    const main = document.createElement("main");
    while (this.firstChild) {
      main.appendChild(this.firstChild);
    }

    // Insert main content before footer
    const footer = document.querySelector("site-footer");
    if (footer) {
      document.body.insertBefore(main, footer);
    } else {
      document.body.appendChild(main);
    }
  }
}

customElements.define("base-template", BaseTemplate);
