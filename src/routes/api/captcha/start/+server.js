import { json } from '@sveltejs/kit';
import { challenges } from '$lib/server/captchaStore';

export async function POST({ getClientAddress }) {
    const challengeId = crypto.randomUUID();
    const ip = getClientAddress();

    console.log('[Server] /api/captcha/start - Creating challenge:', challengeId, 'for IP:', ip);

    challenges.set(challengeId, {
      createdAt: Date.now(),
      ip: ip,
      used: false
    });

    return json({ challengeId });
}
  