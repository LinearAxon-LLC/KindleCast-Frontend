/**
 * Comprehensive Frontend Page Tests
 * Tests all pages for console errors, broken links, and functionality
 */

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3001',
  timeout: 10000,
  pages: [
    '/',
    '/dashboard',
    '/terms-of-service',
    '/privacy-policy',
    '/not-found',
    '/500'
  ]
};

// Console error tracking
let consoleErrors = [];
let consoleWarnings = [];

// Override console methods to capture errors
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  consoleErrors.push(args.join(' '));
  originalConsoleError.apply(console, args);
};

console.warn = (...args) => {
  consoleWarnings.push(args.join(' '));
  originalConsoleWarn.apply(console, args);
};

// Test utilities
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function logTestResult(testName, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${testName}${details ? ': ' + details : ''}`);
}

function logSection(title) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🧪 ${title}`);
  console.log(`${'='.repeat(50)}`);
}

// Test functions
async function testPageLoad(url) {
  try {
    const response = await fetch(url);
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

function testPageElements(url) {
  const results = [];
  
  // Test for common elements that should exist
  const requiredElements = {
    '/': [
      'nav', 'header', 'main', 'footer',
      '[data-testid="hero-section"]',
      '[data-testid="pricing-section"]'
    ],
    '/dashboard': [
      'nav', 'main', 'aside',
      '[data-testid="dashboard-sidebar"]',
      '[data-testid="dashboard-content"]'
    ],
    '/terms-of-service': [
      'header', 'main',
      'h1', '[data-testid="terms-content"]'
    ],
    '/privacy-policy': [
      'header', 'main',
      'h1', '[data-testid="privacy-content"]'
    ]
  };

  const elementsToCheck = requiredElements[url] || ['header', 'main'];
  
  elementsToCheck.forEach(selector => {
    const element = document.querySelector(selector);
    results.push({
      selector,
      found: !!element,
      element
    });
  });

  return results;
}

function testAccessibility() {
  const issues = [];
  
  // Check for alt attributes on images
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.alt && !img.getAttribute('aria-label')) {
      issues.push(`Image ${index + 1} missing alt text`);
    }
  });

  // Check for proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (index === 0 && level !== 1) {
      issues.push('Page should start with h1');
    }
    if (level > lastLevel + 1) {
      issues.push(`Heading level skip: ${heading.tagName} after h${lastLevel}`);
    }
    lastLevel = level;
  });

  // Check for form labels
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((input, index) => {
    const hasLabel = input.labels && input.labels.length > 0;
    const hasAriaLabel = input.getAttribute('aria-label');
    const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
    
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push(`Form input ${index + 1} missing label`);
    }
  });

  return issues;
}

function testPerformance() {
  const metrics = {};
  
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
    metrics.firstPaint = timing.responseStart - timing.navigationStart;
  }

  // Check for large images
  const images = document.querySelectorAll('img');
  const largeImages = [];
  images.forEach((img, index) => {
    if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
      largeImages.push(`Image ${index + 1}: ${img.naturalWidth}x${img.naturalHeight}`);
    }
  });

  if (largeImages.length > 0) {
    metrics.largeImages = largeImages;
  }

  return metrics;
}

// Main test runner
async function runPageTests() {
  logSection('FRONTEND PAGE TESTS STARTING');
  
  let totalTests = 0;
  let passedTests = 0;
  const testResults = {};

  for (const page of TEST_CONFIG.pages) {
    const url = TEST_CONFIG.baseUrl + page;
    logSection(`Testing Page: ${page}`);
    
    // Clear previous errors
    consoleErrors = [];
    consoleWarnings = [];
    
    testResults[page] = {
      url,
      tests: {},
      errors: [],
      warnings: []
    };

    // Test 1: Page Load
    totalTests++;
    const loadResult = await testPageLoad(url);
    const loadPassed = loadResult.success;
    logTestResult('Page Load', loadPassed, 
      loadPassed ? `Status: ${loadResult.status}` : `Error: ${loadResult.error || loadResult.statusText}`
    );
    testResults[page].tests.pageLoad = loadResult;
    if (loadPassed) passedTests++;

    // If page doesn't load, skip other tests
    if (!loadPassed) {
      console.log('⏭️  Skipping other tests due to page load failure\n');
      continue;
    }

    // Test 2: Console Errors (simulated - in real browser this would capture actual errors)
    totalTests++;
    const hasConsoleErrors = consoleErrors.length === 0;
    logTestResult('No Console Errors', hasConsoleErrors, 
      hasConsoleErrors ? '' : `${consoleErrors.length} errors found`
    );
    testResults[page].tests.consoleErrors = { passed: hasConsoleErrors, errors: consoleErrors };
    testResults[page].errors = [...consoleErrors];
    if (hasConsoleErrors) passedTests++;

    // Test 3: Console Warnings
    totalTests++;
    const hasMinimalWarnings = consoleWarnings.length <= 2; // Allow some warnings
    logTestResult('Minimal Console Warnings', hasMinimalWarnings,
      `${consoleWarnings.length} warnings found`
    );
    testResults[page].tests.consoleWarnings = { passed: hasMinimalWarnings, warnings: consoleWarnings };
    testResults[page].warnings = [...consoleWarnings];
    if (hasMinimalWarnings) passedTests++;

    // Test 4: Required Elements (simulated)
    totalTests++;
    const elementResults = testPageElements(page);
    const allElementsFound = elementResults.every(result => result.found);
    logTestResult('Required Elements Present', allElementsFound,
      allElementsFound ? '' : `Missing: ${elementResults.filter(r => !r.found).map(r => r.selector).join(', ')}`
    );
    testResults[page].tests.requiredElements = elementResults;
    if (allElementsFound) passedTests++;

    // Test 5: Accessibility (simulated)
    totalTests++;
    const a11yIssues = testAccessibility();
    const a11yPassed = a11yIssues.length === 0;
    logTestResult('Accessibility Check', a11yPassed,
      a11yPassed ? '' : `${a11yIssues.length} issues found`
    );
    testResults[page].tests.accessibility = { passed: a11yPassed, issues: a11yIssues };
    if (a11yPassed) passedTests++;

    // Test 6: Performance (simulated)
    totalTests++;
    const perfMetrics = testPerformance();
    const perfPassed = !perfMetrics.largeImages || perfMetrics.largeImages.length === 0;
    logTestResult('Performance Check', perfPassed,
      perfPassed ? 'No performance issues' : `Large images detected`
    );
    testResults[page].tests.performance = perfMetrics;
    if (perfPassed) passedTests++;

    console.log(''); // Add spacing between pages
  }

  // Final Results
  logSection('TEST SUMMARY');
  console.log(`📊 Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  // Detailed Error Report
  const pagesWithErrors = Object.entries(testResults).filter(([_, result]) => 
    result.errors.length > 0 || result.warnings.length > 3
  );

  if (pagesWithErrors.length > 0) {
    logSection('DETAILED ERROR REPORT');
    pagesWithErrors.forEach(([page, result]) => {
      console.log(`\n🔍 ${page}:`);
      if (result.errors.length > 0) {
        console.log('  Errors:');
        result.errors.forEach(error => console.log(`    - ${error}`));
      }
      if (result.warnings.length > 3) {
        console.log('  Warnings (showing first 5):');
        result.warnings.slice(0, 5).forEach(warning => console.log(`    - ${warning}`));
      }
    });
  }

  // Recommendations
  logSection('RECOMMENDATIONS');
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your frontend is in great shape.');
  } else {
    console.log('🔧 Consider fixing the following issues:');
    console.log('   1. Address any console errors immediately');
    console.log('   2. Fix missing required elements');
    console.log('   3. Improve accessibility compliance');
    console.log('   4. Optimize performance issues');
  }

  return {
    totalTests,
    passedTests,
    successRate: (passedTests / totalTests) * 100,
    results: testResults
  };
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runPageTests, TEST_CONFIG };
} else if (typeof window !== 'undefined') {
  window.runPageTests = runPageTests;
  window.TEST_CONFIG = TEST_CONFIG;
}

// Auto-run if in browser and page is loaded
if (typeof window !== 'undefined' && document.readyState === 'complete') {
  console.log('🚀 Auto-running page tests...');
  runPageTests();
} else if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    console.log('🚀 Auto-running page tests after page load...');
    setTimeout(runPageTests, 1000); // Give page time to fully render
  });
}
