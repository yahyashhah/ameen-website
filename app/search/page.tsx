import Image from 'next/image';
import Link from 'next/link';
import { searchProducts, listProducts } from '@/lib/store';
import { dummyProducts } from '@/data/dummy/products';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = (searchParams?.q || '').trim();
  let products: Awaited<ReturnType<typeof listProducts>> = [];
  try {
    products = q ? await searchProducts(q, 24) : await listProducts(24);
  } catch {
    // ignore
  }
  const items = products.length ? products : dummyProducts.map((d) => ({
    id: d.id,
    handle: d.handle,
    title: d.title,
    vendor: d.vendor,
    featuredImage: d.featuredImage,
    price: d.price,
  }));
  const filtered = q ? items.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) || p.vendor.toLowerCase().includes(q.toLowerCase())) : items;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <form className="mb-6">
        <input name="q" defaultValue={q} placeholder="Search products" className="w-full border rounded px-3 py-2" />
      </form>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
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
    </div>
  );
}
