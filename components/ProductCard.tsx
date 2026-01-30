import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  price: {
    amount: string;
    currencyCode: string;
  } | null;
  featuredImage?: {
    url: string;
    altText?: string;
  } | null;
  badge?: string;
}

export default function ProductCard({ 
  handle, 
  title, 
  vendor, 
  price, 
  featuredImage,
  badge 
}: ProductCardProps) {
  return (
    <Link href={`/products/${handle}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-gray-50 aspect-square mb-3">
        {featuredImage?.url && (
          <Image 
            src={featuredImage.url} 
            alt={featuredImage.altText || title} 
            fill 
            className="object-contain transition-transform group-hover:scale-105 p-4" 
          />
        )}
        {badge && (
          <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
            {badge}
          </div>
        )}
      </div>
      <div>
        <div className="text-sm text-gray-500 mb-1">{vendor}</div>
        <div className="font-medium mb-1 group-hover:underline">{title}</div>
        {price && (
          <div className="font-semibold">
            {new Intl.NumberFormat(undefined, { 
              style: 'currency', 
              currency: price.currencyCode 
            }).format(Number(price.amount))}
          </div>
        )}
      </div>
    </Link>
  );
}
