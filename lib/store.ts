import { getDB, newId, Product, Variant } from './db';

export async function listProducts(limit = 12) {
  const db = await getDB();
  return db.data!.products.slice(0, limit).map((p) => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    vendor: p.vendor,
    featuredImage: p.images[0] || null,
    price: p.price ? { amount: String(p.price), currencyCode: 'USD' } : null,
  }));
}

export async function getProductByHandle(handle: string) {
  const db = await getDB();
  const p = db.data!.products.find((x) => x.handle === handle);
  if (!p) return null as any;
  const variants = db.data!.variants.filter((v) => v.productId === p.id);
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    descriptionHtml: p.descriptionHtml || '',
    vendor: p.vendor,
    images: p.images,
    variants: variants.map((v) => ({ id: v.id, title: v.title, sku: v.sku || null, price: { amount: String(v.price), currencyCode: 'USD' } })),
  };
}

export async function searchProducts(q: string, limit = 24) {
  const db = await getDB();
  const term = q.toLowerCase();
  const matches = db.data!.products.filter((p) => p.title.toLowerCase().includes(term) || p.vendor.toLowerCase().includes(term));
  return matches.slice(0, limit).map((p) => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    vendor: p.vendor,
    featuredImage: p.images[0] || null,
    price: p.price ? { amount: String(p.price), currencyCode: 'USD' } : null,
  }));
}
