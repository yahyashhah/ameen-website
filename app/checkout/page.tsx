import { notFound, redirect } from 'next/navigation';
import { getOrCreateCart } from '@/lib/cart-local';
import { getDB, Variant, Product } from '@/lib/db';
import CheckoutPayments from '@/components/CheckoutPayments';

export default async function CheckoutPage() {
  const cart = await getOrCreateCart();
  if (!cart || !Array.isArray(cart.lines) || cart.lines.length === 0) return notFound();
  const db = await getDB();
  const detailed: { lineId: string; quantity: number; variant: Variant; product: Product }[] = cart.lines.map((l: { id: string; variantId: string; quantity: number }) => {
    const v = db.data!.variants.find((x) => x.id === l.variantId)!;
    const p = db.data!.products.find((x) => x.id === v.productId)!;
    return { lineId: l.id, quantity: l.quantity, variant: v, product: p };
  });
  if (!detailed.length) return notFound();
  const total = detailed.reduce((sum: number, e: { quantity: number; variant: Variant }) => sum + e.quantity * e.variant.price, 0);

  async function placeOrder(formData: FormData) {
    'use server';
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const address = {
      line1: String(formData.get('line1') || ''),
      city: String(formData.get('city') || ''),
      country: String(formData.get('country') || ''),
      postalCode: String(formData.get('postalCode') || ''),
    };
    const paymentId = String(formData.get('paymentId') || '').trim();
    const db2 = await getDB();
    const orderId = `ord-${Date.now()}`;
    db2.data!.orders.push({ id: orderId, createdAt: Date.now(), status: paymentId ? 'paid' : 'pending', customerName: name, customerEmail: email, shippingAddress: address, items: detailed.map((e: { variant: Variant; quantity: number }) => ({ variantId: e.variant.id, quantity: e.quantity, price: e.variant.price })), total });
    // clear cart
    cart.lines = [];
    await db2.write();
    redirect(`/orders/confirmation?id=${orderId}`);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form id="checkout-form" action={placeOrder} className="md:col-span-2 space-y-3">
          <div>
            <label className="block text-sm text-gray-600">Full Name</label>
            <input name="name" required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input name="email" type="email" required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Address Line 1</label>
            <input name="line1" required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-600">City</label>
              <input name="city" required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Country</label>
              <input name="country" required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Postal Code</label>
              <input name="postalCode" required className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          {/* Hidden field filled by payment widgets on success */}
          <input type="hidden" name="paymentId" />
          <div className="text-sm text-gray-500">Alternatively, submit without payment to create a pending order.</div>
          <button className="bg-gray-800 text-white px-4 py-2 rounded">Place Order (Pending)</button>
        </form>
        <div className="border rounded p-4 space-y-4">
          <div className="font-medium mb-2">Summary</div>
          {detailed.map((e: { lineId: string; quantity: number; variant: Variant; product: Product }) => (
            <div key={e.lineId} className="flex justify-between text-sm mb-1">
              <span>{e.product.title} × {e.quantity}</span>
              <span>{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(e.quantity * e.variant.price)}</span>
            </div>
          ))}
          <div className="flex justify-between mt-2">
            <span className="font-medium">Total</span>
            <span className="font-medium">
              {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(total)}
            </span>
          </div>
          {/* Payment options */}
          <CheckoutPayments amount={total} />
        </div>
      </div>
    </div>
  );
}
