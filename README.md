# jaswetz.github.io

This repository contains the source code and assets for the jaswetz.github.io personal portfolio website. It is built with modern web standards focusing on performance, accessibility, and maintainability.

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)

### Getting Started

```
# Clone the repository
git clone https://github.com/jaswetz/jaswetz.github.io.git
cd jaswetz.github.io

# Install dependencies
npm ci

# Start development server
npm run dev
```

Open your browser at `http://localhost:1234` to see the site running locally with hot reload.

---

## Project Overview

jaswetz.github.io is implemented with native Web Components, vanilla JavaScript (ES2022), CSS3 with Cascade Layers, and Parcel.js as its bundler. The project emphasizes:

- Lightweight, framework-free architecture
- Accessibility compliance (WCAG 2.1 Level AA)
- Responsive design and performance optimization
- Modular, reusable components with encapsulated styles

---

## Development

For detailed development workflows, coding standards, agent instructions, and build/test commands, please refer to the [AGENTS.md](AGENTS.md) file.

Key notes:

- The project follows a strict naming convention outlined in AGENTS.md.
- Use Git feature branches for development and pull requests for merging.
- GitHub workflows handle CI testing and deployment.

---

## Contributing

See the comprehensive guide at `Docs/CONTRIBUTING.md` for instructions on setting up your environment, coding standards, commit messaging, testing, and the pull request process.

---

## Testing

Testing guidelines, coverage requirements, and accessibility testing procedures are documented in `Docs/TESTING.md`.

Run tests locally using:

```
npm run test
```

---

## Building and Deployment

Build the production-ready version:

```
npm run build
```

Preview the production build locally:

```
npm run preview
```

---

## Additional Resources

- Architecture details: `Docs/ARCHITECTURE.md`
- Asset optimization strategies: `Docs/ASSET_OPTIMIZATION_GUIDE.md`
- Password protection setup: `Docs/PASSWORD_PROTECTION.md`
- Continuous integration workflows: `.github/workflows/`

---

## Contact & Support

For questions, issues, or feature requests, please open an issue on GitHub or contact the maintainer directly.

---

This README is designed to provide a concise overview and quick start for humans. For automated tooling, AI agents, and detailed developer instructions, please consult [AGENTS.md](AGENTS.md).
