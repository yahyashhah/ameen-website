import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body?.amount || 0);
    if (!amount || amount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });

    const client = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;
    if (!client || !secret) {
      return NextResponse.json({ orderId: 'mock_paypal_order_id' });
    }

    const base = process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
    const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${client}:${secret}`).toString('base64'),
      },
      body: new URLSearchParams({ grant_type: 'client_credentials' }),
    });
    if (!tokenRes.ok) {
      const txt = await tokenRes.text();
      throw new Error(`PayPal token error: ${tokenRes.status} ${txt}`);
    }
    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token as string;

    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          { amount: { currency_code: 'USD', value: amount.toFixed(2) } }
        ],
      }),
    });
    if (!orderRes.ok) {
      const txt = await orderRes.text();
      throw new Error(`PayPal order error: ${orderRes.status} ${txt}`);
    }
    const orderJson = await orderRes.json();
    return NextResponse.json({ orderId: orderJson.id });
  } catch (err) {
    console.error('PayPal order error:', err);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
