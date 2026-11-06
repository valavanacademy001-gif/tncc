const { chromium } = require('playwright');
const path = require('path');

async function verify() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // iPhone standard mobile
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  console.log('Testing /community/auth admin notification minimization...');
  await page.goto('http://localhost:3000/community/auth?mode=login', { waitUntil: 'networkidle' });
  
  // Type admin email
  const emailInput = page.locator('input[type="text"]');
  await emailInput.fill('suganeshsugu07@gmail.com');
  await page.waitForTimeout(500);

  // Check admin banner
  const adminBanner = page.locator('text=Authorized Admin Account');
  const isBannerVisible = await adminBanner.isVisible();
  console.log('Admin banner visible:', isBannerVisible);

  await page.screenshot({
    path: path.join(__dirname, '../public/audit-evidence/admin_banner_minimal.png'),
    fullPage: false,
  });

  console.log('\nTesting /community feed tabs single-line layout on mobile...');
  await page.goto('http://localhost:3000/community', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Locate the filter tab buttons
  const allBtn = page.locator('button:has-text("All")').first();
  const showcaseBtn = page.locator('button:has-text("Showcase")').first();
  const discussionBtn = page.locator('button:has-text("Discussion")').first();
  const selectBox = page.locator('select:has-text("All Categories")').first();

  const allBox = await allBtn.boundingBox();
  const showcaseBox = await showcaseBtn.boundingBox();
  const discussionBox = await discussionBtn.boundingBox();
  const selectBBox = await selectBox.boundingBox();

  console.log('Tab All Box:', allBox);
  console.log('Tab Showcase Box:', showcaseBox);
  console.log('Tab Discussion Box:', discussionBox);
  console.log('Category Select Box:', selectBBox);

  const sameRow = Math.abs(allBox.y - showcaseBox.y) < 5 && Math.abs(allBox.y - selectBBox.y) < 5;
  console.log('Are All, Showcase, and Category Select on the SAME line?:', sameRow);

  await page.screenshot({
    path: path.join(__dirname, '../public/audit-evidence/feed_filters_single_row_mobile.png'),
    fullPage: false,
  });

  // Also test 360px viewport
  await page.setViewportSize({ width: 360, height: 800 });
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(__dirname, '../public/audit-evidence/feed_filters_360px.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('Verification finished successfully!');
}

verify().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
