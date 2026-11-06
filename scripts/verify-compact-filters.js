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

  console.log('Testing /community feed on mobile (375x812)...');
  await page.goto('http://localhost:3000/community', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. Verify "All Categories" is removed
  const allCategoriesCount = await page.locator('text="All Categories"').count();
  console.log('Count of "All Categories" on page:', allCategoriesCount);
  if (allCategoriesCount > 0) {
    console.error('FAIL: "All Categories" should be completely removed!');
  } else {
    console.log('PASS: "All Categories" successfully removed!');
  }

  // 2. Locate the 4 filter tab buttons specifically inside the feed filters
  const filterTabs = page.locator('div.flex.items-center.overflow-x-auto button');
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

  const sameRow = 
    Math.abs(allBox.y - showcaseBox.y) < 5 &&
    Math.abs(allBox.y - discussionBox.y) < 5 &&
    Math.abs(allBox.y - savedBox.y) < 5;
  console.log('Are All 4 tabs on the EXACT SAME line?:', sameRow);

  // 3. Test Composer Category Selector Pill
  const composerCategoryBtn = page.locator('button[aria-label="Select post category"]');
  const isComposerCategoryVisible = await composerCategoryBtn.isVisible();
  console.log('Composer Category Selector visible:', isComposerCategoryVisible);

  // Click the category selector to open the popover
  await composerCategoryBtn.click();
  await page.waitForTimeout(300);

  const popoverVisible = await page.locator('text="Post Category"').isVisible();
  console.log('Category dropdown popover opened:', popoverVisible);

  // Take screenshot with popover open
  await page.screenshot({
    path: path.join(__dirname, '../public/audit-evidence/composer_category_popover.png'),
    fullPage: false,
  });

  // Select Discussion from popover
  const discussionOption = page.locator('button:has-text("Discussion")').last();
  await discussionOption.click();
  await page.waitForTimeout(300);

  const updatedText = await composerCategoryBtn.innerText();
  console.log('Composer button text after selection:', updatedText);

  // Take screenshot after selection and showing the clean 4 tabs below
  await page.screenshot({
    path: path.join(__dirname, '../public/audit-evidence/feed_filters_and_composer_final.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('Verification finished successfully!');
}

verify().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
