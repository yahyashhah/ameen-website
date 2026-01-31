import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { cookies } from 'next/headers';
import { getDB } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const store = await cookies();
    const cartId = store.get('cartId')?.value;
    if (!cartId) return NextResponse.json({ error: 'Cart empty' }, { status: 400 });

    // Build line items from cart
    const db = await getDB();
    const cart = db.data!.carts.find((c) => c.id === cartId);
    if (!cart || !cart.lines?.length) return NextResponse.json({ error: 'Cart empty' }, { status: 400 });
    const line_items = cart.lines.map((l) => {
      const v = db.data!.variants.find((x) => x.id === l.variantId)!;
      const p = db.data!.products.find((x) => x.id === v.productId)!;
      return {
        quantity: l.quantity,
        price_data: {
          currency: 'usd',
          product_data: { name: p.title },
          unit_amount: Math.round(Number(v.price) * 100),
        },
      } as Stripe.Checkout.SessionCreateParams.LineItem;
    });

    const successUrl = `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${base}/checkout`;

    if (!STRIPE_SECRET_KEY) {
      // Fallback to mock redirect if no key configured
      const url = `${base}/api/checkout/stripe/mock-redirect`;
      return NextResponse.json({ url });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    const sessionUser = await getSession();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        cartId,
        userId: sessionUser?.id || '',
        email: sessionUser?.email || '',
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to start Stripe checkout' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
