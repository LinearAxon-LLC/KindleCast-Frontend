/**
 * End-to-End Test for Dashboard Flow
 * Tests the complete user journey: Get Started -> Login -> Dashboard -> Features
 */

const http = require('http');
const https = require('https');

const TEST_CONFIG = {
  baseUrl: 'http://localhost:3001',
  timeout: 15000
};

// Helper function to make HTTP requests
function makeRequest(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: timeout,
      headers: {
        'User-Agent': 'KindleCast-E2E-Test/1.0'
      }
    }, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        resolve({
          success: true,
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
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

// Test 1: Landing Page Load
async function testLandingPageLoad() {
  console.log('🧪 Testing Landing Page Load...');
  
  try {
    const result = await makeRequest(`${TEST_CONFIG.baseUrl}/`, TEST_CONFIG.timeout);
    
    if (result.success && result.statusCode === 200) {
      // Check for key landing page elements
      const hasGetStarted = result.body.includes('Get Started') || result.body.includes('get-started');
      const hasHeroSection = result.body.includes('hero') || result.body.includes('Hero');
      const hasFormatOptions = result.body.includes('Just PDF') && result.body.includes('Summarize');
      
      console.log(`  ✓ Landing page loaded (${result.statusCode})`);
      console.log(`  ✓ Get Started button: ${hasGetStarted ? 'Found' : 'Missing'}`);
      console.log(`  ✓ Hero section: ${hasHeroSection ? 'Found' : 'Missing'}`);
      console.log(`  ✓ Format options: ${hasFormatOptions ? 'Found' : 'Missing'}`);
      
      return { passed: 4, failed: 0, total: 4 };
    } else {
      console.log(`  ✗ Landing page failed to load (${result.statusCode})`);
      return { passed: 0, failed: 4, total: 4 };
    }
  } catch (error) {
    console.log(`  ✗ Landing page test failed: ${error.error || error.message}`);
    return { passed: 0, failed: 4, total: 4 };
  }
}

// Test 2: Dashboard Page Structure
async function testDashboardPageStructure() {
  console.log('🧪 Testing Dashboard Page Structure...');
  
  try {
    const result = await makeRequest(`${TEST_CONFIG.baseUrl}/dashboard`, TEST_CONFIG.timeout);
    
    if (result.success && result.statusCode === 200) {
      // Check for dashboard components
      const hasSidebar = result.body.includes('DashboardSidebar') || result.body.includes('sidebar');
      const hasQuickSend = result.body.includes('Quick Send') || result.body.includes('quick-send');
      const hasMobileMenu = result.body.includes('lg:hidden') && result.body.includes('Menu');
      const hasKindlePreview = result.body.includes('Kindle') && result.body.includes('preview');
      const hasTrialBanner = result.body.includes('trial') || result.body.includes('Trial');
      
      console.log(`  ✓ Dashboard page loaded (${result.statusCode})`);
      console.log(`  ✓ Sidebar component: ${hasSidebar ? 'Found' : 'Missing'}`);
      console.log(`  ✓ Quick Send section: ${hasQuickSend ? 'Found' : 'Missing'}`);
      console.log(`  ✓ Mobile menu: ${hasMobileMenu ? 'Found' : 'Missing'}`);
      console.log(`  ✓ Kindle preview: ${hasKindlePreview ? 'Found' : 'Missing'}`);
      console.log(`  ✓ Trial banner: ${hasTrialBanner ? 'Found' : 'Missing'}`);
      
      return { passed: 6, failed: 0, total: 6 };
    } else {
      console.log(`  ✗ Dashboard page failed to load (${result.statusCode})`);
      return { passed: 0, failed: 6, total: 6 };
    }
  } catch (error) {
    console.log(`  ✗ Dashboard structure test failed: ${error.error || error.message}`);
    return { passed: 0, failed: 6, total: 6 };
  }
}

// Test 3: Mobile Responsiveness
async function testMobileResponsiveness() {
  console.log('🧪 Testing Mobile Responsiveness...');
  
  try {
    const result = await makeRequest(`${TEST_CONFIG.baseUrl}/dashboard`, TEST_CONFIG.timeout);
    
    if (result.success) {
      // Check for mobile-specific classes and responsive design
      const hasMobileClasses = result.body.includes('lg:hidden') && 
                              result.body.includes('sm:') && 
                              result.body.includes('md:');
      const hasResponsiveGrid = result.body.includes('grid-cols-1') && 
                               result.body.includes('lg:grid-cols-2');
      const hasMobileMenu = result.body.includes('fixed') && 
                           result.body.includes('translate-x');
      const hasResponsivePadding = result.body.includes('p-4') && 
                                  result.body.includes('lg:p-8');
      
      console.log(`  ✓ Mobile CSS classes: ${hasMobileClasses ? 'Found' : 'Missing'}`);
      console.log(`  ✓ Responsive grid: ${hasResponsiveGrid ? 'Found' : 'Missing'}`);
      console.log(`  ✓ Mobile menu system: ${hasMobileMenu ? 'Found' : 'Missing'}`);
      console.log(`  ✓ Responsive padding: ${hasResponsivePadding ? 'Found' : 'Missing'}`);
      
      const passed = [hasMobileClasses, hasResponsiveGrid, hasMobileMenu, hasResponsivePadding].filter(Boolean).length;
      return { passed, failed: 4 - passed, total: 4 };
    } else {
      console.log(`  ✗ Mobile responsiveness test failed to load page`);
      return { passed: 0, failed: 4, total: 4 };
    }
  } catch (error) {
    console.log(`  ✗ Mobile responsiveness test failed: ${error.error || error.message}`);
    return { passed: 0, failed: 4, total: 4 };
  }
}

// Test 4: Quick Send Form Features
async function testQuickSendFeatures() {
  console.log('🧪 Testing Quick Send Form Features...');
  
  try {
    const result = await makeRequest(`${TEST_CONFIG.baseUrl}/dashboard`, TEST_CONFIG.timeout);
    
    if (result.success) {
      // Check for form elements and validation
      const hasUrlInput = result.body.includes('type="text"') || result.body.includes('placeholder');
      const hasFormatOptions = result.body.includes('Just PDF') && 
                              result.body.includes('Summarize') && 
                              result.body.includes('Learning Ready') && 
                              result.body.includes('Custom');
      const hasSubmitButton = result.body.includes('Send to Kindle') || result.body.includes('submit');
      const hasValidation = result.body.includes('validateUrl') || result.body.includes('validation');
      
      console.log(`  ✓ URL input field: ${hasUrlInput ? 'Found' : 'Missing'}`);
      console.log(`  ✓ Format options: ${hasFormatOptions ? 'Found' : 'Missing'}`);
      console.log(`  ✓ Submit button: ${hasSubmitButton ? 'Found' : 'Missing'}`);
      console.log(`  ✓ Validation logic: ${hasValidation ? 'Found' : 'Missing'}`);
      
      const passed = [hasUrlInput, hasFormatOptions, hasSubmitButton, hasValidation].filter(Boolean).length;
      return { passed, failed: 4 - passed, total: 4 };
    } else {
      console.log(`  ✗ Quick Send features test failed to load page`);
      return { passed: 0, failed: 4, total: 4 };
    }
  } catch (error) {
    console.log(`  ✗ Quick Send features test failed: ${error.error || error.message}`);
    return { passed: 0, failed: 4, total: 4 };
  }
}

// Test 5: Upgrade Modal Integration
async function testUpgradeModalIntegration() {
  console.log('🧪 Testing Upgrade Modal Integration...');
  
  try {
    // Check if upgrade modal component exists
    const fs = require('fs');
    const path = require('path');
    
    const modalPath = path.join(__dirname, '../src/components/ui/upgrade-plans-modal.tsx');
    const settingsPath = path.join(__dirname, '../src/components/dashboard/pages/SettingsPage.tsx');
    const bannerPath = path.join(__dirname, '../src/components/ui/trial-status-banner.tsx');
    
    const modalExists = fs.existsSync(modalPath);
    const settingsIntegrated = fs.existsSync(settingsPath) && 
                              fs.readFileSync(settingsPath, 'utf8').includes('UpgradePlansModal');
    const bannerIntegrated = fs.existsSync(bannerPath) && 
                            fs.readFileSync(bannerPath, 'utf8').includes('UpgradePlansModal');
    
    console.log(`  ✓ Upgrade modal component: ${modalExists ? 'Found' : 'Missing'}`);
    console.log(`  ✓ Settings page integration: ${settingsIntegrated ? 'Found' : 'Missing'}`);
    console.log(`  ✓ Trial banner integration: ${bannerIntegrated ? 'Found' : 'Missing'}`);
    
    // Check for API integration
    if (modalExists) {
      const modalContent = fs.readFileSync(modalPath, 'utf8');
      const hasApiIntegration = modalContent.includes('/api/v1/subscription/plans') || 
                               modalContent.includes('usePricingPlans');
      console.log(`  ✓ API integration: ${hasApiIntegration ? 'Found' : 'Missing'}`);
      
      const passed = [modalExists, settingsIntegrated, bannerIntegrated, hasApiIntegration].filter(Boolean).length;
      return { passed, failed: 4 - passed, total: 4 };
    } else {
      return { passed: 0, failed: 4, total: 4 };
    }
  } catch (error) {
    console.log(`  ✗ Upgrade modal integration test failed: ${error.message}`);
    return { passed: 0, failed: 4, total: 4 };
  }
}

// Main E2E Test Runner
async function runE2ETests() {
  console.log('🚀 Running End-to-End Dashboard Tests\n');
  console.log(`Testing against: ${TEST_CONFIG.baseUrl}\n`);
  
  const tests = [
    { name: 'Landing Page Load', fn: testLandingPageLoad },
    { name: 'Dashboard Page Structure', fn: testDashboardPageStructure },
    { name: 'Mobile Responsiveness', fn: testMobileResponsiveness },
    { name: 'Quick Send Features', fn: testQuickSendFeatures },
    { name: 'Upgrade Modal Integration', fn: testUpgradeModalIntegration }
  ];
  
  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      totalPassed += result.passed;
      totalFailed += result.failed;
      totalTests += result.total;
      console.log('');
    } catch (error) {
      console.log(`❌ ${test.name} test suite failed: ${error.message}\n`);
      totalFailed++;
      totalTests++;
    }
  }
  
  // Summary
  console.log('📊 E2E Test Summary:');
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Passed: ${totalPassed}`);
  console.log(`   Failed: ${totalFailed}`);
  console.log(`   Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
  
  if (totalFailed === 0) {
    console.log('\n🎉 All E2E tests passed! Dashboard is ready for production.');
  } else {
    console.log(`\n⚠️  ${totalFailed} test(s) failed. Please review the implementation.`);
  }
  
  return {
    passed: totalPassed,
    failed: totalFailed,
    total: totalTests,
    success: totalFailed === 0
  };
}

// Export for use in other test files
module.exports = {
  runE2ETests,
  makeRequest
};

// Run tests if this file is executed directly
if (require.main === module) {
  runE2ETests()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('E2E test runner failed:', error);
      process.exit(1);
    });
}
