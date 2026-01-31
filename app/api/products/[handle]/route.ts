import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongo';
import Product from '@/lib/models/Product';
import { getProductByHandle } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  // Try Mongo first, then fall back to local store
  try {
    await connectMongo();
    const p: any = await Product.findOne({ handle, active: true }).lean();
    if (!p) {
      // Fall back to local store if not found in DB
      const local = await getProductByHandle(handle);
      if (!local) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(local);
    }
    const product = {
      id: p._id?.toString() || p.sku,
      handle: p.handle,
      title: p.title,
      descriptionHtml: p.descriptionHtml || '',
      vendor: p.vendor,
      images: (p.images || []).map((url: string) => ({ url })),
      featuredImage: p.images?.[0] ? { url: p.images[0] } : null,
      price: { amount: String(p.price ?? 0), currencyCode: 'USD' },
      compareAtPrice: p.compareAtPrice ? { amount: String(p.compareAtPrice), currencyCode: 'USD' } : undefined,
      variants: [{
        id: `var-${p.sku ?? p._id?.toString()}`,
        title: 'Default',
        price: { amount: String(p.price ?? 0), currencyCode: 'USD' },
        sku: p.sku || undefined,
        available: (p.inventory ?? 0) > 0,
      }],
      tags: p.tags || [],
      rating: 4.5,
      reviewCount: 128,
    };
    return NextResponse.json(product);
  } catch (err) {
    // On Mongo errors (e.g., SRV DNS), fall back to local store
    console.warn('Mongo unavailable, falling back to local store:', (err as any)?.code || err);
    try {
      const local = await getProductByHandle(handle);
      if (!local) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(local);
    } catch (fallbackErr) {
      console.error('Product detail API fallback error:', fallbackErr);
      return NextResponse.json({ error: 'Failed to load product' }, { status: 500 });
    }
  }
}
