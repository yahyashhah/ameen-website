import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectMongo } from '@/lib/mongo';
import Order from '@/lib/models/Order';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '100', 10);
    await connectMongo();
    const docs = await Order.find({}).limit(limit).sort({ createdAt: -1 }).lean();
    const orders = docs.map((o: any) => ({
      id: String(o._id || o.orderNumber),
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      paymentMethod: o.paymentMethod,
    }));
    return NextResponse.json(orders);
  } catch (err) {
    console.error('Admin orders error:', err);
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';