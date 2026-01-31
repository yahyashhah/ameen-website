import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { getProductByHandle as getProductByHandleLocal } from '@/lib/store';
import { addToCart } from '@/lib/cart-local';
import { getDummyByHandle } from '@/data/dummy/products';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

export const dynamic = 'force-dynamic';

export default async function ProductDetail({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  let product = null as Awaited<ReturnType<typeof getProductByHandleLocal>>;
  try {
    product = await getProductByHandleLocal(handle);
  } catch (e) {
    product = null;
  }
  const dummy = product ? null : getDummyByHandle(handle);
  if (!product && !dummy) return notFound();

  async function addToCartAction(formData: FormData) {
    'use server';
    const variantId = String(formData.get('variant'));
    await addToCart(variantId, 1);
    redirect('/cart');
  }

  const title = product?.title || dummy!.title;
  const vendor = product?.vendor || dummy!.vendor;
  const images = product?.images || ([dummy!.featuredImage, ...(dummy!.images || [])]);
  const primary = images?.[0]?.url || '';
  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {product ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.title,
              image: product.images.map((i: { url: any; }) => i.url),
              description: product.descriptionHtml?.replace(/<[^>]+>/g, ''),
              brand: { '@type': 'Brand', name: product.vendor },
              offers: product.variants.map((v: { price: { currencyCode: any; amount: any; }; sku: any; }) => ({
                '@type': 'Offer',
                priceCurrency: v.price.currencyCode,
                price: v.price.amount,
                sku: v.sku,
                availability: 'https://schema.org/InStock',
              })),
            }),
          }}
        />
      ) : null}
      <div>
        <div className="aspect-square relative bg-gray-50 mb-3">
          {primary ? (
            <Image src={primary} alt={title} fill className="object-contain" />
          ) : null}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {images.slice(1).map((img: { url: string | StaticImport; altText?: string | null }, i: Key | null | undefined) => (
            <div key={i} className="aspect-square relative bg-gray-50">
              <Image src={img.url} alt={img.altText ?? title} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        <div className="text-sm text-gray-500 mb-4">{vendor}</div>
        {product ? (
          <div className="prose" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
        ) : (
          <p className="text-gray-700">Premium, durable build with a focus on daily productivity. Full specifications will appear once the catalog sync is enabled.</p>
        )}

        {product ? (
          <form action={addToCartAction} className="mt-6 space-y-3">
            <select name="variant" className="border rounded px-3 py-2">
              {product.variants.map((v: { id: string; title: string; price: { currencyCode: string; amount: string } }) => (
                <option key={v.id as Key} value={v.id}>
                  {v.title} — {new Intl.NumberFormat(undefined, { style: 'currency', currency: v.price.currencyCode }).format(Number(v.price.amount))}
                </option>
              ))}
            </select>
            <div>
              <button type="submit" className="bg-black text-white px-4 py-2 rounded">Add to Cart</button>
            </div>
          </form>
        ) : (
          <div className="mt-6">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-not-allowed" disabled>
              Coming Soon
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
