import { NextRequest } from 'next/server';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const secret = process.env.SHOPIFY_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  if (!secret) return new Response('Webhook secret not configured', { status: 500 });

  const raw = await req.text();
  const hmac = req.headers.get('x-shopify-hmac-sha256') || '';
  const digest = crypto.createHmac('sha256', secret).update(raw, 'utf8').digest('base64');
  const valid = crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac));
  if (!valid) return new Response('Invalid signature', { status: 401 });

  try {
    const payload = JSON.parse(raw);
    const outDir = path.resolve(process.cwd(), 'data', 'webhooks');
    await fs.promises.mkdir(outDir, { recursive: true });
    const outfile = path.join(outDir, `order_${Date.now()}.json`);
    await fs.promises.writeFile(outfile, JSON.stringify(payload, null, 2), 'utf8');
  } catch {}

  return new Response('ok');
}
