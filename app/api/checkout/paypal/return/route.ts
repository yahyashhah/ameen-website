import { NextRequest, NextResponse } from 'next/server';
import { createOrderFromCart } from '@/lib/orders';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token'); // PayPal order ID
  const mode = process.env.PAYPAL_MODE === 'live' ? 'live' : 'sandbox';
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  if (!token || !clientId || !clientSecret) return NextResponse.redirect(`${base}/checkout`);
  try {
    const oauthRes = await fetch(`https://api.${mode}.paypal.com/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      body: 'grant_type=client_credentials',
    });
    const oauth = await oauthRes.json();
    if (!oauth.access_token) throw new Error('PayPal auth failed');

    const captureRes = await fetch(`https://api.${mode}.paypal.com/v2/checkout/orders/${token}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${oauth.access_token}`,
      },
    });
    const capture = await captureRes.json();
    const unit = capture.purchase_units?.[0];
    const cartId = unit?.custom_id as string | undefined;
    const payer = capture.payer;
    let dest = `${base}/checkout`;
    if (cartId) {
      const orderId = await createOrderFromCart(cartId, 'paid', token, {
        name: `${payer?.name?.given_name || ''} ${payer?.name?.surname || ''}`.trim(),
        email: payer?.email_address,
        address: payer?.address,
      });
      if (orderId) dest = `${base}/orders/confirmation?id=${encodeURIComponent(orderId)}`;
    }
    return NextResponse.redirect(dest);
  } catch {
    return NextResponse.redirect(`${base}/checkout`);
  }
}

export const dynamic = 'force-dynamic';
