import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongo';
import Product from '@/lib/models/Product';
import { listProducts } from '@/lib/store';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '100', 10);
  try {
    await connectMongo();
    const docs = await Product.find({ active: true }).limit(limit).sort({ createdAt: -1 }).lean();
    const products = docs.map((p: any) => ({
      id: p._id?.toString() || p.sku,
      handle: p.handle,
      title: p.title,
      vendor: p.vendor,
      featuredImage: p.images?.[0] ? { url: p.images[0] } : null,
      price: p.price !== undefined ? { amount: String(p.price), currencyCode: 'USD' } : { amount: '0', currencyCode: 'USD' },
      tags: p.tags || [],
      rating: 4.5,
      reviewCount: 128,
    }));
    return NextResponse.json(products);
  } catch (err) {
    // On Mongo errors (e.g., SRV DNS), fall back to local store
    console.warn('Mongo unavailable, falling back to local products:', (err as any)?.code || err);
    try {
      const products = await listProducts(limit);
      return NextResponse.json(products);
    } catch (fallbackErr) {
      console.error('Products API fallback error:', fallbackErr);
      return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
    }
  }
}

export const dynamic = 'force-dynamic';
