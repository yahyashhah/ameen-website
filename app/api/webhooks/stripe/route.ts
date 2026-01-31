import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createOrderFromCart } from '@/lib/orders';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!sig || !secret || !key) return NextResponse.json({ ok: true });
  const stripe = new Stripe(key, { apiVersion: '2024-12-18.acacia' });
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const cartId = (session.metadata?.cartId as string) || '';
    const email = session.customer_details?.email || (session.metadata?.email as string) || undefined;
    const name = session.customer_details?.name || undefined;
    const address = session.customer_details?.address || undefined;
    if (cartId) {
      await createOrderFromCart(cartId, 'paid', session.id, { name, email, address });
    }
  }
  return NextResponse.json({ received: true });
}

export const dynamic = 'force-dynamic';
