import Link from 'next/link';
import { getOrCreateCart } from '@/lib/cart-local';

export default async function CartCount() {
  try {
    const cart = await getOrCreateCart();
    const count = Array.isArray(cart?.lines)
      ? cart.lines.reduce((acc: number, l: any) => acc + (Number(l?.quantity) || 0), 0)
      : 0;
    return (
      <Link href="/cart" className="text-sm hover:underline">Cart ({count})</Link>
    );
  } catch {
    return <Link href="/cart" className="text-sm hover:underline">Cart</Link>;
  }
}
