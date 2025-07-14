# Task Completion Protocol

This guide outlines the steps an AI agent (or contributor) should follow to efficiently work on and complete a GitHub issue. Follow these instructions to ensure high-quality, consistent, and collaborative work.

---

## 1. Understand the Issue

- Consult all GitHub issues to determine the current stage and available tasks.
- **Read the entire issue ticket** carefully, including all descriptions, checklists, acceptance criteria, and comments.
- **Review referenced documentation** and related issues or pull requests for context.
- **Clarify any uncertainties** by commenting on the issue or tagging the relevant team member.
- Consult all GitHub issues to determine the current stage and available tasks.

## 2. Prepare for Implementation

- **Review labels, assignees, and milestones** to understand the issue’s priority, scope, and timeline.
- **Check `/Docs/project_structure.md`** for guidelines on file organization, naming conventions, and dependencies.
- **Consult `/Docs/UX.md`** if the issue involves UI/UX work to ensure compliance with design and accessibility standards.

## 3. Development Workflow

- **Branching:**

  - Create a new feature branch from the `main` branch using a descriptive name (e.g., `feature/issue-123-description`).
  - Ensure the `main` branch remains stable and deployable at all times.

- **Implementation:**

  - Complete all tasks and subtasks listed in the issue.
  - Follow code style, documentation, and testing standards as outlined in the project documentation.
  - For UI/UX issues, ensure all changes meet design system and accessibility requirements (WCAG 2.1 AA).

- **Error Handling:**
  - Check for similar issues before attempting to fix errors.
  - Document any encountered errors, root causes, and solutions in the issue comments.
  - Escalate persistent or critical issues by tagging the appropriate team member or creating a high-priority issue.

## 4. Collaboration and Communication

- **Use comments to provide updates** on progress, blockers, or questions.
- **@mention relevant team members** for reviews, clarifications, or approvals.
- **Assign yourself to the issue** if not already assigned.

## 5. Testing and Validation

- **Test all implemented functionality** to ensure it meets the acceptance criteria and does not introduce regressions.
- **Run automated tests** and accessibility checks (e.g., axe-core, Lighthouse, Playwright) as applicable.
- **Verify that all checklists and subtasks** in the issue are complete.

## 6. Documentation

- **Update or add documentation and code comments** as needed to explain new functionality, changes, or important decisions.

## 7. Pull Request and Review

- **Open a pull request (PR):**

  - Reference the issue in the PR description using keywords like `Closes #issue-number`.
  - Provide a clear summary of changes and any important implementation notes.
  - Ensure the PR is small, focused, and easy to review.

- **Request review** from relevant team members.
- **Respond to feedback** and make necessary changes.

## 8. Merging and Closing

- **Merge the PR** into the `main` branch after approval.
- **Confirm the issue is automatically closed** by the PR, or close it manually if needed.
- **Add a resolution note** in the issue if appropriate.

## 9. Final Checklist Before Marking Complete

- [ ] All functionality is implemented and tested.
- [ ] Code adheres to project structure and coding standards.
- [ ] UI/UX matches specifications and passes accessibility checks (if applicable).
- [ ] No errors or warnings remain.
- [ ] All checklists and subtasks are complete.
- [ ] Documentation and comments are updated.
- [ ] Issue is linked and closed via PR.

---

By following this protocol, you ensure that every issue is addressed thoroughly, collaboratively, and in alignment with project standards.
