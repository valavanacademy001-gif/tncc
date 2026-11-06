const { chromium } = require('playwright');

const viewports = [
  // Mobile
  { name: 'Small Android', width: 320, height: 640 },
  { name: 'Android 360x740', width: 360, height: 740 },
  { name: 'Android 360x800', width: 360, height: 800 },
  { name: 'Android 375x812', width: 375, height: 812 },
  { name: 'iPhone 14 / Pro', width: 390, height: 844 },
  { name: 'Large Mobile 414', width: 414, height: 896 },
  { name: 'Large Mobile 430', width: 430, height: 932 },
  // Tablet
  { name: 'Small Tablet 600', width: 600, height: 960 },
  { name: 'Tablet Portrait 768', width: 768, height: 1024 },
  { name: 'Tablet Landscape 1024', width: 1024, height: 768 },
  { name: 'Large Tablet 834', width: 834, height: 1194 },
  // Laptop
  { name: 'Small Laptop 1280', width: 1280, height: 720 },
  { name: 'Laptop 1366', width: 1366, height: 768 },
  { name: 'Laptop 1440', width: 1440, height: 900 },
  // Desktop
  { name: 'Desktop 1600', width: 1600, height: 900 },
  { name: 'Full HD 1920', width: 1920, height: 1080 },
  { name: 'Large Desktop 2560', width: 2560, height: 1440 },
];

async function testAllViewports() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  console.log(`Auditing all 17 viewports in both Light and Dark modes...`);
  let allPass = true;

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    // Test in Light
    const overflowLight = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    const passLight = overflowLight.scrollWidth <= overflowLight.clientWidth;

    // Switch to dark
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    await page.waitForTimeout(100);

    const overflowDark = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    const passDark = overflowDark.scrollWidth <= overflowDark.clientWidth;

    // Verify toggle count
    const toggles = await page.$$('button[aria-label*="Switch to"]');
    let visibleToggles = 0;
    for (const t of toggles) {
      if (await t.isVisible()) visibleToggles++;
    }
    const togglePass = visibleToggles === 1;

    const vpPass = passLight && passDark && togglePass;
    if (!vpPass) allPass = false;

    console.log(
      `[${vp.name.padEnd(20)}] ${vp.width}x${vp.height} | Overflow L: ${passLight ? 'OK' : 'FAIL'} | Overflow D: ${passDark ? 'OK' : 'FAIL'} | Toggle: ${togglePass ? 'OK (1)' : 'FAIL (' + visibleToggles + ')'} => ${vpPass ? 'PASS' : 'FAIL'}`
    );

    await page.close();
  }

  await browser.close();
  console.log(`\nAll 17 Viewports Result: ${allPass ? '✅ 100% PASSED' : '❌ SOME FAILED'}`);
  if (!allPass) process.exit(1);
}

testAllViewports().catch(e => {
  console.error(e);
  process.exit(1);
});
