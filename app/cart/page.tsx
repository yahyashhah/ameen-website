import Image from 'next/image';
import { getOrCreateCart, updateLine, removeLine } from '@/lib/cart-local';
import { getDB } from '@/lib/db';

export default async function CartPage() {
  let cart: any = null;
  try {
    cart = await getOrCreateCart();
  } catch {
    cart = null;
  }

  async function onUpdate(formData: FormData) {
    'use server';
    const lineId = String(formData.get('lineId'));
    const qty = Number(formData.get('quantity'));
    await updateLine(lineId, qty);
  }

  async function onRemove(formData: FormData) {
    'use server';
    const lineId = String(formData.get('lineId'));
    await removeLine(lineId);
  }

  const db = await getDB();
  const lines = cart?.lines || [];
  const detailed = lines.map((l: any) => {
    const v = db.data!.variants.find((x) => x.id === l.variantId)!;
    const p = db.data!.products.find((x) => x.id === v.productId)!;
    return { lineId: l.id, quantity: l.quantity, variant: v, product: p };
  });
  const totalItems = detailed.reduce((acc: number, e: any) => acc + (e.quantity || 0), 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      {!detailed.length ? (
        <div className="text-gray-600">Your cart is empty.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {detailed.map((e: any) => {
              const v = e.variant;
              const p = e.product;
              return (
                <div key={e.lineId} className="flex items-center gap-4 border rounded p-3">
                  <div className="relative h-20 w-20 bg-gray-50 rounded">
                    {p.images?.[0]?.url ? (
                      <Image src={p.images[0].url} alt={p.images[0].altText ?? p.title} fill className="object-contain" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{p.title}</div>
                    <div className="text-sm text-gray-500">{v.title}</div>
                    <div className="text-sm">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(v.price))}</div>
                  </div>
                  <form action={onUpdate} className="flex items-center gap-2">
                    <input type="hidden" name="lineId" value={e.lineId} />
                    <input type="number" name="quantity" defaultValue={e.quantity} min={1} className="w-16 border rounded px-2 py-1" />
                    <button className="border rounded px-3 py-1">Update</button>
                  </form>
                  <form action={onRemove}>
                    <input type="hidden" name="lineId" value={e.lineId} />
                    <button className="text-red-600">Remove</button>
                  </form>
                </div>
              );
            })}
          </div>
          <div className="border rounded p-4">
            <div className="flex justify-between mb-2"><span>Items</span><span>{totalItems}</span></div>
            <a href="/checkout" className="block bg-black text-white text-center px-4 py-2 rounded mt-3">Checkout</a>
          </div>
        </div>
      )}
    </div>
  );
}
