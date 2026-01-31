import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongo';
import Order from '@/lib/models/Order';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const body = await req.json();
    const items = Array.isArray(body?.items) ? body.items : [];
    if (!items.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

    const subtotal = items.reduce((sum: number, i: any) => sum + Number(i.price || 0) * Number(i.quantity || 0), 0);
    const tax = Number(body?.tax ?? subtotal * 0.1);
    const shipping = Number(body?.shipping ?? 0);
    const total = Number(body?.total ?? subtotal + tax + shipping);

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const doc = await Order.create({
      orderNumber,
      customerEmail: body?.shippingInfo?.email || '',
      customerName: `${body?.shippingInfo?.firstName || ''} ${body?.shippingInfo?.lastName || ''}`.trim(),
      items: items.map((i: any) => ({
        productId: i.productId || undefined,
        sku: i.sku || '',
        title: i.title,
        quantity: Number(i.quantity || 1),
        price: Number(i.price || 0),
      })),
      subtotal,
      tax,
      shipping,
      total,
      status: 'pending',
      paymentMethod: body?.paymentMethod === 'paypal' ? 'paypal' : 'stripe',
      shippingAddress: {
        name: `${body?.shippingInfo?.firstName || ''} ${body?.shippingInfo?.lastName || ''}`.trim(),
        line1: body?.shippingInfo?.address || '',
        city: body?.shippingInfo?.city || '',
        state: body?.shippingInfo?.state || '',
        postalCode: body?.shippingInfo?.zipCode || '',
        country: body?.shippingInfo?.country || 'United States',
      },
    });

    return NextResponse.json({ id: doc._id.toString(), orderNumber: doc.orderNumber });
  } catch (err) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
