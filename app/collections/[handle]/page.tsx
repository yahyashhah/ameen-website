'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, Typography, Chip, Button } from '@mui/material';

interface ProductItem {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
}

interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
  products: ProductItem[];
}

export default function CollectionDetailPage() {
  const { handle } = useParams() as { handle: string };
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/collections/${handle}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setCollection(data);
      } catch (e) {
        console.error('Failed to load collection', e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [handle]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">Loading…</div>;
  }
  if (!collection) return notFound();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative h-64 rounded-2xl overflow-hidden mb-8">
          <Image src={collection.image} alt={collection.title} fill className="object-cover" />
          <div className="absolute bottom-4 left-4 bg-white/90 rounded-xl px-4 py-2">
            <Typography variant="h4" className="font-bold">{collection.title}</Typography>
            <Typography variant="body2" color="textSecondary">{collection.description}</Typography>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collection.products.map((product) => (
            <Card key={product.id} className="rounded-2xl overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {product.images[0] && (
                  <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                )}
                {product.compareAtPrice && (
                  <Chip label={`Save ${Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%`} className="absolute top-3 right-3 bg-red-500 text-white" size="small" />
                )}
              </div>
              <CardContent className="p-4">
                <Typography variant="subtitle2" className="font-bold mb-1 truncate">{product.title}</Typography>
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="h6" className="font-bold">${product.price.toFixed(2)}</Typography>
                    {product.compareAtPrice && (
                      <Typography variant="caption" color="textSecondary" className="line-through">${product.compareAtPrice.toFixed(2)}</Typography>
                    )}
                  </div>
                  <Button size="small" variant="contained" className="bg-purple-600 hover:bg-purple-700" href={`/products`}>View</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
