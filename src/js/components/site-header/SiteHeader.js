class SiteHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                /* Basic styles for the header */
                :host {
                    display: block;
                    background-color: #f8f8f8; /* Example background */
                    padding: 10px 20px;
                    border-bottom: 1px solid #ddd;
                }
                nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .logo a {
                    font-weight: bold;
                    text-decoration: none;
                    color: #333;
                    font-size: 1.5em;
                }
                ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                }
                li a {
                    text-decoration: none;
                    color: #333;
                    padding: 10px 15px;
                }
                li a:hover {
                    color: #007bff; /* Example hover color */
                }
            </style>
            <header>
                <div class="logo">
                    <a href="index.html">MyPortfolio</a> <!-- Or your site title/logo -->
                </div>
                <nav>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="work.html">Work</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="contact.html">Contact</a></li>
                        <li><a href="styleguide.html">Style Guide</a></li>
                    </ul>
                </nav>
            </header>
        `;
    }
}

export default SiteHeader; 