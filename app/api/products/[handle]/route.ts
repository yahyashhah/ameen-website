import { NextResponse } from 'next/server';
import { getProductByHandle } from '../../../../lib/store';

export async function GET(_: Request, context: { params: Promise<{ handle: string }> }) {
  try {
    const { handle } = await context.params;
    const product = await getProductByHandle(handle);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    console.error('Product by handle API error:', err);
    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 });
  }
}
