import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectMongo } from '@/lib/mongo';
import Product from '@/lib/models/Product';
import { listProducts } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '100', 10);
    try {
      await connectMongo();
      const docs = await Product.find({}).limit(limit).sort({ updatedAt: -1 }).lean();
      const products = docs.map((p: any) => ({
        id: String(p._id || p.sku),
        sku: p.sku,
        handle: p.handle,
        title: p.title,
        vendor: p.vendor,
        category: p.category,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        inventory: p.inventory,
        active: p.active,
        featured: p.featured,
        tags: p.tags || [],
        updatedAt: p.updatedAt,
      }));
      return NextResponse.json(products);
    } catch (mongoErr) {
      const products = await listProducts(limit);
      return NextResponse.json(products);
    }
  } catch (err) {
    console.error('Admin products error:', err);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';