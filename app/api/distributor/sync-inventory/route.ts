import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongo';
import Product from '@/lib/models/Product';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectMongo();
    const body = await req.json();
    const items = Array.isArray(body?.items) ? body.items : [];
    if (!items.length) return NextResponse.json({ error: 'No items provided' }, { status: 400 });

    let updated = 0, errors = 0;
    for (const item of items) {
      try {
        const res = await Product.findOneAndUpdate({ sku: item.sku }, { inventory: Number(item.inventory ?? 0) }, { new: true });
        if (res) updated++;
      } catch (e) {
        errors++;
        console.error('Inventory sync error:', e);
      }
    }

    return NextResponse.json({ message: 'Inventory sync completed', updated, errors, total: items.length });
  } catch (err) {
    console.error('Distributor inventory error:', err);
    return NextResponse.json({ error: 'Inventory sync failed' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
