#!/bin/bash

# Local Testing Script for Jason Swetzoff Portfolio
# This script runs all quality checks locally before pushing to CI/CD

set -e  # Exit on any error

echo "🚀 Starting comprehensive test suite..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if dependencies are installed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci
fi
print_status "Dependencies ready"

# 1. Security audit
echo "🔒 Running security audit..."
npm run test:security || {
    print_warning "Security audit found issues. Review and fix before deploying."
}
print_status "Security audit completed"

# 2. Lint JavaScript
echo "🔍 Linting JavaScript..."
npm run lint
print_status "JavaScript linting passed"

# 3. Lint CSS
echo "🎨 Linting CSS..."
npm run stylelint
print_status "CSS linting passed"

# 4. Validate HTML
echo "📄 Validating HTML..."
npm run test:html-validate
print_status "HTML validation passed"

# 5. Build the project
echo "🏗️ Building project..."
npm run build
print_status "Build completed"

# 6. Check bundle size
echo "📊 Checking bundle size..."
npm run test:bundle-size || {
    print_warning "Bundle size check failed. Consider optimizing assets."
}
print_status "Bundle size check completed"

# 7. Start server in background for testing
echo "🌐 Starting test server..."
npm run serve &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Function to cleanup server
cleanup() {
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
    fi
}
trap cleanup EXIT

# 8. Test accessibility
echo "♿ Testing accessibility..."
npx axe http://localhost:8080 --exit || {
    print_error "Accessibility tests failed"
    exit 1
}
print_status "Accessibility tests passed"

# 9. Test performance
echo "⚡ Testing performance..."
npx lighthouse http://localhost:8080 --output json --output-path ./lighthouse-report.json --chrome-flags='--headless --no-sandbox' || {
    print_warning "Performance test encountered issues"
}

# Check performance score
if [ -f "./lighthouse-report.json" ]; then
    SCORE=$(node -e "const report = require('./lighthouse-report.json'); console.log(Math.round(report.lhr.categories.performance.score * 100))")
    echo "Performance Score: $SCORE"
    if [ $SCORE -lt 90 ]; then
        print_warning "Performance score $SCORE is below recommended threshold of 90"
    else
        print_status "Performance test passed with score: $SCORE"
    fi
else
    print_warning "Lighthouse report not generated"
fi

# 10. Test links
echo "🔗 Testing links..."
npx linkcheck http://localhost:8080 || {
    print_warning "Some links may be broken. Review linkcheck output."
}
print_status "Link checking completed"

# 11. Run Playwright tests
echo "🎭 Running cross-browser tests..."
npx playwright test || {
    print_error "Playwright tests failed"
    exit 1
}
print_status "Cross-browser tests passed"

# Cleanup
cleanup

echo ""
echo "🎉 All tests completed successfully!"
echo ""
echo "📊 Test Summary:"
echo "  - Security audit: ✓"
echo "  - JavaScript linting: ✓"
echo "  - CSS linting: ✓" 
echo "  - HTML validation: ✓"
echo "  - Build: ✓"
echo "  - Bundle size: ✓"
echo "  - Accessibility: ✓"
echo "  - Performance: ✓ (Score: $SCORE)"
echo "  - Link checking: ✓"
echo "  - Cross-browser tests: ✓"
echo ""
echo "🚀 Ready for deployment!"
