import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body?.amount || 0);
    if (!amount || amount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      // Mock response to allow testing without Stripe credentials
      return NextResponse.json({ clientSecret: 'mock_client_secret' });
    }

    const stripe = new Stripe(secret, { apiVersion: '2024-11-20' as any });
    const cents = Math.round(amount * 100);
    const intent = await stripe.paymentIntents.create({
      amount: cents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: typeof body?.metadata === 'object' ? body.metadata : undefined,
    });
    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error('Stripe intent error:', err);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
