# Microsoft Clarity Integration Guide

Microsoft Clarity has been integrated into your portfolio website to provide comprehensive user behavior insights through heatmaps and session recordings.

## What is Microsoft Clarity?

Microsoft Clarity is a free user behavior analytics tool that provides:

- **Heatmaps**: Visual representations of where users click, scroll, and move their mouse
- **Session recordings**: Watch real user sessions to understand user behavior
- **User insights**: Demographics, device information, and user journey analytics
- **Performance metrics**: Page load times and user experience data

## Setup Instructions

### 1. Create a Microsoft Clarity Account

1. Go to [https://clarity.microsoft.com/](https://clarity.microsoft.com/)
2. Sign in with your Microsoft account (or create one)
3. Click "Create new project"
4. Enter your website details:
   - Project name: "Jason Swetzoff Portfolio"
   - Website URL: your domain
   - Category: Portfolio/Personal Website

### 2. Get Your Project ID

1. After creating the project, you'll see your unique Project ID
2. Copy this ID (it looks like: `abcd1234`)

### 3. Update the Configuration

1. Open `src/js/clarity-config.js`
2. Replace `YOUR_CLARITY_PROJECT_ID` with your actual project ID
3. Save the file

```javascript
// Replace this line:
})(window, document, "clarity", "script", "YOUR_CLARITY_PROJECT_ID");

// With your actual project ID:
})(window, document, "clarity", "script", "abcd1234");
```

## Files Modified

The following files have been updated to include Microsoft Clarity:

### New Files Created:

- `src/js/clarity-config.js` - Main Clarity configuration and custom tracking functions

### Updated Files:

- `src/index.html` - Added Clarity script reference
- `src/about.html` - Added Clarity script reference
- `src/work.html` - Added Clarity script reference
- `src/contact.html` - Added Clarity script reference

## Custom Tracking Features

The integration includes custom tracking functions for better insights:

### Available Tracking Functions

```javascript
// Track project interactions
window.clarityTracking.trackProject("Project Name", "click");

// Track resume downloads
window.clarityTracking.trackResume();

// Track contact form interactions
window.clarityTracking.trackContact("form_opened");

// Track navigation between pages
window.clarityTracking.trackNavigation("about", "header_menu");

// Track any custom event
window.clarityTracking.trackEvent("custom_event", { key: "value" });
```

### Automatic Tracking

The following events are tracked automatically:

- Page loads with page information
- User type tagging (visitor/returning)
- Page type identification
- Basic user journey mapping

## Implementation Examples

### Track Project Card Clicks

Add this to your project card click handlers:

```javascript
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", function () {
    const projectName = this.querySelector(".project-title").textContent;
    window.clarityTracking.trackProject(projectName, "card_click");
  });
});
```

### Track Resume Downloads

Add this to your resume download link:

```javascript
document
  .querySelector(".resume-download")
  .addEventListener("click", function () {
    window.clarityTracking.trackResume();
  });
```

### Track Contact Form Interactions

```javascript
// When contact form is opened
window.clarityTracking.trackContact("form_opened");

// When form is submitted
window.clarityTracking.trackContact("form_submitted");
```

## Data Privacy Considerations

Microsoft Clarity complies with GDPR and other privacy regulations:

- **No PII Collection**: Clarity automatically masks sensitive information
- **IP Anonymization**: IP addresses are anonymized by default
- **GDPR Compliant**: Meets European privacy requirements
- **User Control**: Users can opt-out if needed

### Privacy Settings

The current configuration:

- Does not collect personally identifiable information
- Masks form inputs automatically
- Anonymizes user data
- Complies with privacy regulations

## Viewing Your Data

### Accessing Clarity Dashboard

1. Go to [https://clarity.microsoft.com/](https://clarity.microsoft.com/)
2. Sign in to your account
3. Select your project
4. View your analytics data

### Key Metrics to Monitor

- **Popular Pages**: Which pages get the most traffic
- **User Behavior**: How users navigate your site
- **Click Patterns**: What elements users interact with most
- **Scroll Depth**: How far users scroll on each page
- **Dead Clicks**: Where users click but nothing happens
- **Rage Clicks**: Areas where users click repeatedly (potential issues)

## Troubleshooting

### Clarity Not Loading

1. Check that your Project ID is correct in `clarity-config.js`
2. Ensure the script is loading without errors in browser console
3. Verify your website domain is added to your Clarity project

### No Data Appearing

1. Allow 24-48 hours for initial data collection
2. Check that you have sufficient traffic (minimum ~100 page views)
3. Verify the tracking code is on all pages

### Testing the Integration

1. Open browser developer tools
2. Go to Console tab
3. Look for "Microsoft Clarity integration loaded successfully" message
4. Check Network tab for successful requests to clarity.ms

## Advanced Features

### Custom User Identification

If you add user accounts later:

```javascript
// Set user ID for logged-in users
window.clarityTracking.setUserID("user123");

// Tag users with custom attributes
window.clarityTracking.tagUser("user_type", "premium");
window.clarityTracking.tagUser("signup_date", "2024-01-15");
```

### Integration with Google Analytics

Both tools work together:

- Use GA4 for traffic and conversion tracking
- Use Clarity for user behavior and UX insights
- Both provide complementary data for optimization

## Next Steps

1. **Set up your Clarity account** and get your Project ID
2. **Update the configuration** with your Project ID
3. **Deploy the changes** to your live website
4. **Wait 24-48 hours** for data to start appearing
5. **Review insights** and optimize your portfolio based on user behavior

## Support

- **Microsoft Clarity Documentation**: [https://docs.microsoft.com/clarity/](https://docs.microsoft.com/clarity/)
- **Community Support**: [https://github.com/microsoft/clarity](https://github.com/microsoft/clarity)
- **Help Center**: Available in the Clarity dashboard
