# Password Protection System

## Overview

This modular password protection system allows you to easily protect case studies with a password prompt. The system is designed to be:

- **Modular**: Easy to add/remove case studies from protection
- **User-friendly**: Clean, accessible password prompt interface
- **Secure**: Client-side protection with session management
- **Maintainable**: Centralized configuration and reusable components

## Architecture

```
src/js/auth/
├── password-config.js          # Central configuration
├── password-protection.js      # Core protection logic
└── password-protection-init.js # Easy integration helpers

src/css/components/
└── password-protection.css     # Styling for password interface
```

## Quick Start

### 1. Add Password Protection to a Case Study

Add this script to your case study HTML file before the closing `</body>` tag:

```html
<!-- Password Protection -->
<script type="module">
  import { protectCaseStudy } from "../js/password-protection-init.js";
  protectCaseStudy("your-case-study-id");
</script>
```

### 2. Configure the Case Study

Add your case study to `src/js/auth/password-config.js`:

```javascript
protectedCaseStudies: {
  'your-case-study-id': {
    password: 'YourPassword',
    title: 'Your Case Study Title',
    description: 'Description shown in the password prompt',
    redirectOnCancel: '../work.html'
  }
}
```

## Current Protected Case Studies

- **project-autodesk-di**: ""

## Configuration Options

### Global Settings (`PASSWORD_CONFIG.global`)

- `sessionDuration`: How long authentication lasts (default: 24 hours)
- `storagePrefix`: localStorage key prefix for session data
- `defaultRedirect`: Where to redirect if no specific redirect is set

### Case Study Settings

Each protected case study can have:

- `password`: The password required for access
- `title`: Title shown in the password prompt
- `description`: Explanation text in the password prompt
- `redirectOnCancel`: Where to redirect if user cancels (optional)

## Usage Examples

### Basic Protection

```javascript
import { protectCaseStudy } from "./js/password-protection-init.js";
protectCaseStudy("project-name");
```

### Auto-Detection

```javascript
import { autoProtectCaseStudy } from "./js/password-protection-init.js";
// Automatically detects case study ID from filename
autoProtectCaseStudy();
```

### Manual Integration

```javascript
import { PasswordProtection } from "./js/auth/password-protection.js";

const protection = new PasswordProtection("case-study-id");
protection.init();
```

## Adding New Case Studies

1. **Add configuration** in `password-config.js`:

   ```javascript
   'new-case-study': {
     password: 'SecurePassword123',
     title: 'New Case Study',
     description: 'This case study requires authentication.',
     redirectOnCancel: '../work.html'
   }
   ```

2. **Add protection script** to the HTML file:
   ```html
   <script type="module">
     import { protectCaseStudy } from "../js/password-protection-init.js";
     protectCaseStudy("new-case-study");
   </script>
   ```

## Removing Protection

1. Remove the case study from `password-config.js`
2. Remove the protection script from the HTML file

## Session Management

- Sessions last 24 hours by default
- Authentication is stored in localStorage
- Each case study has independent authentication
- Users can be logged out individually or globally

### Logout Functions

```javascript
import { PasswordProtection } from "./js/auth/password-protection.js";

// Logout from specific case study
const protection = new PasswordProtection("case-study-id");
protection.logout();

// Logout from all case studies
PasswordProtection.logoutAll();
```

## Security Considerations

⚠️ **Important**: This is client-side protection suitable for:

- Keeping case studies out of search engines
- Basic access control for portfolio sharing
- Reducing casual access to sensitive work

**Not suitable for**:

- Protecting truly confidential information
- Defense against determined attackers
- Compliance with strict security requirements

For production applications with sensitive data, implement server-side authentication.

## Browser Support

- Modern browsers with ES6 modules support
- localStorage support required
- CSS custom properties support for styling
- Graceful degradation for older browsers

## Accessibility Features

- Keyboard navigation support (Enter to submit, Escape to cancel)
- Focus management and clear focus indicators
- Screen reader friendly with semantic HTML
- High contrast mode support
- Reduced motion support for animations
- Minimum 44px touch targets for mobile

## Styling

The password prompt follows your project's design system:

- Uses CSS custom properties for theming
- Responsive design for all screen sizes
- Dark mode support
- Consistent with existing form components
- Smooth animations (respectful of reduced motion preferences)

## Troubleshooting

### Password prompt not showing

- Check browser console for errors
- Verify case study ID matches configuration
- Ensure modules are loading correctly

### Styling issues

- Verify `password-protection.css` is imported in `main.css`
- Check that CSS custom properties are defined
- Test responsive breakpoints

### Authentication not persisting

- Check localStorage is enabled
- Verify session hasn't expired
- Check for case study ID mismatches

## Best Practices

1. **Use descriptive case study IDs** that match filenames
2. **Set appropriate session durations** based on use case
3. **Provide clear descriptions** in password prompts
4. **Test on multiple devices** and browsers
5. **Keep passwords secure** and change them periodically
6. **Monitor browser console** for any integration issues

## Future Enhancements

Potential improvements for future versions:

- Server-side password verification
- Password strength requirements
- Brute force protection
- Analytics for access attempts
- Bulk protection/deprotection tools
- Integration with CMS or admin panels
