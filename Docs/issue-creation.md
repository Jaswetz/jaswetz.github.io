# Task Creation Protocol

## 1. Task Management and Planning

- **Create and Define Issues:**  
  Use GitHub Issues to track tasks, bugs, enhancements, and other activities.

  - Provide a **clear, descriptive title** that summarizes the issue’s purpose.
  - Write a **detailed description** explaining the problem, feature, or task, including relevant context and background.
  - Use **issue templates** to ensure submissions are consistent and contain all necessary information. Store templates in `.github/ISSUE_TEMPLATE` and maintain a `config.yml` to guide reporters and enforce template use.
  - For bug reports, include:
    - Steps to reproduce
    - Expected vs. actual behavior
    - Environment details (OS, browser/version)
    - Screenshots or logs if relevant
  - For feature requests, specify:
    - The problem or need
    - Proposed solution
    - Acceptance criteria
    - Any alternatives considered
  - Use **checklists** or task lists to break down larger issues into actionable subtasks.
  - Reference related issues, pull requests, or documentation for context.

- **Break Down Work:**  
  Decompose large, complex tasks into smaller, more manageable issues.

  - Enables parallel work and results in smaller pull requests that are easier to review.
  - Use sub-issues and task lists within issues for granular tracking.

- **Organize and Prioritize:**  
  Use labels and milestones to organize and prioritize work.
  - **Labels:** Categorize issues by type (e.g., `bug`, `enhancement`), priority (`priority:high`, `priority:medium`, `priority:low`), or status (`help wanted`).
  - **Milestones:** Group related issues together to track progress toward larger goals (e.g., feature releases or deadlines).
  - **Assignees:** Clearly designate who is responsible for resolving each issue.

## 2. Research

- Review labels, milestones, and the GitHub issue for relevant subtasks.
- Read and fully understand all referenced documentation before starting implementation.

## 3. Project Structure Compliance

- Review `/Docs/project_structure.md` before:
  - Running any commands.
  - Creating new files or folders.
  - Making structural changes to the project.
  - Adding new dependencies.
- Always keep this file up to date with any structural changes.

## 4. GitHub Issue Templates: Best Practices

- **Use multiple templates** for different issue types (e.g., bug, feature, documentation, general).
- **Customize templates** to match your team’s workflow and information needs.
- **Require** reporters to use templates by configuring `config.yml` with `blank_issues_enabled: false`.
- **Direct** non-issue traffic (e.g., support requests) to external resources using `contact_links` in `config.yml`.
- **Preview and iterate** on templates regularly to ensure they remain relevant and effective.
- **Encourage contributors** to search existing issues before submitting new ones to avoid duplicates.

## 5. Example Issue Template Structure

```### Title
Concise summary of the issue

### Description
A detailed explanation of the problem, feature request, or task.

### Steps to Reproduce (for bugs)
1. Step one
2. Step two
3. ...

**Expected behavior:**
Describe what you expected to happen.

**Actual behavior:**
Describe what actually happened.

### Environment
- OS:
- Browser/Version:

### Screenshots/Logs
(Attach images or paste logs here)

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

### Additional Context
Add any other context, links to related issues/PRs, or references.

### Labels
(e.g., bug, enhancement, documentation)

### Assignees
@username

### Milestone
Sprint or release name
```

By following these practices, your GitHub issues will be clear, actionable, and easy to track, leading to more efficient project management and collaboration.
