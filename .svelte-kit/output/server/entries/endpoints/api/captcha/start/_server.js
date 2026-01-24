import { json } from "@sveltejs/kit";
import { c as challenges } from "../../../../../chunks/captchaStore.js";
async function POST({ getClientAddress }) {
  const challengeId = crypto.randomUUID();
  const ip = getClientAddress();
  console.log("[Server] /api/captcha/start - Creating challenge:", challengeId, "for IP:", ip);
  challenges.set(challengeId, {
    createdAt: Date.now(),
    ip,
    used: false
  });
  return json({ challengeId });
}
export {
  POST
};
