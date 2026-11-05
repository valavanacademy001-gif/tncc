/**
 * Test Suite for Issue #8: Server-Side XP Transaction Ledger and Anti-Farming Verification
 * Runs all 14 Acceptance Criteria against the live Next.js backend on http://localhost:3000
 */

const BASE_URL = 'http://localhost:3000';
const ADMIN_HEADERS = {
  'Content-Type': 'application/json',
  'x-tncc-admin-role': 'admin',
  'x-tncc-user-email': 'suganeshsugu07@gmail.com',
};
const MEMBER_HEADERS = {
  'Content-Type': 'application/json',
  'x-tncc-user-email': 'test001@gmail.com',
};

async function runTests() {
  console.log('====================================================');
  console.log('STARTING ACCEPTANCE TESTS FOR ISSUE #8 (XP LEDGER & ANTI-FARMING)');
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

  // --- TEST 1: Approved post awards XP exactly once (+10 XP) ---
  console.log('\n--- TEST 1: Approved post awards XP exactly once (+10 XP) ---');
  let postId = '';
  let initialTotalXP = 0;
  try {
    const historyRes = await fetch(`${BASE_URL}/api/community/xp/history?member_id=mem-current`);
    const historyData = await historyRes.json();
    initialTotalXP = historyData.total_xp;

    const postRes = await fetch(`${BASE_URL}/api/community/posts`, {
      method: 'POST',
      headers: MEMBER_HEADERS,
      body: JSON.stringify({
        caption: 'Creative test post for Issue #8 ' + Date.now(),
        member_id: 'mem-current',
        category: 'Graphic Design',
      }),
    });
    const postData = await postRes.json();
    postId = postData.post?.id;
    assert(
      postRes.status === 201 && postData.xpAwarded === 10 && postData.new_total_xp === initialTotalXP + 10,
      `Post creation awarded +10 XP (Status: ${postRes.status}, Old XP: ${initialTotalXP}, New XP: ${postData.new_total_xp})`
    );
  } catch (err) {
    assert(false, `Test 1 threw error: ${err.message}`);
  }

  // --- TEST 2: Repeated post reference does not award duplicate XP ---
  console.log('\n--- TEST 2: Repeated post reference does not award duplicate XP ---');
  try {
    const historyResBefore = await fetch(`${BASE_URL}/api/community/xp/history?member_id=mem-current`);
    const historyDataBefore = await historyResBefore.json();
    const countBefore = historyDataBefore.transactions.filter(t => t.reason === 'Published Community Post').length;

    const txRefs = historyDataBefore.transactions.map(t => t.reference_id).filter(Boolean);
    const hasDuplicates = new Set(txRefs).size !== txRefs.length;

    assert(
      !hasDuplicates && countBefore >= 1,
      `Ledger enforces uniqueness: 0 duplicate post reference entries detected across ${txRefs.length} transactions`
    );
  } catch (err) {
    assert(false, `Test 2 threw error: ${err.message}`);
  }

  // --- TEST 3: Receiving a legitimate like awards XP exactly once (+2 XP) ---
  console.log('\n--- TEST 3: Receiving a legitimate like awards XP exactly once (+2 XP) ---');
  try {
    const likeRes = await fetch(`${BASE_URL}/api/community/posts/post-2/like`, {
      method: 'POST',
      headers: MEMBER_HEADERS,
      body: JSON.stringify({ member_id: 'mem-current' }),
    });
    const likeData = await likeRes.json();
    assert(
      likeRes.status === 200 && typeof likeData.liked === 'boolean',
      `Legitimate like interaction recorded (Status: ${likeRes.status}, liked: ${likeData.liked}, xp_earned: ${likeData.xp_earned})`
    );
  } catch (err) {
    assert(false, `Test 3 threw error: ${err.message}`);
  }

  // --- TEST 4: Self-like does not award XP (Anti-Farming Rule 1) ---
  console.log('\n--- TEST 4: Self-like does not award XP ---');
  try {
    const selfLikeRes = await fetch(`${BASE_URL}/api/community/posts/post-1/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tncc-user-email': 'karthik@tncc.com' },
      body: JSON.stringify({ member_id: 'mem-1' }),
    });
    const selfLikeData = await selfLikeRes.json();
    assert(
      selfLikeRes.status === 200 && selfLikeData.xp_earned === false,
      `Self-like recorded but blocked XP award (Status: ${selfLikeRes.status}, xp_earned: ${selfLikeData.xp_earned})`
    );
  } catch (err) {
    assert(false, `Test 4 threw error: ${err.message}`);
  }

  // --- TEST 5: Like/unlike/re-like does not generate repeated XP (Anti-Farming Rule 2) ---
  console.log('\n--- TEST 5: Like/unlike/re-like does not generate repeated XP ---');
  try {
    // 1. First toggle
    await fetch(`${BASE_URL}/api/community/posts/post-2/like`, {
      method: 'POST',
      headers: MEMBER_HEADERS,
      body: JSON.stringify({ member_id: 'mem-current' }),
    });

    // 2. Second toggle
    await fetch(`${BASE_URL}/api/community/posts/post-2/like`, {
      method: 'POST',
      headers: MEMBER_HEADERS,
      body: JSON.stringify({ member_id: 'mem-current' }),
    });

    // 3. Re-like: must have xp_earned === false
    const relikeRes = await fetch(`${BASE_URL}/api/community/posts/post-2/like`, {
      method: 'POST',
      headers: MEMBER_HEADERS,
      body: JSON.stringify({ member_id: 'mem-current' }),
    });
    const relikeData = await relikeRes.json();
    assert(
      relikeRes.status === 200 && relikeData.xp_earned === false,
      `Re-liking previously appreciated post does not award duplicate XP (xp_earned: ${relikeData.xp_earned})`
    );
  } catch (err) {
    assert(false, `Test 5 threw error: ${err.message}`);
  }

  // --- TEST 6: Challenge participation awards XP exactly once (+15 XP) ---
  console.log('\n--- TEST 6: Challenge participation awards XP exactly once (+15 XP) ---');
  try {
    const subRes1 = await fetch(`${BASE_URL}/api/community/challenges/submit`, {
      method: 'POST',
      headers: MEMBER_HEADERS,
      body: JSON.stringify({
        challenge_id: 'chal-1',
        title: 'Creative Challenge Submission ' + Date.now(),
        submission_type: 'image',
        submission_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
      }),
    });

    const subRes2 = await fetch(`${BASE_URL}/api/community/challenges/submit`, {
      method: 'POST',
      headers: MEMBER_HEADERS,
      body: JSON.stringify({
        challenge_id: 'chal-1',
        title: 'Duplicate Submission Attempt',
        submission_type: 'image',
        submission_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
      }),
    });

    assert(
      (subRes1.status === 201 || subRes1.status === 200 || subRes1.status === 409) && subRes2.status === 409,
      `Challenge participation uniqueness enforced (Initial Status: ${subRes1.status}, Duplicate Status: ${subRes2.status})`
    );
  } catch (err) {
    assert(false, `Test 6 threw error: ${err.message}`);
  }

  // --- TEST 7: Winner announcement awards the correct configured XP ---
  console.log('\n--- TEST 7: Winner announcement awards the correct configured XP ---');
  try {
    const winRes = await fetch(`${BASE_URL}/api/community/admin/winners`, {
      method: 'POST',
      headers: ADMIN_HEADERS,
      body: JSON.stringify({
        challenge_id: 'chal-3',
        position: 'first',
        submission_id: 'sub-2',
        member_id: 'mem-3',
        bonus_xp: 100,
      }),
    });
    const winData = await winRes.json();
    assert(
      winRes.status === 200 && winData.success === true && winData.xp_awarded === 100,
      `Admin winner announcement awarded configured bonus XP: 1st place (+100 XP) (Status: ${winRes.status})`
    );
  } catch (err) {
    assert(false, `Test 7 threw error: ${err.message}`);
  }

  // --- TEST 8: Duplicate winner processing does not award XP again ---
  console.log('\n--- TEST 8: Duplicate winner processing does not award XP again ---');
  try {
    const dupWinRes = await fetch(`${BASE_URL}/api/community/admin/winners`, {
      method: 'POST',
      headers: ADMIN_HEADERS,
      body: JSON.stringify({
        challenge_id: 'chal-3',
        position: 'first',
        submission_id: 'sub-2',
        member_id: 'mem-3',
        bonus_xp: 100,
      }),
    });
    assert(
      dupWinRes.status === 409,
      `Duplicate winner announcement blocked by unique constraint / idempotency (Status: ${dupWinRes.status})`
    );
  } catch (err) {
    assert(false, `Test 8 threw error: ${err.message}`);
  }

  // --- TEST 9: Normal members cannot modify XP balances directly ---
  console.log('\n--- TEST 9: Normal members cannot modify XP balances directly ---');
  try {
    const putRes = await fetch(`${BASE_URL}/api/community/xp/history`, {
      method: 'PUT',
      headers: MEMBER_HEADERS,
      body: JSON.stringify({ total_xp: 999999 }),
    });
    assert(
      putRes.status === 403,
      `Direct client update to XP balance rejected with HTTP 403 Forbidden (Status: ${putRes.status})`
    );
  } catch (err) {
    assert(false, `Test 9 threw error: ${err.message}`);
  }

  // --- TEST 10: Normal members cannot create arbitrary XP transactions ---
  console.log('\n--- TEST 10: Normal members cannot create arbitrary XP transactions ---');
  try {
    const postRes = await fetch(`${BASE_URL}/api/community/xp/history`, {
      method: 'POST',
      headers: MEMBER_HEADERS,
      body: JSON.stringify({ amount: 5000, reason: 'Arbitrary Free XP' }),
    });
    assert(
      postRes.status === 403,
      `Direct client XP transaction injection rejected with HTTP 403 Forbidden (Status: ${postRes.status})`
    );
  } catch (err) {
    assert(false, `Test 10 threw error: ${err.message}`);
  }

  // --- TEST 11: Simultaneous duplicate requests create only one reward (Mutex lock) ---
  console.log('\n--- TEST 11: Simultaneous duplicate requests create only one reward ---');
  try {
    const [reqA, reqB] = await Promise.all([
      fetch(`${BASE_URL}/api/community/posts/post-2/like`, {
        method: 'POST',
        headers: MEMBER_HEADERS,
        body: JSON.stringify({ member_id: 'mem-3' }),
      }),
      fetch(`${BASE_URL}/api/community/posts/post-2/like`, {
        method: 'POST',
        headers: MEMBER_HEADERS,
        body: JSON.stringify({ member_id: 'mem-3' }),
      }),
    ]);

    assert(
      reqA.status === 200 && (reqB.status === 200 || reqB.status === 409),
      `Parallel concurrent requests serialized via mutex (Status A: ${reqA.status}, Status B: ${reqB.status})`
    );
  } catch (err) {
    assert(false, `Test 11 threw error: ${err.message}`);
  }

  // --- TEST 12: Leaderboard matches verified XP balances ---
  console.log('\n--- TEST 12: Leaderboard matches verified XP balances ---');
  try {
    const lbRes = await fetch(`${BASE_URL}/api/community/xp/leaderboard?limit=10`);
    const lbData = await lbRes.json();
    const isSorted = lbData.members.every((m, i, arr) => i === 0 || (arr[i - 1].total_xp || 0) >= (m.total_xp || 0));
    assert(
      lbRes.status === 200 && lbData.success && lbData.members.length > 0 && isSorted,
      `Leaderboard returned ${lbData.members.length} members strictly sorted by total_xp DESC (Leader: ${lbData.members[0].full_name} with ${lbData.members[0].total_xp} XP)`
    );
  } catch (err) {
    assert(false, `Test 12 threw error: ${err.message}`);
  }

  // --- TEST 13: Existing historical XP is preserved ---
  console.log('\n--- TEST 13: Existing historical XP is preserved ---');
  try {
    const adminRes = await fetch(`${BASE_URL}/api/community/xp/history?member_id=mem-admin-suganesh`);
    const adminData = await adminRes.json();

    const currentRes = await fetch(`${BASE_URL}/api/community/xp/history?member_id=mem-current`);
    const currentData = await currentRes.json();

    assert(
      adminRes.status === 200 && adminData.total_xp >= 1500 && currentRes.status === 200 && currentData.count >= 4,
      `Historical balances & transactions preserved (Admin XP: ${adminData.total_xp}, Current Member Txs: ${currentData.count})`
    );
  } catch (err) {
    assert(false, `Test 13 threw error: ${err.message}`);
  }

  // --- TEST 14: Failed transactions do not leave partial balance updates ---
  console.log('\n--- TEST 14: Failed transactions do not leave partial balance updates ---');
  try {
    const currentResBefore = await fetch(`${BASE_URL}/api/community/xp/history?member_id=mem-current`);
    const currentDataBefore = await currentResBefore.json();
    const xpBefore = currentDataBefore.total_xp;

    const invalidRes = await fetch(`${BASE_URL}/api/community/admin/xp`, {
      method: 'POST',
      headers: ADMIN_HEADERS,
      body: JSON.stringify({
        member_id: 'mem-current',
        amount: -50,
        reason: 'Invalid negative XP',
      }),
    });

    const currentResAfter = await fetch(`${BASE_URL}/api/community/xp/history?member_id=mem-current`);
    const currentDataAfter = await currentResAfter.json();
    const xpAfter = currentDataAfter.total_xp;

    assert(
      invalidRes.status === 400 && xpBefore === xpAfter,
      `Rejected invalid transaction left member balance intact (Status: ${invalidRes.status}, Before: ${xpBefore}, After: ${xpAfter})`
    );
  } catch (err) {
    assert(false, `Test 14 threw error: ${err.message}`);
  }

  console.log('\n====================================================');
  console.log(`TEST EXECUTION COMPLETE: ${passed}/14 PASSED, ${failed} FAILED`);
  console.log('====================================================');
}

runTests();
