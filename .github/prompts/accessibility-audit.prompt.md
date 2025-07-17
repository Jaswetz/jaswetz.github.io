---
description: Review the provided HTML for **WCAG 2.1 Level AA** compliance.
mode: ask
---

## Requirements

- Identify any **accessibility issues**, particularly related to:
  - Color contrast ratios
  - Keyboard navigation
  - Semantic HTML structure
  - ARIA usage and roles
  - Focus visibility and tab order
  - Form labeling and accessible names
- Use the correct **WCAG success criteria ID and description** (e.g., 1.4.3 Contrast (Minimum)).
- Write each **recommended fix as a TODO** item to be added to the `TODO.md` file.
- TODOs should be:
  - Concise but descriptive
  - Actionable by a developer
  - Include the relevant WCAG reference

## Output Format

Respond with a bulleted list:

- **Issue**: [Brief summary of the accessibility problem]
- **WCAG Criteria**: [ID and name]
- **TODO**: Add the following to `TODO.md`: [actionable fix]

## Example

```plaintext
- Issue: Button text has insufficient contrast against the background.
  WCAG Criteria: 1.4.3 Contrast (Minimum)
  TODO: Add to TODO.md — Increase button text color contrast to at least 4.5:1.

- Issue: Form input is missing an accessible label.
  WCAG Criteria: 1.3.1 Info and Relationships
  TODO: Add to TODO.md — Add a <label> element with a for/id pair to associate with the input.
```
