class SiteFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                /* Basic styles for the footer */
                :host {
                    display: block;
                    background-color: #333; /* Example background */
                    color: #fff;
                    padding: 20px;
                    text-align: center;
                    font-size: 0.9em;
                }
                a {
                    color: #fff;
                    text-decoration: underline;
                }
                a:hover {
                    text-decoration: none;
                }
            </style>
            <footer>
                <p>&copy; <span id="current-year">${new Date().getFullYear()}</span> Your Name. All rights reserved.</p>
                <!-- Add social links or other footer content here -->
                <!-- Example: <p><a href="/privacy-policy.html">Privacy Policy</a></p> -->
            </footer>
        `;
    }
}

export default SiteFooter; 