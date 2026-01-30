import type { MetadataRoute } from 'next';
import { listProducts } from '@/lib/store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${site}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${site}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${site}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${site}/policies/shipping`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site}/policies/returns`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site}/policies/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site}/policies/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    const products = await listProducts(50);
    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${site}/products/${p.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
