const { chromium } = require('playwright');
const path = require('path');

async function verify() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  // Test at 360px mobile width (typical Android phone)
  const context = await browser.newContext({
    viewport: { width: 360, height: 800 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  console.log('Testing /community feed at 360px mobile width...');
  await page.goto('http://localhost:3000/community', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const filterTabs = page.locator('div.flex.items-center.overflow-x-auto button');
  const count = await filterTabs.count();
  console.log('Filter tab count:', count);

  const allBtn = filterTabs.nth(0);
  const showcaseBtn = filterTabs.nth(1);
  const discussionBtn = filterTabs.nth(2);
  const savedBtn = filterTabs.nth(3);

  const allBox = await allBtn.boundingBox();
  const showcaseBox = await showcaseBtn.boundingBox();
  const discussionBox = await discussionBtn.boundingBox();
  const savedBox = await savedBtn.boundingBox();

  console.log('Tab All Box:', allBox);
  console.log('Tab Showcase Box:', showcaseBox);
  console.log('Tab Discussion Box:', discussionBox);
  console.log('Tab Saved Box:', savedBox);

  const savedRightEdge = savedBox.x + savedBox.width;
  console.log('Saved button right edge (must be <= 360px):', savedRightEdge);

  const isSavedFullyVisible = savedRightEdge <= 360;
  console.log('Is Saved button completely within screen (no cut off)?:', isSavedFullyVisible);

  await page.screenshot({
    path: path.join(__dirname, '../public/audit-evidence/feed_tabs_360px_no_cutoff.png'),
    fullPage: false,
  });

  // Also test 320px (smallest phone)
  await page.setViewportSize({ width: 320, height: 640 });
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(__dirname, '../public/audit-evidence/feed_tabs_320px.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('Verification finished successfully!');
}

verify().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
