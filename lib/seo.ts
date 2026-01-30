import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export function generateSEO({
  title,
  description,
  image,
  url,
  type = 'website'
}: SEOProps): Metadata {
  const siteName = process.env.NEXT_PUBLIC_BRAND_NAME || 'Store';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const ogImage = image || `${siteUrl}/og-image.jpg`;

  return {
    title: `${title} | ${siteName}`,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullUrl
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName,
      images: [{ url: ogImage }],
      type
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    }
  };
}

export function generateProductJsonLd(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  sku: string;
  brand: string;
  availability: 'InStock' | 'OutOfStock';
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`
    }
  };
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
