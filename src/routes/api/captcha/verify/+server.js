import { json } from '@sveltejs/kit';
import { challenges, passes } from '$lib/server/captchaStore';

const MIN_DURATION = 100; // ms (relaxed for development)
const MIN_MOVES = 1;      // (relaxed for development)
const MAX_AGE = 90_000; // 90 seconds

export async function POST({ request, getClientAddress }) {
  const body = await request.json();

  const {
    challengeId,
    duration,
    moves,
    jitter,
    accuracy
  } = body;

  console.log('[Server] /api/captcha/verify - Received:', { challengeId, duration, moves, jitter, accuracy });

  // Basic shape check
  if (!challengeId) {
    console.log('[Server] ✗ Rejected: No challengeId');
    return json({ ok: false }, { status: 400 });
  }

  const challenge = challenges.get(challengeId);

  // Challenge must exist
  if (!challenge) {
    console.log('[Server] ✗ Rejected: Challenge not found');
    return json({ ok: false }, { status: 403 });
  }

  // One-time use
  if (challenge.used) {
    console.log('[Server] ✗ Rejected: Challenge already used');
    return json({ ok: false }, { status: 403 });
  }

  // Expiration
  if (Date.now() - challenge.createdAt > MAX_AGE) {
    console.log('[Server] ✗ Rejected: Challenge expired');
    challenges.delete(challengeId);
    return json({ ok: false }, { status: 403 });
  }

  // Soft IP binding (optional)
  if (challenge.ip !== getClientAddress()) {
    console.log('[Server] ✗ Rejected: IP mismatch');
    return json({ ok: false }, { status: 403 });
  }

  // Heuristic checks (intentionally fuzzy)
  // TODO: Re-enable stricter checks for production
  if (
    duration < MIN_DURATION ||
    moves < MIN_MOVES
    // accuracy > 0.99 || // too perfect is suspicious (disabled for dev)
    // jitter === 0       // (disabled for dev)
  ) {
    console.log('[Server] ✗ Rejected: Failed heuristics -', {
      durationOk: duration >= MIN_DURATION,
      movesOk: moves >= MIN_MOVES
    });
    return json({ ok: false }, { status: 403 });
  }

  // Mark challenge as used
  challenge.used = true;

  // Issue a short-lived pass token
  const passToken = crypto.randomUUID();

  passes.set(passToken, {
    issuedAt: Date.now(),
    ip: challenge.ip
  });

  console.log('[Server] ✓ Verification successful! Pass token:', passToken);

  return json({
    ok: true,
    passToken,
    expiresIn: 300 // seconds
  });
}
