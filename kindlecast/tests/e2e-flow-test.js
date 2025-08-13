#!/usr/bin/env node

const puppeteer = require('puppeteer');

const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 30000,
  testUser: {
    kindleEmail: 'testuser',
    acknowledgment: 'YES'
  }
};

async function runE2ETest() {
  console.log('\n==================================================');
  console.log('🧪 END-TO-END FLOW TEST');
  console.log('==================================================');
  console.log(`Testing base URL: ${TEST_CONFIG.baseUrl}`);
  
  let browser;
  let page;
  
  try {
    // Launch browser
    browser = await puppeteer.launch({ 
      headless: false, // Set to true for CI
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        console.log(`🔴 Console Error: ${text}`);
      } else if (text.includes('🔍')) {
        console.log(`🔍 Debug Log: ${text}`);
      }
    });
    
    // Enable request logging
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        console.log(`📡 API Request: ${request.method()} ${request.url()}`);
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        console.log(`📡 API Response: ${response.status()} ${response.url()}`);
      }
    });
    
    console.log('\n🔍 Step 1: Navigate to Dashboard');
    await page.goto(`${TEST_CONFIG.baseUrl}/dashboard`, { 
      waitUntil: 'networkidle0',
      timeout: TEST_CONFIG.timeout 
    });
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    console.log('\n🔍 Step 2: Check if onboarding boxes are visible');
    
    // Check if InfoUpdateBox is visible
    const infoUpdateBox = await page.$('[data-testid="info-update-box"]');
    const deviceSetup = await page.$('[data-testid="device-setup"]');
    const conversionScreen = await page.$('[data-testid="conversion-screen"]');
    
    console.log(`InfoUpdateBox visible: ${!!infoUpdateBox}`);
    console.log(`DeviceSetup visible: ${!!deviceSetup}`);
    console.log(`ConversionScreen visible: ${!!conversionScreen}`);
    
    if (infoUpdateBox) {
      console.log('\n🔍 Step 3: Testing InfoUpdateBox Flow');
      
      // Fill in Kindle email
      const kindleEmailInput = await page.$('input[placeholder*="kindle"]');
      if (kindleEmailInput) {
        await kindleEmailInput.clear();
        await kindleEmailInput.type(TEST_CONFIG.testUser.kindleEmail);
        console.log(`✅ Entered Kindle email: ${TEST_CONFIG.testUser.kindleEmail}`);
      }
      
      // Fill in acknowledgment
      const ackInput = await page.$('input[placeholder*="YES"]');
      if (ackInput) {
        await ackInput.clear();
        await ackInput.type(TEST_CONFIG.testUser.acknowledgment);
        console.log(`✅ Entered acknowledgment: ${TEST_CONFIG.testUser.acknowledgment}`);
      }
      
      // Click submit button
      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) {
        console.log('\n🔍 Step 4: Clicking Submit Button');
        await submitButton.click();
        
        // Wait for API call and response
        await page.waitForTimeout(3000);
        
        // Check if onboarding disappeared
        const infoUpdateBoxAfter = await page.$('[data-testid="info-update-box"]');
        const conversionScreenAfter = await page.$('[data-testid="conversion-screen"]');
        
        console.log(`InfoUpdateBox after submit: ${!!infoUpdateBoxAfter}`);
        console.log(`ConversionScreen after submit: ${!!conversionScreenAfter}`);
        
        if (!infoUpdateBoxAfter && conversionScreenAfter) {
          console.log('✅ SUCCESS: Onboarding completed, conversion screen shown');
        } else if (infoUpdateBoxAfter) {
          console.log('❌ FAIL: Onboarding still visible after submit');
        } else {
          console.log('⚠️  UNKNOWN: Neither onboarding nor conversion screen visible');
        }
      }
    } else if (conversionScreen) {
      console.log('✅ SUCCESS: Conversion screen already visible (user already set up)');
    } else {
      console.log('❌ FAIL: No recognizable screen visible');
    }
    
    console.log('\n🔍 Step 5: Final State Check');
    await page.waitForTimeout(2000);
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'kindlecast/tests/dashboard-final-state.png', fullPage: true });
    console.log('📸 Screenshot saved: tests/dashboard-final-state.png');
    
  } catch (error) {
    console.error('❌ E2E Test Failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
runE2ETest().catch(console.error);
