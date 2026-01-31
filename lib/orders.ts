import { cookies } from 'next/headers';
import { getDB, Variant, Product } from './db';

export async function createOrderFromCurrentCart(status: 'paid'|'pending', paymentRef?: string) {
  const store = await cookies();
  const cartId = store.get('cartId')?.value;
  if (!cartId) return null as any;
  return createOrderFromCart(cartId, status, paymentRef);
}

export async function createOrderFromCart(
  cartId: string,
  status: 'paid'|'pending',
  paymentRef?: string,
  customer?: { name?: string; email?: string; address?: any }
) {
  const db = await getDB();
  const cart = db.data!.carts.find((c) => c.id === cartId);
  if (!cart || !cart.lines?.length) return null as any;

  const detailed = cart.lines.map((l) => {
    const v = db.data!.variants.find((x) => x.id === l.variantId)! as Variant;
    const p = db.data!.products.find((x) => x.id === v.productId)! as Product;
    return { lineId: l.id, quantity: l.quantity, variant: v, product: p };
  });
  const total = detailed.reduce((sum, e) => sum + e.quantity * e.variant.price, 0);
  const orderId = `ord-${Date.now()}`;
  db.data!.orders.push({
    id: orderId,
    createdAt: Date.now(),
    status,
    customerName: customer?.name || 'Guest',
    customerEmail: customer?.email || 'guest@example.com',
    shippingAddress: customer?.address || {},
    items: detailed.map((e) => ({ variantId: e.variant.id, quantity: e.quantity, price: e.variant.price })),
    total,
  });
  // Clear cart after successful order
  cart.lines = [];
  await db.write();
  return orderId;
}
