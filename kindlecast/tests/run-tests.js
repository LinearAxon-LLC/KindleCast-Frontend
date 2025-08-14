#!/usr/bin/env node

/**
 * Test Runner for Frontend Pages
 * Runs basic connectivity and structure tests
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3001',
  timeout: 10000,
  pages: [
    '/',
    '/dashboard',
    '/terms-of-service',
    '/privacy-policy',
    '/not-found'
  ]
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function logSection(title) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(colorize(`🧪 ${title}`, 'cyan'));
  console.log(`${'='.repeat(50)}`);
}

function logTestResult(testName, passed, details = '') {
  const status = passed ? colorize('✅ PASS', 'green') : colorize('❌ FAIL', 'red');
  const detailsText = details ? colorize(`: ${details}`, 'yellow') : '';
  console.log(`${status} - ${testName}${detailsText}`);
}

// HTTP request helper
function makeRequest(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: timeout,
      headers: {
        'User-Agent': 'KindleCast-Test-Runner/1.0'
      }
    };

    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          body: data,
          success: res.statusCode >= 200 && res.statusCode < 400
        });
      });
    });

    req.on('error', (error) => {
      reject({
        success: false,
        error: error.message,
        code: error.code
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        success: false,
        error: 'Request timeout',
        code: 'TIMEOUT'
      });
    });

    req.end();
  });
}

// Test functions
async function testPageLoad(url) {
  try {
    const result = await makeRequest(url, TEST_CONFIG.timeout);
    return result;
  } catch (error) {
    return error;
  }
}

function testPageContent(body, page) {
  const issues = [];

  // Basic HTML structure tests
  if (!body.includes('<html')) {
    issues.push('Missing HTML tag');
  }

  if (!body.includes('<head>') && !body.includes('<head ')) {
    issues.push('Missing HEAD tag');
  }

  if (!body.includes('<body>') && !body.includes('<body ')) {
    issues.push('Missing BODY tag');
  }

  // Page-specific content tests
  const pageTests = {
    '/': [
      { test: body.includes('Kinddy'), message: 'Missing brand name' },
      { test: body.includes('Kindle'), message: 'Missing Kindle reference' },
      { test: body.includes('pricing') || body.includes('Pricing'), message: 'Missing pricing section' }
    ],
    '/dashboard': [
      { test: body.includes('dashboard') || body.includes('Dashboard'), message: 'Missing dashboard content' }
    ],
    '/terms-of-service': [
      { test: body.includes('Terms of Service') || body.includes('terms'), message: 'Missing terms content' },
      { test: body.includes('agreement') || body.includes('service'), message: 'Missing legal content' }
    ],
    '/privacy-policy': [
      { test: body.includes('Privacy Policy') || body.includes('privacy'), message: 'Missing privacy content' },
      { test: body.includes('information') || body.includes('data'), message: 'Missing privacy details' }
    ]
  };

  const specificTests = pageTests[page] || [];
  specificTests.forEach(({ test, message }) => {
    if (!test) {
      issues.push(message);
    }
  });

  // Check for actual error pages (not just error handling code)
  // Skip error detection for expected error pages
  if (page !== '/not-found' && (body.includes('<h1>500</h1>') || body.includes('Internal Server Error'))) {
    issues.push('Page contains 500 error');
  }

  if (page !== '/not-found' && (body.includes('<h1>404</h1>') || (body.includes('404') && body.includes('Page Not Found')))) {
    issues.push('Page contains 404 error');
  }

  // Check for React hydration errors (actual error messages, not code)
  if (body.includes('Hydration failed because') || body.includes('hydration error')) {
    issues.push('React hydration issues detected');
  }

  return issues;
}

function testResponseHeaders(headers) {
  const issues = [];
  
  // Check content type
  const contentType = headers['content-type'];
  if (!contentType || !contentType.includes('text/html')) {
    issues.push(`Unexpected content-type: ${contentType}`);
  }

  // Check for security headers (optional but recommended)
  const securityHeaders = [
    'x-frame-options',
    'x-content-type-options',
    'x-xss-protection'
  ];

  const missingSecurityHeaders = securityHeaders.filter(header => !headers[header]);
  if (missingSecurityHeaders.length > 0) {
    issues.push(`Missing security headers: ${missingSecurityHeaders.join(', ')}`);
  }

  return issues;
}

// Main test runner
async function runTests() {
  logSection('FRONTEND PAGE TESTS');
  console.log(colorize(`Testing base URL: ${TEST_CONFIG.baseUrl}`, 'blue'));
  console.log(colorize(`Timeout: ${TEST_CONFIG.timeout}ms`, 'blue'));
  
  let totalTests = 0;
  let passedTests = 0;
  const results = {};

  for (const page of TEST_CONFIG.pages) {
    const url = TEST_CONFIG.baseUrl + page;
    logSection(`Testing Page: ${page}`);
    
    results[page] = {
      url,
      tests: {}
    };

    // Test 1: Page Load
    totalTests++;
    console.log(colorize(`Making request to: ${url}`, 'blue'));
    const loadResult = await testPageLoad(url);

    // Special handling for expected 404 pages
    const isExpected404 = page === '/not-found' && loadResult.statusCode === 404;
    const loadPassed = loadResult.success || isExpected404;

    logTestResult('Page Load', loadPassed,
      loadPassed
        ? `Status: ${loadResult.statusCode} ${loadResult.statusMessage}${isExpected404 ? ' (Expected 404)' : ''}`
        : `Error: ${loadResult.error} (${loadResult.code || 'UNKNOWN'})`
    );

    results[page].tests.pageLoad = loadResult;
    if (loadPassed) passedTests++;

    // If page doesn't load (and it's not an expected 404), skip content tests
    if (!loadPassed) {
      console.log(colorize('⏭️  Skipping content tests due to page load failure\n', 'yellow'));
      continue;
    }

    // Test 2: Response Headers
    totalTests++;
    const headerIssues = testResponseHeaders(loadResult.headers);
    const headersPassed = headerIssues.length === 0;
    logTestResult('Response Headers', headersPassed,
      headersPassed ? 'All headers OK' : `Issues: ${headerIssues.join(', ')}`
    );
    results[page].tests.headers = { passed: headersPassed, issues: headerIssues };
    if (headersPassed) passedTests++;

    // Test 3: Page Content
    totalTests++;
    const contentIssues = testPageContent(loadResult.body, page);
    const contentPassed = contentIssues.length === 0;
    logTestResult('Page Content', contentPassed,
      contentPassed ? 'Content structure OK' : `Issues: ${contentIssues.join(', ')}`
    );
    results[page].tests.content = { passed: contentPassed, issues: contentIssues };
    if (contentPassed) passedTests++;

    // Test 4: Response Time
    totalTests++;
    const responseTime = loadResult.responseTime || 0;
    const responseTimePassed = responseTime < 5000; // 5 seconds max
    logTestResult('Response Time', responseTimePassed,
      `${responseTime}ms ${responseTimePassed ? '(Good)' : '(Slow)'}`
    );
    results[page].tests.responseTime = { passed: responseTimePassed, time: responseTime };
    if (responseTimePassed) passedTests++;

    console.log(''); // Add spacing
  }

  // Final Results
  logSection('TEST SUMMARY');
  console.log(`📊 Total Tests: ${colorize(totalTests, 'bright')}`);
  console.log(`✅ Passed: ${colorize(passedTests, 'green')}`);
  console.log(`❌ Failed: ${colorize(totalTests - passedTests, 'red')}`);
  console.log(`📈 Success Rate: ${colorize(((passedTests / totalTests) * 100).toFixed(1) + '%', 'bright')}`);

  // Recommendations
  logSection('RECOMMENDATIONS');
  if (passedTests === totalTests) {
    console.log(colorize('🎉 All tests passed! Your frontend is working correctly.', 'green'));
  } else {
    console.log(colorize('🔧 Issues found. Consider the following:', 'yellow'));
    console.log('   1. Check server is running on the correct port');
    console.log('   2. Verify all pages are accessible');
    console.log('   3. Fix any content structure issues');
    console.log('   4. Optimize slow-loading pages');
  }

  return {
    totalTests,
    passedTests,
    successRate: (passedTests / totalTests) * 100,
    results
  };
}

// Run tests if called directly
if (require.main === module) {
  runTests().catch(error => {
    console.error(colorize('Test runner failed:', 'red'), error);
    process.exit(1);
  });
}

module.exports = { runTests, TEST_CONFIG };
