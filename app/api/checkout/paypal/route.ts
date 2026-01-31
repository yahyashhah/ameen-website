import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(_req: NextRequest) {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const mode = process.env.PAYPAL_MODE === 'live' ? 'live' : 'sandbox';
    const store = await cookies();
    const cartId = store.get('cartId')?.value || '';

    if (!clientId || !clientSecret) {
      // Fallback to mock
      const url = `${base}/api/checkout/paypal/mock-redirect`;
      return NextResponse.json({ url });
    }

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

    const createRes = await fetch(`https://api.${mode}.paypal.com/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${oauth.access_token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            custom_id: cartId,
            amount: { currency_code: 'USD', value: '0.00' }, // Final amount validated on capture
          },
        ],
        application_context: {
          return_url: `${base}/api/checkout/paypal/return`,
          cancel_url: `${base}/checkout`,
          user_action: 'PAY_NOW',
        },
      }),
    });
    const order = await createRes.json();
    const approve = order.links?.find((l: any) => l.rel === 'approve')?.href;
    if (!approve) throw new Error('No approval link');
    return NextResponse.json({ url: approve });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to start PayPal checkout' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
