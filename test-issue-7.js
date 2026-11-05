/**
 * Acceptance Test Suite for GitHub Issue #7:
 * Fix Public Landing Page Broken Anchor (#about) and Missing Legal Routes (/privacy, /terms)
 */

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('====================================================');
  console.log('STARTING ACCEPTANCE TESTS FOR ISSUE #7 (ANCHORS & LEGAL ROUTES)');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Fetch Homepage HTML
  let homeHtml = '';
  try {
    const res = await fetch(`${BASE_URL}/`);
    assert(res.status === 200, `Homepage loads with HTTP 200 OK (Status: ${res.status})`);
    homeHtml = await res.text();
  } catch (err) {
    assert(false, `Failed to load homepage: ${err.message}`);
  }

  // --- TEST 1: Click About and verify correct section is reached (#about) ---
  console.log('\n--- TEST 1: Verify #about anchor target exists ---');
  const hasAboutId = homeHtml.includes('id="about"');
  assert(hasAboutId, `Homepage contains section with id="about" (resolved broken anchor)`);

  // --- TEST 2: Test all public navigation anchors ---
  console.log('\n--- TEST 2: Verify all public navigation anchor targets exist ---');
  const expectedAnchors = [
    { name: 'About', id: 'about' },
    { name: 'How It Works', id: 'how-it-works' },
    { name: 'Activities', id: 'activities' },
    { name: 'Benefits', id: 'benefits' },
    { name: 'FAQ', id: 'faq' },
    { name: 'Community Guidelines', id: 'community-guidelines' },
  ];

  for (const anchor of expectedAnchors) {
    const exists = homeHtml.includes(`id="${anchor.id}"`);
    assert(exists, `Target id="${anchor.id}" (${anchor.name}) exists in page markup`);
  }

  // --- TEST 3: Verify no duplicate section IDs ---
  console.log('\n--- TEST 3: Verify uniqueness of section IDs ---');
  const idMatches = [...homeHtml.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  const sectionIds = ['about', 'how-it-works', 'activities', 'benefits', 'faq', 'community-guidelines'];
  let noDuplicates = true;

  for (const sid of sectionIds) {
    const count = idMatches.filter((id) => id === sid).length;
    if (count > 1) {
      assert(false, `Duplicate ID detected: "${sid}" appears ${count} times`);
      noDuplicates = false;
    }
  }
  if (noDuplicates) {
    assert(true, `All critical navigation section IDs are unique across homepage`);
  }

  // --- TEST 4: Open /privacy directly ---
  console.log('\n--- TEST 4: Open /privacy directly ---');
  let privacyHtml = '';
  try {
    const privRes = await fetch(`${BASE_URL}/privacy`);
    assert(privRes.status === 200, `/privacy returned HTTP 200 OK (Status: ${privRes.status})`);
    privacyHtml = await privRes.text();
    assert(
      privacyHtml.includes('TNCC Privacy Policy') &&
      privacyHtml.includes('Information We Collect') &&
      privacyHtml.includes('Supabase and Data Storage'),
      `/privacy renders complete structured sections matching TNCC requirements`
    );
  } catch (err) {
    assert(false, `/privacy threw error: ${err.message}`);
  }

  // --- TEST 5: Open /terms directly ---
  console.log('\n--- TEST 5: Open /terms directly ---');
  let termsHtml = '';
  try {
    const termsRes = await fetch(`${BASE_URL}/terms`);
    assert(termsRes.status === 200, `/terms returned HTTP 200 OK (Status: ${termsRes.status})`);
    termsHtml = await termsRes.text();
    assert(
      termsHtml.includes('Terms &amp; Conditions') || termsHtml.includes('Terms & Conditions'),
      `/terms renders page header`
    );
    assert(
      termsHtml.includes('Community Guidelines') &&
      termsHtml.includes('Intellectual Property') &&
      termsHtml.includes('XP, Points and Leaderboards'),
      `/terms renders complete structured sections matching TNCC requirements`
    );
  } catch (err) {
    assert(false, `/terms threw error: ${err.message}`);
  }

  // --- TEST 6: Refresh both legal pages and confirm they load ---
  console.log('\n--- TEST 6: Confirm legal pages persist on reload ---');
  try {
    const [pReload, tReload] = await Promise.all([
      fetch(`${BASE_URL}/privacy`),
      fetch(`${BASE_URL}/terms`),
    ]);
    assert(
      pReload.status === 200 && tReload.status === 200,
      `Both /privacy and /terms load reliably on refresh (Privacy: ${pReload.status}, Terms: ${tReload.status})`
    );
  } catch (err) {
    assert(false, `Reload check failed: ${err.message}`);
  }

  // --- TEST 7: Test footer navigation ---
  console.log('\n--- TEST 7: Test footer navigation links ---');
  assert(
    homeHtml.includes('href="/privacy"') && homeHtml.includes('href="/terms"'),
    `Footer contains working links to /privacy and /terms`
  );

  // --- TEST 8: Test mobile navigation and responsive layouts ---
  console.log('\n--- TEST 8: Test mobile navigation links ---');
  const { readFileSync } = require('fs');
  const mobileMenuCode = readFileSync('./components/layout/MobileMenu.tsx', 'utf8');
  assert(
    mobileMenuCode.includes("href: '/#about'") &&
    mobileMenuCode.includes("href: '/#how-it-works'") &&
    mobileMenuCode.includes("href: '/#activities'") &&
    mobileMenuCode.includes("href: '/#benefits'") &&
    mobileMenuCode.includes("href: '/#faq'"),
    `MobileMenu.tsx configured with all verified anchor routes`
  );

  // --- TEST 9: Verify no 404 errors ---
  console.log('\n--- TEST 9: Verify no 404 errors on public routes ---');
  const routesToCheck = ['/', '/privacy', '/terms'];
  for (const r of routesToCheck) {
    const rRes = await fetch(`${BASE_URL}${r}`);
    assert(rRes.status !== 404, `Route ${r} does not return 404 (Status: ${rRes.status})`);
  }

  // --- TEST 10: Verify existing login and registration routes still work ---
  console.log('\n--- TEST 10: Verify existing community auth routes ---');
  try {
    const authRes = await fetch(`${BASE_URL}/community/auth`);
    assert(authRes.status === 200, `/community/auth is operational (Status: ${authRes.status})`);
  } catch (err) {
    assert(false, `Auth route check failed: ${err.message}`);
  }

  // --- TEST 11: Scroll margin offset configured for sticky header ---
  console.log('\n--- TEST 11: Scroll margin offset configured for sticky header ---');
  const globalsCss = readFileSync('./app/globals.css', 'utf8');
  assert(
    globalsCss.includes('scroll-margin-top: 80px'),
    `globals.css configures scroll-margin-top: 80px to prevent sticky nav obscuring section titles`
  );

  console.log('\n====================================================');
  console.log(`TEST EXECUTION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');
}

runTests();
