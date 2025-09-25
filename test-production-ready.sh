#!/bin/bash

# Production Readiness Test Suite
# Tests all critical aspects for deployment

set -e  # Exit on any error

echo "🚀 Production Readiness Test Suite"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

run_test() {
    local test_name="$1"
    local test_command="$2"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "\n${BLUE}[$TOTAL_TESTS]${NC} Testing: $test_name"
    echo "Command: $test_command"

    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}: $test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAIL${NC}: $test_name"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        # Show the actual error for debugging
        echo -e "${YELLOW}Error details:${NC}"
        eval "$test_command" || true
    fi
}

echo -e "\n${YELLOW}Phase 1: Code Quality${NC}"
echo "===================="

run_test "JavaScript Linting" "npm run lint"
run_test "CSS Linting" "npm run stylelint"
run_test "Security Audit (Production)" "npm audit --omit=dev --audit-level=high"

echo -e "\n${YELLOW}Phase 2: Build & Bundle Size${NC}"
echo "============================="

run_test "Production Build" "npm run build"
run_test "Bundle Size Validation" "npm run test:bundle-size"

echo -e "\n${YELLOW}Phase 3: Unit Tests${NC}"
echo "==================="

run_test "Unit Test Suite" "npm test -- --run"

echo -e "\n${YELLOW}Phase 4: Component Tests${NC}"
echo "========================"

# Test individual components exist and are valid
run_test "BaseComponent exists" "test -f src/js/components/BaseComponent.js"
run_test "SiteHeader component" "test -f src/js/components/site-header/SiteHeader.js"
run_test "SiteFooter component" "test -f src/js/components/site-footer/SiteFooter.js"
run_test "ImageLightbox component" "test -f src/js/components/ImageLightbox/ImageLightbox.js"
run_test "SidebarNavigation component" "test -f src/js/components/sidebar-navigation/SidebarNavigation.js"

echo -e "\n${YELLOW}Phase 5: Critical Files${NC}"
echo "======================"

run_test "Main HTML file" "test -f src/index.html"
run_test "Main CSS file" "test -f src/css/main.css"
run_test "Main JS file" "test -f src/js/main.js"
run_test "Analytics system" "test -f src/js/analytics/simple-analytics.js"
run_test "Service worker" "test -f src/js/service-worker.js"

echo -e "\n${YELLOW}Phase 6: Configuration Files${NC}"
echo "============================"

run_test "Package.json valid" "node -e 'JSON.parse(require(\"fs\").readFileSync(\"package.json\"))'"
run_test "ESLint config" "test -f eslint.config.js"
run_test "Prettier config" "test -f .prettierrc.json"
run_test "Stylelint config" "test -f .stylelintrc.json"
run_test "Bundlesize config" "node -e 'const pkg = JSON.parse(require(\"fs\").readFileSync(\"package.json\")); if (!pkg.bundlesize) throw new Error(\"No bundlesize config\")'"

echo -e "\n${YELLOW}Phase 7: Performance Validation${NC}"
echo "==============================="

# Check if dist directory has expected files
run_test "Dist directory exists" "test -d dist"
run_test "Main HTML built" "test -f dist/index.html"
run_test "CSS files built" "ls dist/*.css > /dev/null 2>&1"
run_test "JS files built" "ls dist/*.js > /dev/null 2>&1"

echo -e "\n${YELLOW}Phase 8: Documentation${NC}"
echo "====================="

run_test "README exists" "test -f README.md"
run_test "Architecture docs" "test -f Docs/ARCHITECTURE.md"
run_test "Testing docs" "test -f Docs/TESTING.md"

# Final Results
echo -e "\n${BLUE}=================================="
echo -e "📊 PRODUCTION READINESS RESULTS"
echo -e "==================================${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! ($PASSED_TESTS/$TOTAL_TESTS)${NC}"
    echo -e "${GREEN}✅ Ready for production deployment!${NC}"
    exit 0
else
    echo -e "${RED}❌ $FAILED_TESTS/$TOTAL_TESTS tests failed${NC}"
    echo -e "${GREEN}✅ $PASSED_TESTS/$TOTAL_TESTS tests passed${NC}"
    echo -e "${YELLOW}⚠️  Please fix failing tests before deployment${NC}"
    exit 1
fi
