import Link from 'next/link';
import Image from 'next/image';
import { listProducts as listProductsLocal } from '@/lib/store';
import { getDummyProducts } from '@/data/dummy/products';

export const dynamic = 'force-static';

export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof listProductsLocal>> = [];
  try {
    products = await listProductsLocal(12);
  } catch (e) {
    // ignore
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Products</h1>
      {(() => {
        const fallback = getDummyProducts(12).map((d) => ({
          id: d.id,
          handle: d.handle,
          title: d.title,
          vendor: d.vendor,
          featuredImage: d.featuredImage,
          price: d.price,
        }));
        const items = products.length ? products : fallback;
        return (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <li key={p.id} className="border rounded-lg p-4 hover:shadow-sm transition">
                <Link href={`/products/${p.handle}`}>
                  <div className="aspect-square relative bg-gray-50 mb-3">
                    {p.featuredImage?.url ? (
                      <Image src={p.featuredImage.url} alt={(p as any).featuredImage?.altText ?? p.title} fill className="object-contain" />
                    ) : null}
                  </div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-gray-500">{p.vendor}</div>
                  {p.price ? (
                    <div className="mt-1">{new Intl.NumberFormat(undefined, { style: 'currency', currency: p.price.currencyCode }).format(Number(p.price.amount))}</div>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        );
      })()}
    </div>
  );
}
