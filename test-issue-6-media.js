/**
 * Automated Verification Test Suite for GitHub Issue #6:
 * Direct Media Upload, File Size Validation, Google Drive Auto Preview, and Video Player
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

// Google Drive logic to test parity with lib/media/google-drive.ts
const GOOGLE_DRIVE_PATTERNS = [
  /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i,
  /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i,
  /drive\.google\.com\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]+)/i,
  /docs\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i,
  /drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/i,
];

function parseGoogleDriveUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isGoogleDrive: false, fileId: null, embedUrl: null, thumbnailUrl: null };
  }
  const trimmed = rawUrl.trim();
  for (const pattern of GOOGLE_DRIVE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      const fileId = match[1];
      return {
        isGoogleDrive: true,
        fileId,
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`,
        originalUrl: trimmed,
      };
    }
  }
  return { isGoogleDrive: false, fileId: null, embedUrl: null, thumbnailUrl: null };
}

function resolvePreviewImageUrl(url) {
  if (!url) return '';
  const gdrive = parseGoogleDriveUrl(url);
  if (gdrive.isGoogleDrive && gdrive.thumbnailUrl) {
    return gdrive.thumbnailUrl;
  }
  return url;
}

function resolveVideoSource(url) {
  if (!url) return { isEmbed: false, sourceUrl: '' };
  const gdrive = parseGoogleDriveUrl(url);
  if (gdrive.isGoogleDrive && gdrive.embedUrl) {
    return { isEmbed: true, sourceUrl: gdrive.embedUrl };
  }
  return { isEmbed: false, sourceUrl: url };
}

async function runTests() {
  console.log('====================================================');
  console.log('TEST RUNNER: GitHub Issue #6 Media System');
  console.log(`Target: ${BASE_URL}`);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} - Detail: ${detail}`);
      failed++;
    }
  }

  // Helper to create dummy files in memory
  function createDummyFile(sizeBytes, mimeType, filename) {
    const buffer = Buffer.alloc(sizeBytes, 'a');
    const blob = new Blob([buffer], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
  }

  // --- SECTION 1: Backend API Upload & Validation Tests ---
  console.log('--- TEST 1: Direct Image Upload Below 1 MB (500 KB PNG) ---');
  try {
    const validImg = createDummyFile(500 * 1024, 'image/png', 'artwork-500kb.png');
    const fd = new FormData();
    fd.append('file', validImg);
    fd.append('member_id', 'test-creator-001');

    const res = await fetch(`${BASE_URL}/api/community/upload`, {
      method: 'POST',
      body: fd,
    });
    const json = await res.json();
    assert(res.status === 200 && json.success === true && Boolean(json.url), 'Image below 1 MB accepted', `Status: ${res.status}, url: ${json.url}`);
    assert(json.media_type === 'image', 'Media type classified as image', `type: ${json.media_type}`);
  } catch (e) {
    assert(false, 'Image below 1 MB accepted', e.message);
  }

  console.log('\n--- TEST 2: Reject Image Above 1 MB (1.5 MB PNG) ---');
  try {
    const oversizedImg = createDummyFile(1.5 * 1024 * 1024, 'image/png', 'large-artwork-1.5mb.png');
    const fd = new FormData();
    fd.append('file', oversizedImg);
    fd.append('member_id', 'test-creator-001');

    const res = await fetch(`${BASE_URL}/api/community/upload`, {
      method: 'POST',
      body: fd,
    });
    const json = await res.json();
    assert(res.status === 400 && json.success === false, 'Image above 1 MB rejected with HTTP 400', `Status: ${res.status}`);
    assert(json.error && json.error.includes('1 MB limit'), 'Clear 1 MB limit error message returned', json.error);
  } catch (e) {
    assert(false, 'Reject Image Above 1 MB', e.message);
  }

  console.log('\n--- TEST 3: Direct Video Upload Below 50 MB (2 MB MP4) ---');
  try {
    const validVid = createDummyFile(2 * 1024 * 1024, 'video/mp4', 'motion-reel-2mb.mp4');
    const fd = new FormData();
    fd.append('file', validVid);
    fd.append('member_id', 'test-creator-001');

    const res = await fetch(`${BASE_URL}/api/community/upload`, {
      method: 'POST',
      body: fd,
    });
    const json = await res.json();
    assert(res.status === 200 && json.success === true && Boolean(json.url), 'Video below 50 MB accepted', `Status: ${res.status}, url: ${json.url}`);
    assert(json.media_type === 'video', 'Media type classified as video', `type: ${json.media_type}`);
  } catch (e) {
    assert(false, 'Video below 50 MB accepted', e.message);
  }

  console.log('\n--- TEST 4: Reject Video Above 50 MB (52 MB MP4) ---');
  try {
    const oversizedVid = createDummyFile(52 * 1024 * 1024, 'video/mp4', 'huge-reel-52mb.mp4');
    const fd = new FormData();
    fd.append('file', oversizedVid);
    fd.append('member_id', 'test-creator-001');

    const res = await fetch(`${BASE_URL}/api/community/upload`, {
      method: 'POST',
      body: fd,
    });
    const json = await res.json();
    assert(res.status === 400 && json.success === false, 'Video above 50 MB rejected with HTTP 400', `Status: ${res.status}`);
    assert(json.error && json.error.includes('50 MB limit'), 'Clear 50 MB limit error message returned', json.error);
  } catch (e) {
    assert(false, 'Reject Video Above 50 MB', e.message);
  }

  console.log('\n--- TEST 5: Reject Unsupported File Type (.exe) ---');
  try {
    const badFile = createDummyFile(10 * 1024, 'application/x-msdownload', 'malicious.exe');
    const fd = new FormData();
    fd.append('file', badFile);

    const res = await fetch(`${BASE_URL}/api/community/upload`, {
      method: 'POST',
      body: fd,
    });
    const json = await res.json();
    assert(res.status === 400 && json.success === false, 'Unsupported file type rejected with HTTP 400', `Status: ${res.status}`);
    assert(json.error && json.error.includes('Unsupported file type'), 'Informative MIME type error message returned', json.error);
  } catch (e) {
    assert(false, 'Reject Unsupported File Type', e.message);
  }

  // --- SECTION 2: Google Drive Parsing & Auto Preview ---
  console.log('\n--- TEST 6: Google Drive Link Parser & Preview URL Generation ---');
  const gdriveShareUrl = 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing';
  const parsedShare = parseGoogleDriveUrl(gdriveShareUrl);
  assert(parsedShare.isGoogleDrive === true, 'Detected as Google Drive link', `isGoogleDrive: ${parsedShare.isGoogleDrive}`);
  assert(parsedShare.fileId === '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs', 'File ID extracted accurately', `fileId: ${parsedShare.fileId}`);
  assert(parsedShare.embedUrl === 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview', 'Embed URL matches preview format', parsedShare.embedUrl);
  assert(parsedShare.thumbnailUrl && parsedShare.thumbnailUrl.includes('drive.google.com/thumbnail'), 'Thumbnail URL generated', parsedShare.thumbnailUrl);

  console.log('\n--- TEST 7: Alternate Google Drive Link Formats ---');
  const openUrl = 'https://drive.google.com/open?id=1AbCdEfGhIjKlMnOpQrStUvWxYz';
  const parsedOpen = parseGoogleDriveUrl(openUrl);
  assert(parsedOpen.isGoogleDrive === true && parsedOpen.fileId === '1AbCdEfGhIjKlMnOpQrStUvWxYz', 'open?id format parsed correctly', parsedOpen.fileId);

  const ucUrl = 'https://drive.google.com/uc?export=download&id=1AbCdEfGhIjKlMnOpQrStUvWxYz';
  const parsedUc = parseGoogleDriveUrl(ucUrl);
  assert(parsedUc.isGoogleDrive === true && parsedUc.fileId === '1AbCdEfGhIjKlMnOpQrStUvWxYz', 'uc?id format parsed correctly', parsedUc.fileId);

  const nonGdriveUrl = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab';
  const parsedNon = parseGoogleDriveUrl(nonGdriveUrl);
  assert(parsedNon.isGoogleDrive === false && parsedNon.fileId === null, 'Non-Google Drive URL correctly identified', `isGoogleDrive: ${parsedNon.isGoogleDrive}`);

  console.log('\n--- TEST 8: Image Preview URL Resolution ---');
  const resolvedImg = resolvePreviewImageUrl(gdriveShareUrl);
  assert(resolvedImg.includes('drive.google.com/thumbnail?id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs'), 'Google Drive image resolved to thumbnail endpoint', resolvedImg);

  const normalImg = 'https://example.com/art.png';
  assert(resolvePreviewImageUrl(normalImg) === normalImg, 'Normal image URL returned as-is', resolvePreviewImageUrl(normalImg));

  console.log('\n--- TEST 9: Video Embed Source Resolution ---');
  const resolvedVid = resolveVideoSource(gdriveShareUrl);
  assert(resolvedVid.isEmbed === true && resolvedVid.sourceUrl.includes('/preview'), 'Google Drive video resolved to embed preview iframe', resolvedVid.sourceUrl);

  const normalVid = 'https://example.com/video.mp4';
  const resolvedNormalVid = resolveVideoSource(normalVid);
  assert(resolvedNormalVid.isEmbed === false && resolvedNormalVid.sourceUrl === normalVid, 'Native video URL flagged as non-embed', resolvedNormalVid.sourceUrl);

  // --- SECTION 3: Feed Post Integration ---
  console.log('\n--- TEST 10: Create Post With Uploaded Media & Google Drive Media ---');
  try {
    const postRes = await fetch(`${BASE_URL}/api/community/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caption: 'Automated test showcase with verified media upload #TNCC',
        media_url: resolvedImg,
        media_type: 'image',
        aspect_ratio: 'portrait',
        category: 'Showcase',
        hashtags: ['#TNCC', '#TestMedia'],
        member_id: 'test-creator-001',
      }),
    });
    const postJson = await postRes.json();
    assert((postRes.status === 200 || postRes.status === 201) && postJson.success === true, 'Feed post created with media URL', `Status: ${postRes.status}`);
  } catch (e) {
    assert(false, 'Feed post created with media URL', e.message);
  }

  // --- SECTION 4: Page Route Verification ---
  console.log('\n--- TEST 11: Community Feed Page Loads With Media System ---');
  try {
    const feedRes = await fetch(`${BASE_URL}/community`);
    assert(feedRes.status === 200, 'Feed page responds with HTTP 200', `Status: ${feedRes.status}`);
  } catch (e) {
    assert(false, 'Feed page responds with HTTP 200', e.message);
  }

  console.log('\n====================================================');
  console.log(`TEST EXECUTION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
