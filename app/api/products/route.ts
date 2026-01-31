import { NextResponse } from 'next/server';
import { listProducts } from '../../../lib/store';

export async function GET() {
  try {
    const products = await listProducts(100);
    return NextResponse.json(products);
  } catch (err) {
    console.error('Products API error:', err);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}
