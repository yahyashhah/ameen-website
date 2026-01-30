import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json({ products: [] });
    }

    const products = await searchProducts(query, limit);
    
    return NextResponse.json({ 
      products: products.map(p => ({
        id: p.id,
        handle: p.handle,
        title: p.title,
        vendor: p.vendor,
        image: p.featuredImage?.url || null
      }))
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
