import { NextResponse } from 'next/server';
import { listProducts } from '@/lib/store';

export async function GET() {
  try {
    // For now, "featured" = top N products from the local store
    const products = await listProducts(12);
    return NextResponse.json(products);
  } catch (err) {
    console.error('Featured products API error:', err);
    return NextResponse.json({ error: 'Failed to load featured products' }, { status: 500 });
  }
}
