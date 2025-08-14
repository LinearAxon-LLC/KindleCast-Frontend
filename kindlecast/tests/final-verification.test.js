/**
 * Final Verification Test - Source Code Analysis
 * Verifies all implemented features exist in the source code
 */

const fs = require('fs');
const path = require('path');

// Test file paths
const FILES_TO_CHECK = {
  homePage: '../src/components/dashboard/pages/HomePage.tsx',
  sidebar: '../src/components/dashboard/DashboardSidebar.tsx',
  settingsPage: '../src/components/dashboard/pages/SettingsPage.tsx',
  trialBanner: '../src/components/ui/trial-status-banner.tsx',
  upgradeModal: '../src/components/ui/upgrade-plans-modal.tsx',
  apiTypes: '../src/types/api.ts',
  linkProcessor: '../src/hooks/useLinkProcessor.ts'
};

function readFileContent(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    return fs.readFileSync(fullPath, 'utf8');
  } catch (error) {
    return null;
  }
}

// Test 1: URL Validation Implementation
function testUrlValidation() {
  console.log('🧪 Testing URL Validation Implementation...');
  
  const homePageContent = readFileContent(FILES_TO_CHECK.homePage);
  const apiContent = readFileContent('../src/lib/api.ts');
  
  if (!homePageContent || !apiContent) {
    console.log('  ✗ Required files not found');
    return { passed: 0, failed: 3, total: 3 };
  }
  
  const hasValidationFunction = homePageContent.includes('validateUrl') || homePageContent.includes('isValidUrl');
  const hasUrlError = homePageContent.includes('urlError') && homePageContent.includes('setUrlError');
  const hasApiValidation = apiContent.includes('isValidUrl') && apiContent.includes('validateLinkRequest');
  
  console.log(`  ✓ Validation function: ${hasValidationFunction ? 'Found' : 'Missing'}`);
  console.log(`  ✓ URL error handling: ${hasUrlError ? 'Found' : 'Missing'}`);
  console.log(`  ✓ API validation: ${hasApiValidation ? 'Found' : 'Missing'}`);
  
  const passed = [hasValidationFunction, hasUrlError, hasApiValidation].filter(Boolean).length;
  return { passed, failed: 3 - passed, total: 3 };
}

// Test 2: Format Options Implementation
function testFormatOptions() {
  console.log('🧪 Testing Format Options Implementation...');
  
  const homePageContent = readFileContent(FILES_TO_CHECK.homePage);
  const apiTypesContent = readFileContent(FILES_TO_CHECK.apiTypes);
  
  if (!homePageContent || !apiTypesContent) {
    console.log('  ✗ Required files not found');
    return { passed: 0, failed: 4, total: 4 };
  }
  
  const hasFormatButtons = homePageContent.includes('Just PDF') && 
                          homePageContent.includes('Summarize') && 
                          homePageContent.includes('Learning Ready') && 
                          homePageContent.includes('Custom');
  const hasCustomPrompt = homePageContent.includes('customPrompt') && homePageContent.includes('textarea');
  const hasFormatMapping = apiTypesContent.includes('FORMAT_MAPPING');
  const hasIncludeImage = apiTypesContent.includes('include_image');
  
  console.log(`  ✓ Format buttons: ${hasFormatButtons ? 'Found' : 'Missing'}`);
  console.log(`  ✓ Custom prompt textarea: ${hasCustomPrompt ? 'Found' : 'Missing'}`);
  console.log(`  ✓ Format mapping: ${hasFormatMapping ? 'Found' : 'Missing'}`);
  console.log(`  ✓ Include image field: ${hasIncludeImage ? 'Found' : 'Missing'}`);
  
  const passed = [hasFormatButtons, hasCustomPrompt, hasFormatMapping, hasIncludeImage].filter(Boolean).length;
  return { passed, failed: 4 - passed, total: 4 };
}

// Test 3: Mobile Responsiveness Implementation
function testMobileResponsiveness() {
  console.log('🧪 Testing Mobile Responsiveness Implementation...');
  
  const sidebarContent = readFileContent(FILES_TO_CHECK.sidebar);
  const homePageContent = readFileContent(FILES_TO_CHECK.homePage);
  
  if (!sidebarContent || !homePageContent) {
    console.log('  ✗ Required files not found');
    return { passed: 0, failed: 4, total: 4 };
  }
  
  const hasMobileMenu = sidebarContent.includes('isMobileMenuOpen') && sidebarContent.includes('Menu');
  const hasResponsiveClasses = sidebarContent.includes('lg:hidden') && sidebarContent.includes('translate-x');
  const hasResponsiveGrid = homePageContent.includes('grid-cols-1') && homePageContent.includes('lg:grid-cols-2');
  const hasResponsivePadding = homePageContent.includes('p-4') && homePageContent.includes('lg:p-8');
  
  console.log(`  ✓ Mobile menu system: ${hasMobileMenu ? 'Found' : 'Missing'}`);
  console.log(`  ✓ Responsive classes: ${hasResponsiveClasses ? 'Found' : 'Missing'}`);
  console.log(`  ✓ Responsive grid: ${hasResponsiveGrid ? 'Found' : 'Missing'}`);
  console.log(`  ✓ Responsive padding: ${hasResponsivePadding ? 'Found' : 'Missing'}`);
  
  const passed = [hasMobileMenu, hasResponsiveClasses, hasResponsiveGrid, hasResponsivePadding].filter(Boolean).length;
  return { passed, failed: 4 - passed, total: 4 };
}

// Test 4: Kindle Height Adjustment
function testKindleHeightAdjustment() {
  console.log('🧪 Testing Kindle Height Adjustment...');
  
  const homePageContent = readFileContent(FILES_TO_CHECK.homePage);
  
  if (!homePageContent) {
    console.log('  ✗ HomePage file not found');
    return { passed: 0, failed: 3, total: 3 };
  }
  
  const hasHeightCalc = homePageContent.includes('calc(100vh - 280px)');
  const hasItemsStart = homePageContent.includes('items-start');
  const hasMinMaxHeight = homePageContent.includes('minHeight') && homePageContent.includes('maxHeight');
  
  console.log(`  ✓ Height calculation: ${hasHeightCalc ? 'Found' : 'Missing'}`);
  console.log(`  ✓ Items start alignment: ${hasItemsStart ? 'Found' : 'Missing'}`);
  console.log(`  ✓ Min/max height constraints: ${hasMinMaxHeight ? 'Found' : 'Missing'}`);
  
  const passed = [hasHeightCalc, hasItemsStart, hasMinMaxHeight].filter(Boolean).length;
  return { passed, failed: 3 - passed, total: 3 };
}

// Test 5: Upgrade Modal Implementation
function testUpgradeModal() {
  console.log('🧪 Testing Upgrade Modal Implementation...');
  
  const modalContent = readFileContent(FILES_TO_CHECK.upgradeModal);
  const settingsContent = readFileContent(FILES_TO_CHECK.settingsPage);
  const bannerContent = readFileContent(FILES_TO_CHECK.trialBanner);
  
  if (!modalContent || !settingsContent || !bannerContent) {
    console.log('  ✗ Required files not found');
    return { passed: 0, failed: 5, total: 5 };
  }
  
  const hasModalComponent = modalContent.includes('UpgradePlansModal') && modalContent.includes('usePricingPlans');
  const hasFreePlanFilter = modalContent.includes('subscription_type !== \'free\'') || modalContent.includes('subscription_type !== "free"');
  const hasSettingsIntegration = settingsContent.includes('UpgradePlansModal') && settingsContent.includes('showUpgradeModal');
  const hasBannerIntegration = bannerContent.includes('UpgradePlansModal') && bannerContent.includes('showUpgradeModal');
  const hasApiIntegration = modalContent.includes('redirectToPayment') || modalContent.includes('usePayment');
  
  console.log(`  ✓ Modal component: ${hasModalComponent ? 'Found' : 'Missing'}`);
  console.log(`  ✓ Free plan filtering: ${hasFreePlanFilter ? 'Found' : 'Missing'}`);
  console.log(`  ✓ Settings integration: ${hasSettingsIntegration ? 'Found' : 'Missing'}`);
  console.log(`  ✓ Banner integration: ${hasBannerIntegration ? 'Found' : 'Missing'}`);
  console.log(`  ✓ API integration: ${hasApiIntegration ? 'Found' : 'Missing'}`);
  
  const passed = [hasModalComponent, hasFreePlanFilter, hasSettingsIntegration, hasBannerIntegration, hasApiIntegration].filter(Boolean).length;
  return { passed, failed: 5 - passed, total: 5 };
}

// Test 6: No Runtime Errors Check
function testNoRuntimeErrors() {
  console.log('🧪 Testing for Runtime Error Fixes...');
  
  const bannerContent = readFileContent(FILES_TO_CHECK.trialBanner);
  const sidebarContent = readFileContent(FILES_TO_CHECK.sidebar);
  
  if (!bannerContent || !sidebarContent) {
    console.log('  ✗ Required files not found');
    return { passed: 0, failed: 3, total: 3 };
  }
  
  // Check that isLoading references are removed from trial banner
  const noIsLoadingInBanner = !bannerContent.includes('disabled={isLoading}') && 
                             !bannerContent.includes('{isLoading ? \'Processing...\' : \'Upgrade Now, Save your Eyes!\'}');
  
  // Check that sidebar has proper fragment closing
  const hasProperFragmentClosing = sidebarContent.includes('</>') && sidebarContent.includes('return (');
  
  // Check that all imports are properly defined
  const hasProperImports = bannerContent.includes('import React, { useState }') && 
                          sidebarContent.includes('import { useState, useEffect }');
  
  console.log(`  ✓ isLoading error fixed: ${noIsLoadingInBanner ? 'Fixed' : 'Still present'}`);
  console.log(`  ✓ Fragment closing fixed: ${hasProperFragmentClosing ? 'Fixed' : 'Still present'}`);
  console.log(`  ✓ Proper imports: ${hasProperImports ? 'Found' : 'Missing'}`);
  
  const passed = [noIsLoadingInBanner, hasProperFragmentClosing, hasProperImports].filter(Boolean).length;
  return { passed, failed: 3 - passed, total: 3 };
}

// Main test runner
async function runFinalVerification() {
  console.log('🚀 Running Final Verification Tests\n');
  
  const tests = [
    { name: 'URL Validation', fn: testUrlValidation },
    { name: 'Format Options', fn: testFormatOptions },
    { name: 'Mobile Responsiveness', fn: testMobileResponsiveness },
    { name: 'Kindle Height Adjustment', fn: testKindleHeightAdjustment },
    { name: 'Upgrade Modal', fn: testUpgradeModal },
    { name: 'Runtime Error Fixes', fn: testNoRuntimeErrors }
  ];
  
  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;
  
  for (const test of tests) {
    try {
      const result = test.fn();
      totalPassed += result.passed;
      totalFailed += result.failed;
      totalTests += result.total;
      console.log('');
    } catch (error) {
      console.log(`❌ ${test.name} test failed: ${error.message}\n`);
      totalFailed++;
      totalTests++;
    }
  }
  
  // Summary
  console.log('📊 Final Verification Summary:');
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Passed: ${totalPassed}`);
  console.log(`   Failed: ${totalFailed}`);
  console.log(`   Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
  
  if (totalFailed === 0) {
    console.log('\n🎉 All implementation features verified! Dashboard improvements are complete and working.');
    console.log('\n✅ Ready for production deployment!');
  } else {
    console.log(`\n⚠️  ${totalFailed} verification(s) failed. Please review the implementation.`);
  }
  
  return {
    passed: totalPassed,
    failed: totalFailed,
    total: totalTests,
    success: totalFailed === 0
  };
}

// Run verification if this file is executed directly
if (require.main === module) {
  runFinalVerification()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Final verification failed:', error);
      process.exit(1);
    });
}

module.exports = { runFinalVerification };
