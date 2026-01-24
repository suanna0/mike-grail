import { json } from "@sveltejs/kit";
import { c as challenges, p as passes } from "../../../../../chunks/captchaStore.js";
const MIN_DURATION = 100;
const MIN_MOVES = 1;
const MAX_AGE = 9e4;
async function POST({ request, getClientAddress }) {
  const body = await request.json();
  const {
    challengeId,
    duration,
    moves,
    jitter,
    accuracy
  } = body;
  console.log("[Server] /api/captcha/verify - Received:", { challengeId, duration, moves, jitter, accuracy });
  if (!challengeId) {
    console.log("[Server] ✗ Rejected: No challengeId");
    return json({ ok: false }, { status: 400 });
  }
  const challenge = challenges.get(challengeId);
  if (!challenge) {
    console.log("[Server] ✗ Rejected: Challenge not found");
    return json({ ok: false }, { status: 403 });
  }
  if (challenge.used) {
    console.log("[Server] ✗ Rejected: Challenge already used");
    return json({ ok: false }, { status: 403 });
  }
  if (Date.now() - challenge.createdAt > MAX_AGE) {
    console.log("[Server] ✗ Rejected: Challenge expired");
    challenges.delete(challengeId);
    return json({ ok: false }, { status: 403 });
  }
  if (challenge.ip !== getClientAddress()) {
    console.log("[Server] ✗ Rejected: IP mismatch");
    return json({ ok: false }, { status: 403 });
  }
  if (duration < MIN_DURATION || moves < MIN_MOVES) {
    console.log("[Server] ✗ Rejected: Failed heuristics -", {
      durationOk: duration >= MIN_DURATION,
      movesOk: moves >= MIN_MOVES
    });
    return json({ ok: false }, { status: 403 });
  }
  challenge.used = true;
  const passToken = crypto.randomUUID();
  passes.set(passToken, {
    issuedAt: Date.now(),
    ip: challenge.ip
  });
  console.log("[Server] ✓ Verification successful! Pass token:", passToken);
  return json({
    ok: true,
    passToken,
    expiresIn: 300
    // seconds
  });
}
export {
  POST
};
