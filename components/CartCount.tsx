import Link from 'next/link';
import { getOrCreateCart } from '@/lib/cart-local';

export default async function CartCount() {
  try {
    const cart = await getOrCreateCart();
    const count = cart?.lines?.edges?.reduce((acc: number, e: any) => acc + (e.node.quantity || 0), 0) || 0;
    return (
      <Link href="/cart" className="text-sm hover:underline">Cart ({count})</Link>
    );
  } catch {
    return <Link href="/cart" className="text-sm hover:underline">Cart</Link>;
  }
}
