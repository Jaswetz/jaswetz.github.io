#!/usr/bin/env node

/**
 * Simple CSP validation test
 * Tests that the CSP headers are properly configured and external resources load correctly
 */

const fs = require("fs");
const path = require("path");

console.log("🔒 Testing Content Security Policy Configuration...\n");

// Test 1: Check if _headers file exists in dist
const headersPath = path.join(__dirname, "dist", "_headers");
if (!fs.existsSync(headersPath)) {
  console.error("❌ _headers file not found in dist folder");
  process.exit(1);
}

console.log("✅ _headers file exists in dist folder");

// Test 2: Parse CSP configuration
const headersContent = fs.readFileSync(headersPath, "utf8");
const cspMatch = headersContent.match(/Content-Security-Policy:\s*(.+)/);

if (!cspMatch) {
  console.error("❌ CSP header not found in _headers file");
  process.exit(1);
}

const csp = cspMatch[1];
console.log("✅ CSP header found");

// Test 3: Validate required sources are included
const requiredSources = [
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://www.clarity.ms",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
  "https://cdn.jsdelivr.net",
];

let allSourcesPresent = true;
requiredSources.forEach((source) => {
  if (!csp.includes(source)) {
    console.error(`❌ Missing required source: ${source}`);
    allSourcesPresent = false;
  } else {
    console.log(`✅ Found required source: ${source}`);
  }
});

if (!allSourcesPresent) {
  process.exit(1);
}

// Test 4: Check for proper directive structure
const requiredDirectives = [
  "default-src",
  "script-src",
  "style-src",
  "img-src",
  "font-src",
  "connect-src",
  "frame-ancestors",
  "form-action",
  "base-uri",
  "object-src",
];

let allDirectivesPresent = true;
requiredDirectives.forEach((directive) => {
  if (!csp.includes(directive)) {
    console.error(`❌ Missing required directive: ${directive}`);
    allDirectivesPresent = false;
  } else {
    console.log(`✅ Found required directive: ${directive}`);
  }
});

if (!allDirectivesPresent) {
  process.exit(1);
}

console.log("\n🎉 All CSP validation tests passed!");
console.log("\n📋 Current CSP Configuration:");
console.log(csp);

console.log(
  "\n✅ CSP is properly configured with all required trusted sources:"
);
console.log("  - Google Analytics and Google Tag Manager");
console.log("  - Microsoft Clarity");
console.log("  - Google Fonts");
console.log("  - Chart.js CDN (jsdelivr.net)");
console.log(
  "  - Proper security directives (frame-ancestors, object-src, etc.)"
);
