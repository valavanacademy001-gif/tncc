const { chromium } = require('playwright');
const path = require('path');

async function verifyElements() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  // Switch to dark mode
  await page.evaluate(() => {
    localStorage.setItem('tncc_theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. Inspect "Curated Vault" badge color
  const vaultBadge = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('span')).find(s => s.textContent.trim() === 'Curated Vault');
    if (!el) return null;
    const comp = window.getComputedStyle(el);
    return { text: el.textContent.trim(), color: comp.color };
  });
  console.log('Curated Vault Badge Color in Dark Mode:', vaultBadge);

  // 2. Inspect Stage 02 "CREATE YOUR WORK" title color
  const createTitle = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('div')).find(s => s.textContent.trim() === 'CREATE YOUR WORK');
    if (!el) return null;
    const comp = window.getComputedStyle(el);
    return { text: el.textContent.trim(), color: comp.color };
  });
  console.log('CREATE YOUR WORK Title Color in Dark Mode:', createTitle);

  // 3. Inspect SVG "CREATE" node color
  const createNode = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('text')).find(s => s.textContent.trim() === 'CREATE');
    if (!el) return null;
    const comp = window.getComputedStyle(el);
    return { text: el.textContent.trim(), fill: comp.fill, color: comp.color };
  });
  console.log('SVG CREATE Node in Dark Mode:', createNode);

  // 4. Inspect "Vault & Portfolio" tag in Stacking Cards
  const vaultTag = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('.stacking-card-tag')).find(s => s.textContent.includes('Vault & Portfolio'));
    if (!el) return null;
    const comp = window.getComputedStyle(el);
    return { text: el.textContent.trim(), color: comp.color, bg: comp.backgroundColor };
  });
  console.log('Vault & Portfolio Tag in Dark Mode:', vaultTag);

  await browser.close();
}

verifyElements().catch(console.error);
