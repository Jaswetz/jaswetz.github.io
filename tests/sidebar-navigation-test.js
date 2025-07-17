/**
 * Test file for Sidebar Navigation Component
 * Run this in browser console to test functionality
 */

// Test 1: Check if component initializes
console.log("Testing Sidebar Navigation Component...");

// Check if sidebar navigation exists
const sidebarNav = document.querySelector(".sidebar-nav");
console.log("Sidebar navigation found:", !!sidebarNav);

if (sidebarNav) {
  // Test 2: Check if links are properly set up
  const navLinks = sidebarNav.querySelectorAll("a[href^=\"#\"]");
  console.log("Navigation links found:", navLinks.length);

  // Test 3: Check if corresponding sections exist
  let sectionsFound = 0;
  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href").substring(1);
    const section = document.getElementById(targetId);
    if (section) sectionsFound++;
  });
  console.log("Matching sections found:", sectionsFound);

  // Test 4: Check if active class is being applied
  const activeLinks = sidebarNav.querySelectorAll("a.active");
  console.log("Active links found:", activeLinks.length);

  // Test 5: Test smooth scrolling (click simulation)
  if (navLinks.length > 1) {
    console.log("Testing smooth scroll...");
    navLinks[1].click();
    setTimeout(() => {
      const newActiveLinks = sidebarNav.querySelectorAll("a.active");
      console.log("Active links after click:", newActiveLinks.length);
    }, 1000);
  }
}

console.log("Sidebar navigation test completed!");
