import { NextRequest, NextResponse } from 'next/server';
import { createOrderFromCurrentCart } from '@/lib/orders';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cancel = searchParams.get('cancel');
  const id = await createOrderFromCurrentCart('paid', 'stripe_mock');
  const dest = id ? `/orders/confirmation?id=${encodeURIComponent(id)}` : cancel || '/checkout';
  return NextResponse.redirect(dest);
}

export const dynamic = 'force-dynamic';
