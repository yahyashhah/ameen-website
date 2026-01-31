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
    const products = Array.isArray(body?.products) ? body.products : [];
    if (!products.length) return NextResponse.json({ error: 'No products provided' }, { status: 400 });

    let created = 0, updated = 0, errors = 0;
    for (const p of products) {
      try {
        const existing = await Product.findOne({ sku: p.sku });
        const doc = {
          sku: p.sku,
          handle: p.handle,
          title: p.title,
          description: p.descriptionHtml || p.description || '',
          vendor: p.vendor,
          category: p.type || p.category || 'General',
          price: Number(p.price ?? 0),
          compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
          images: (p.images || []).map((i: any) => i.url || i),
          inventory: Number(p.stock ?? p.inventory ?? 0),
          ean: p.barcode || p.ean,
          mpn: p.mpn,
          featured: Boolean(p.featured),
          active: true,
          tags: Array.isArray(p.tags) ? p.tags : [],
        } as any;
        if (existing) {
          await Product.updateOne({ sku: p.sku }, doc);
          updated++;
        } else {
          await Product.create(doc);
          created++;
        }
      } catch (e) {
        errors++;
        console.error('Import product error:', e);
      }
    }

    return NextResponse.json({ message: 'Product import completed', created, updated, errors, total: products.length });
  } catch (err) {
    console.error('Distributor import error:', err);
    return NextResponse.json({ error: 'Product import failed' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
