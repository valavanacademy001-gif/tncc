const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SCREENSHOT_DIR = path.join(__dirname, '../docs/ui/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Exact viewports specified in Phase 2
const VIEWPORTS = [
  // Mobile
  { id: 'mobile_320', name: 'Small Android', width: 320, height: 640, category: 'Mobile' },
  { id: 'mobile_360_740', name: 'Android 360x740', width: 360, height: 740, category: 'Mobile' },
  { id: 'mobile_360_800', name: 'Android 360x800', width: 360, height: 800, category: 'Mobile' },
  { id: 'mobile_375', name: 'Android/iPhone 375', width: 375, height: 812, category: 'Mobile' },
  { id: 'mobile_390', name: 'iPhone 390', width: 390, height: 844, category: 'Mobile' },
  { id: 'mobile_414', name: 'Large Mobile 414', width: 414, height: 896, category: 'Mobile' },
  { id: 'mobile_430', name: 'Large Mobile 430', width: 430, height: 932, category: 'Mobile' },

  // Tablet
  { id: 'tablet_600', name: 'Small Tablet', width: 600, height: 960, category: 'Tablet' },
  { id: 'tablet_768', name: 'Tablet Portrait', width: 768, height: 1024, category: 'Tablet' },
  { id: 'tablet_1024', name: 'Tablet Landscape', width: 1024, height: 768, category: 'Tablet' },
  { id: 'tablet_834', name: 'Large Tablet', width: 834, height: 1194, category: 'Tablet' },

  // Laptop
  { id: 'laptop_1280', name: 'Small Laptop', width: 1280, height: 720, category: 'Laptop' },
  { id: 'laptop_1366', name: 'Standard Laptop', width: 1366, height: 768, category: 'Laptop' },
  { id: 'laptop_1440', name: 'MacBook/Laptop 1440', width: 1440, height: 900, category: 'Laptop' },

  // Desktop
  { id: 'desktop_1600', name: 'Desktop 1600', width: 1600, height: 900, category: 'Desktop' },
  { id: 'desktop_1920', name: 'Full HD 1080p', width: 1920, height: 1080, category: 'Desktop' },
  { id: 'desktop_2560', name: 'Large Desktop 1440p', width: 2560, height: 1440, category: 'Desktop' },
];

// Complete pages across Public Website, Community Dashboard, and Admin Dashboard
const PAGES = [
  // Public Website
  { id: 'public_home', path: '/', name: 'Public Homepage' },
  { id: 'public_auth_login', path: '/community/auth?mode=login', name: 'Sign In Page' },
  { id: 'public_auth_join', path: '/community/auth?mode=register', name: 'Join Free Page' },
  { id: 'public_privacy', path: '/privacy', name: 'Privacy Policy' },
  { id: 'public_terms', path: '/terms', name: 'Terms of Service' },

  // Community Dashboard
  { id: 'community_feed', path: '/community', name: 'Community Feed' },
  { id: 'community_resources', path: '/community/resources', name: 'Resource Vault' },
  { id: 'community_challenges', path: '/community/challenges', name: 'Challenges & Bounties' },
  { id: 'community_portfolio', path: '/community/portfolio', name: 'Community Portfolio' },
  { id: 'community_profile', path: '/community/profile', name: 'Creator Profile' },
  { id: 'community_leaderboard', path: '/community/leaderboard', name: 'XP Leaderboard' },
  { id: 'community_events', path: '/community/events', name: 'Offline & Virtual Events' },
  { id: 'community_jobs', path: '/community/jobs', name: 'Creative Studio Jobs' },
  { id: 'community_freelancing', path: '/community/freelancing', name: 'Freelancing Hub' },

  // Admin Dashboard
  { id: 'admin_dashboard', path: '/community/admin', name: 'Admin Dashboard Overview' },
];

async function runAudit() {
  console.log('🚀 Starting TNCC Complete Responsive Device Inspection & Visual QA...');
  console.log(`Auditing ${PAGES.length} pages across ${VIEWPORTS.length} viewports in Light & Dark modes.`);

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const allFindings = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n========================================`);
    console.log(`🔍 Testing Viewport: ${vp.name} (${vp.width}x${vp.height} - ${vp.category})`);
    console.log(`========================================`);

    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });

      // Inject Admin and user credentials + theme
      await context.addCookies([
        { name: 'tncc_active_user_email', value: 'suganeshsugu07@gmail.com', domain: 'localhost', path: '/' },
        { name: 'tncc_admin_session', value: 'true', domain: 'localhost', path: '/' },
        { name: 'tncc_theme', value: theme, domain: 'localhost', path: '/' },
      ]);

      const page = await context.newPage();

      // Set localStorage
      await page.addInitScript(({ th }) => {
        localStorage.setItem('tncc_theme', th);
        localStorage.setItem('tncc_active_user_email', 'suganeshsugu07@gmail.com');
        localStorage.setItem('tncc_admin_session', 'true');
        if (th === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, { th: theme });

      for (const p of PAGES) {
        const fullUrl = `${BASE_URL}${p.path}`;
        try {
          await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
          // Ensure theme applied
          await page.evaluate((th) => {
            if (th === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
          }, theme);
          await page.waitForTimeout(600);

          // Automated Diagnostics
          const diagnostics = await page.evaluate(() => {
            const docWidth = document.documentElement.scrollWidth;
            const winWidth = window.innerWidth;
            const hasHorizontalScroll = docWidth > winWidth + 1;

            // Elements overflowing viewport width
            const overflowingElements = [];
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > winWidth + 2 && !['HTML', 'BODY'].includes(el.tagName)) {
                const tag = el.tagName.toLowerCase();
                const cls = (el.className && typeof el.className === 'string') ? el.className.slice(0, 50) : '';
                const id = el.id ? `#${el.id}` : '';
                overflowingElements.push({
                  selector: `${tag}${id}.${cls.split(' ')[0]}`,
                  right: Math.round(rect.right),
                  width: Math.round(rect.width),
                  text: (el.innerText || '').slice(0, 30)
                });
                if (overflowingElements.length >= 5) break;
              }
            }

            // Check for clipped buttons or text
            const clippedButtons = [];
            const buttons = document.querySelectorAll('button, a.btn');
            for (const btn of buttons) {
              const rect = btn.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                if (btn.scrollWidth > btn.clientWidth + 2) {
                  clippedButtons.push({
                    text: (btn.innerText || '').trim().slice(0, 30),
                    scrollWidth: btn.scrollWidth,
                    clientWidth: btn.clientWidth
                  });
                }
              }
            }

            // Check for broken images
            let brokenImagesCount = 0;
            const imgs = document.querySelectorAll('img');
            for (const img of imgs) {
              if (img.naturalWidth === 0 && img.complete) {
                brokenImagesCount++;
              }
            }

            return {
              docWidth,
              winWidth,
              hasHorizontalScroll,
              overflowingCount: overflowingElements.length,
              overflowingElements,
              clippedButtons,
              brokenImagesCount
            };
          });

          // Screenshot capture for key checkpoints
          const shouldScreenshot =
            vp.width === 320 ||
            vp.width === 375 ||
            vp.width === 390 ||
            vp.width === 768 ||
            vp.width === 1024 ||
            vp.width === 1440 ||
            vp.width === 1920;

          const shotFileName = `${p.id}_${vp.id}_${theme}.png`;
          const shotPath = path.join(SCREENSHOT_DIR, shotFileName);

          if (shouldScreenshot) {
            await page.screenshot({ path: shotPath, fullPage: false });
          }

          const record = {
            page: p.name,
            path: p.path,
            viewport: vp.name,
            category: vp.category,
            width: vp.width,
            height: vp.height,
            theme,
            hasHorizontalScroll: diagnostics.hasHorizontalScroll,
            scrollWidth: diagnostics.docWidth,
            windowWidth: diagnostics.winWidth,
            overflowDelta: diagnostics.docWidth - diagnostics.winWidth,
            overflowingElements: diagnostics.overflowingElements,
            clippedButtons: diagnostics.clippedButtons,
            brokenImagesCount: diagnostics.brokenImagesCount,
            screenshot: shouldScreenshot ? shotFileName : null
          };

          allFindings.push(record);

          const status = (!diagnostics.hasHorizontalScroll && diagnostics.clippedButtons.length === 0)
            ? '✅ PASS'
            : '⚠️ ISSUE';
          console.log(`  [${theme.toUpperCase()}] ${p.name.padEnd(28)}: ${status} (W: ${diagnostics.docWidth}/${diagnostics.winWidth})`);

        } catch (err) {
          console.error(`  ❌ Failed on ${p.name}:`, err.message);
          allFindings.push({
            page: p.name,
            path: p.path,
            viewport: vp.name,
            category: vp.category,
            width: vp.width,
            height: vp.height,
            theme,
            error: err.message
          });
        }
      }

      await context.close();
    }
  }

  await browser.close();

  // Save raw data
  const resultPath = path.join(__dirname, '../docs/ui/audit-data.json');
  fs.writeFileSync(resultPath, JSON.stringify(allFindings, null, 2));
  console.log(`\n🎉 Audit completed! Raw audit data written to ${resultPath}`);
}

runAudit().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
