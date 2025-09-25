---
description: "Git workflow instructions"
applyTo: "**"
---

# Git Workflow Guidelines

## Commit Practices

### Frequency & Timing

- **Frequent Commits**: Make commits at natural logical points in development
- **Atomic Changes**: Each commit should represent a single, complete change
- **Logical Grouping**: Group related changes together in meaningful commits

### When to Commit

- After completing a feature or component
- After fixing a bug or resolving an issue
- After writing or updating tests
- After documentation updates
- Before starting a new major feature

## Commit Message Conventions

### Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- **feat**: New feature or functionality
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style/formatting changes
- **refactor**: Code refactoring without functionality changes
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, build changes

### Examples

```
feat: add responsive navigation component
fix: correct accessibility label for form inputs
docs: update component usage examples
style: format CSS with consistent indentation
refactor: simplify image lazy loading logic
test: add unit tests for password protection
chore: update build dependencies
```

### Best Practices

- **Clear & Descriptive**: Explain what changed and why
- **Present Tense**: Use present tense ("add" not "added")
- **Concise**: Keep under 50 characters for subject line
- **Reference Issues**: Include issue numbers when applicable (`fix: resolve #123`)

## Branching Strategy

### Main Branch

- **main**: Production-ready code, always deployable
- **Protection**: Require pull request reviews before merging

### Feature Branches

- **Naming**: `feature/description` or `fix/issue-description`
- **Scope**: One feature or fix per branch
- **Lifetime**: Delete after successful merge

## Pull Request Process

### Before Creating PR

- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] Commit messages are clear and descriptive
- [ ] Branch is up to date with main
- [ ] No merge conflicts exist

### PR Description

- **Title**: Clear, descriptive summary
- **Description**: What changes were made and why
- **Testing**: How changes were tested
- **Screenshots**: Visual changes included
- **Related Issues**: Link to relevant issues

### Review Process

- **Self-Review**: Check own code before requesting review
- **Peer Review**: Get feedback from team members
- **Address Feedback**: Make requested changes
- **Approval**: Ensure all required reviews are complete

## Code Review Guidelines

### What to Look For

- **Functionality**: Does the code work as intended?
- **Code Quality**: Follows project standards and best practices
- **Testing**: Adequate test coverage for changes
- **Documentation**: Code is well-documented
- **Performance**: No performance regressions
- **Security**: No security vulnerabilities introduced

### Review Checklist

- [ ] Code follows established patterns
- [ ] No console.log statements in production code
- [ ] Error handling is appropriate
- [ ] Accessibility requirements are met
- [ ] Performance budgets are maintained

## Related Guidelines

- **Code Style**: See `AGENTS.md` for project coding standards
- **Testing**: See `Docs/TESTING.md` for testing procedures
- **Contributing**: See `.github/PULL_REQUEST_TEMPLATE.md` for PR template
