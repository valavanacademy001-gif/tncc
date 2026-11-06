const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, '../docs/ui/screenshots/theme');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Helper to calculate relative luminance / brightness (0-255)
function parseRgb(colorStr) {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  return { r, g, b, brightness: (r * 299 + g * 587 + b * 114) / 1000 };
}

async function runAudit() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const results = {
    toggleAudit: [],
    sectionAuditDark: [],
    sectionAuditLight: [],
    viewportAudit: [],
  };

  const devices = [
    { name: 'Desktop Full HD', width: 1920, height: 1080 },
    { name: 'Tablet Portrait', width: 768, height: 1024 },
    { name: 'iPhone 14 Mobile', width: 390, height: 844 },
  ];

  for (const device of devices) {
    const page = await browser.newPage({
      viewport: { width: device.width, height: device.height },
    });

    console.log(`\n======================================================`);
    console.log(`Auditing Device: ${device.name} (${device.width}x${device.height})`);
    console.log(`======================================================`);

    // 1. Load Landing Page in Light Mode (default)
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    // Reset theme to light mode in localStorage
    await page.evaluate(() => {
      localStorage.setItem('tncc-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Verify Theme Toggle count
    const toggles = await page.$$('button[aria-label*="Switch to"]');
    let visibleToggles = 0;
    for (const toggle of toggles) {
      if (await toggle.isVisible()) visibleToggles++;
    }
    console.log(`[Light Mode] Visible theme toggles: ${visibleToggles} (Expected: 1)`);
    results.toggleAudit.push({
      device: device.name,
      mode: 'light',
      visibleCount: visibleToggles,
      pass: visibleToggles === 1,
    });

    // Check light mode icon
    const activeToggle = toggles.find(async t => await t.isVisible());
    const labelLight = await page.$eval('button[aria-label*="Switch to"]:visible', el => el.getAttribute('aria-label'));
    console.log(`[Light Mode] Toggle aria-label: "${labelLight}"`);

    // Capture Light Mode Screenshot
    const lightScreenshotPath = path.join(screenshotDir, `landing_${device.name.toLowerCase().replace(/\s+/g, '_')}_light.png`);
    await page.screenshot({ path: lightScreenshotPath, fullPage: true });
    console.log(`Saved screenshot: ${lightScreenshotPath}`);

    // Switch to Dark Mode by clicking the toggle
    const toggleButton = await page.$('button[aria-label*="Switch to"]:visible');
    if (toggleButton) {
      await toggleButton.click();
      await page.waitForTimeout(600);
    }

    const isDarkNow = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    console.log(`[Dark Mode] HTML has .dark class: ${isDarkNow}`);

    // Verify Theme Toggle count in Dark Mode
    let visibleTogglesDark = 0;
    for (const toggle of toggles) {
      if (await toggle.isVisible()) visibleTogglesDark++;
    }
    const labelDark = await page.$eval('button[aria-label*="Switch to"]:visible', el => el.getAttribute('aria-label'));
    console.log(`[Dark Mode] Visible theme toggles: ${visibleTogglesDark} (Expected: 1), aria-label: "${labelDark}"`);
    results.toggleAudit.push({
      device: device.name,
      mode: 'dark',
      visibleCount: visibleTogglesDark,
      pass: visibleTogglesDark === 1,
    });

    // Capture Dark Mode Screenshot
    const darkScreenshotPath = path.join(screenshotDir, `landing_${device.name.toLowerCase().replace(/\s+/g, '_')}_dark.png`);
    await page.screenshot({ path: darkScreenshotPath, fullPage: true });
    console.log(`Saved screenshot: ${darkScreenshotPath}`);

    // Audit Section Backgrounds in Dark Mode
    const sectionIds = [
      '#hero-section',
      '#activities',
      '#featured-opportunities',
      '#how-it-works',
      '#stacking-overview',
      '#about',
      '#benefits',
      '#faq',
    ];

    console.log(`\n--- Dark Mode Section Background Audit (${device.name}) ---`);
    for (const secId of sectionIds) {
      const secData = await page.evaluate((id) => {
        const el = document.querySelector(id);
        if (!el) return null;
        const comp = window.getComputedStyle(el);
        return {
          id,
          bg: comp.backgroundColor,
          color: comp.color,
        };
      }, secId);

      if (secData) {
        const parsed = parseRgb(secData.bg);
        const isDark = parsed ? parsed.brightness < 50 : false;
        console.log(`  Section ${secData.id.padEnd(25)}: bg = ${secData.bg.padEnd(22)} (brightness: ${parsed ? parsed.brightness.toFixed(1) : 'N/A'}/255) => ${isDark ? 'PASS (Dark Surface)' : 'FAIL (Bright Surface!)'}`);
        results.sectionAuditDark.push({
          device: device.name,
          section: secData.id,
          bg: secData.bg,
          brightness: parsed ? parsed.brightness : null,
          pass: isDark,
        });
      }
    }

    // Check for Horizontal Overflow
    const overflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    console.log(`[Overflow Check] scrollWidth: ${overflow.scrollWidth}, clientWidth: ${overflow.clientWidth} => ${overflow.hasOverflow ? 'FAIL (Horizontal Overflow)' : 'PASS (0 Overflow)'}`);
    results.viewportAudit.push({
      device: device.name,
      overflow,
      pass: !overflow.hasOverflow,
    });

    await page.close();
  }

  await browser.close();

  // Summary
  console.log(`\n======================================================`);
  console.log(`AUDIT SUMMARY RESULTS`);
  console.log(`======================================================`);
  const allTogglesPass = results.toggleAudit.every(t => t.pass);
  const allDarkSecPass = results.sectionAuditDark.every(s => s.pass);
  const allOverflowPass = results.viewportAudit.every(v => v.pass);

  console.log(`Single Theme Toggle Test : ${allTogglesPass ? '✅ ALL PASS' : '❌ FAILED'}`);
  console.log(`Dark Section Surfaces    : ${allDarkSecPass ? '✅ ALL PASS (0 bright sections)' : '❌ FAILED'}`);
  console.log(`0 Horizontal Overflow    : ${allOverflowPass ? '✅ ALL PASS' : '❌ FAILED'}`);

  return { allTogglesPass, allDarkSecPass, allOverflowPass };
}

runAudit().catch(err => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
