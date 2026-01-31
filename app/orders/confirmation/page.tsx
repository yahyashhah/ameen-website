import { notFound } from 'next/navigation';
import { getDB } from '@/lib/db';

export default async function OrderConfirmation({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id = '' } = await searchParams;
  const db = await getDB();
  const order = db.data!.orders.find((o) => o.id === id);
  if (!order) return notFound();
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-3">Thank you!</h1>
      <p className="text-gray-700">Your order <span className="font-mono">{order.id}</span> was received. We’ll email you shortly with dispatch details.</p>
    </div>
  );
}
