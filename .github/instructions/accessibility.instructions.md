---
description: Accessibility should meet WCAG 2.1 Level AA
applyTo: "**"
---

This project commits to an "Accessibility-by-Design" approach, integrating accessibility considerations throughout the development lifecycle.

- **A11Y1. WCAG 2.1 Level AA:** The primary goal is to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.
- **A11Y3. Keyboard Accessibility:** All interactive elements (links, buttons, future form controls) must be fully operable via keyboard. Focus states must be clear and visible.
- **A11Y4. ARIA Attributes:** Use ARIA attributes judiciously to enhance accessibility where native HTML semantics are insufficient, especially for custom Web Components. Prefer native HTML elements and attributes first.
- **A11Y6. Color Contrast:** Text and interactive elements will maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (as defined by WCAG) against their backgrounds.
- **A11Y7. Responsiveness & Zoom:** The website will be responsive across various screen sizes. Text must be resizable up to 200% using browser zoom features without loss of content or functionality.
- **A11Y8. Forms:** If forms are implemented (e.g., a contact form, potentially via a third-party service), they must have clear labels, associated error messages, and support accessible validation.
