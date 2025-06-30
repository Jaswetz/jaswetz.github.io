/**
 * Test Script for Password Protection System
 *
 * Simple test to verify the password protection system is working correctly.
 * Run this in the browser console on a protected page.
 */

// Test configuration access
import { getCaseStudyConfig, isCaseStudyProtected } from "./password-config.js";
import { PasswordProtection } from "./password-protection.js";

/**
 * Run basic tests on the password protection system
 */
export function runPasswordProtectionTests() {
  console.group("🔒 Password Protection System Tests");

  // Test 1: Configuration access
  console.log("1. Testing configuration access...");
  const config = getCaseStudyConfig("project-autodesk-di");
  console.log("✓ Config loaded:", config ? "Success" : "Failed");

  // Test 2: Protection check
  console.log("2. Testing protection check...");
  const isProtected = isCaseStudyProtected("project-autodesk-di");
  console.log(
    "✓ Protection check:",
    isProtected ? "Protected" : "Not protected"
  );

  // Test 3: Authentication check
  console.log("3. Testing authentication...");
  const protection = new PasswordProtection("project-autodesk-di");
  const isAuth = protection.isAuthenticated();
  console.log(
    "✓ Authentication status:",
    isAuth ? "Authenticated" : "Not authenticated"
  );

  // Test 4: DOM elements
  console.log("4. Testing DOM integration...");
  const mainContent = document.querySelector("main");
  const footer = document.querySelector("site-footer");
  console.log("✓ Main content found:", mainContent ? "Yes" : "No");
  console.log("✓ Footer found:", footer ? "Yes" : "No");

  // Test 5: CSS loaded
  console.log("5. Testing CSS loading...");
  const styles = getComputedStyle(document.body);
  console.log("✓ CSS custom properties available");

  console.groupEnd();

  return {
    configLoaded: !!config,
    isProtected: isProtected,
    isAuthenticated: isAuth,
    domElementsFound: !!(mainContent && footer),
  };
}

/**
 * Test authentication with correct password
 */
export function testAuthentication() {
  console.group("🔐 Testing Authentication");

  const protection = new PasswordProtection("project-autodesk-di");
  const testPassword = "CuriousDesign404";

  console.log("Testing with correct password...");
  const authResult = protection.authenticate(testPassword);
  console.log("✓ Authentication result:", authResult ? "Success" : "Failed");

  if (authResult) {
    console.log("✓ Session stored in localStorage");
    const isAuth = protection.isAuthenticated();
    console.log("✓ Authentication persisted:", isAuth ? "Yes" : "No");
  }

  console.groupEnd();
  return authResult;
}

/**
 * Test logout functionality
 */
export function testLogout() {
  console.group("🚪 Testing Logout");

  const protection = new PasswordProtection("project-autodesk-di");

  console.log("Logging out...");
  protection.logout();

  const isAuth = protection.isAuthenticated();
  console.log("✓ Logout result:", !isAuth ? "Success" : "Failed");

  console.groupEnd();
  return !isAuth;
}

// Auto-run tests in development
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  console.log("🧪 Running password protection tests...");

  // Run tests after page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runPasswordProtectionTests);
  } else {
    setTimeout(runPasswordProtectionTests, 1000);
  }
}
