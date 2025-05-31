export class BaseTemplate extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const title = this.getAttribute("title") || "Jason Swetz";
    const content = this.innerHTML;

    // Create the document structure
    document.title = title;

    // Add header if not present
    if (!document.querySelector("site-header")) {
      const header = document.createElement("site-header");
      document.body.insertBefore(header, document.body.firstChild);
    }

    // Add footer if not present
    if (!document.querySelector("site-footer")) {
      const footer = document.createElement("site-footer");
      document.body.appendChild(footer);
    }

    // Move the content into the main element
    const main = document.createElement("main");
    main.innerHTML = content;
    document.body.insertBefore(main, document.querySelector("site-footer"));
  }
}

customElements.define("base-template", BaseTemplate);
