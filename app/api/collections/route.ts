import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const collections = [
      {
        id: 'c1',
        title: 'Workspace Essentials',
        handle: 'workspace-essentials',
        description: 'Curated picks to optimize your daily workflow',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        productCount: 12,
        featured: true,
        products: [
          {
            id: 'dummy-1',
            title: 'PowerCore 10000 Portable Charger',
            price: 29.99,
            compareAtPrice: 39.99,
            images: ['https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=600&q=80'],
            rating: 4.7,
            reviewCount: 184,
          },
          {
            id: 'dummy-2',
            title: 'MX Master 3S Wireless Mouse',
            price: 99.99,
            images: ['https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=600&q=80'],
            rating: 4.8,
            reviewCount: 256,
          },
        ],
      },
      {
        id: 'c2',
        title: 'Charging & Power',
        handle: 'charging-and-power',
        description: 'Fast, safe charging for all your devices',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        productCount: 8,
        featured: false,
        products: [
          {
            id: 'dummy-3',
            title: 'Base One MagSafe Charger',
            price: 119.0,
            images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'],
            rating: 4.6,
            reviewCount: 142,
          },
          {
            id: 'dummy-8',
            title: 'Premium USB‑C Cable (2m)',
            price: 24.0,
            images: ['https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=600&q=80'],
            rating: 4.5,
            reviewCount: 96,
          },
        ],
      },
    ];
    return NextResponse.json({ collections });
  } catch (err) {
    console.error('Collections API error:', err);
    return NextResponse.json({ error: 'Failed to load collections' }, { status: 500 });
  }
}
