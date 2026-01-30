import 'dotenv/config';
import { seedIfEmpty } from '@/lib/db';
import { dummyProducts } from '@/data/dummy/products';

async function main() {
  const products = dummyProducts.map((d) => ({
    id: `prod-${d.id}`,
    handle: d.handle,
    title: d.title,
    vendor: d.vendor,
    descriptionHtml: '',
    type: undefined,
    barcode: undefined,
    price: Number(d.price.amount),
    images: [d.featuredImage, ...d.images],
  }));
  const variants = products.map((p) => ({ id: `var-${p.id}`, productId: p.id, title: 'Default', sku: undefined, price: p.price! }));
  const inventory = products.map((p) => ({ productId: p.id, quantity: 25 }));
  await seedIfEmpty(products as any, variants as any, inventory as any);
  console.log('Seeded dummy catalog (if empty).');
}

main().catch((e) => { console.error(e); process.exit(1); });
