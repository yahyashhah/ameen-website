import { getDB } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const db = await getDB();
    const orders = db.data!.orders.slice().sort((a, b) => b.createdAt - a.createdAt);
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      {!orders.length ? (
        <div className="text-gray-600">No orders yet.</div>
      ) : (
        <table className="w-full text-sm border rounded">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2">Order</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Placed</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-2 font-mono">{o.id}</td>
                <td className="p-2">{o.customerName} — {o.customerEmail}</td>
                <td className="p-2">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(o.total)}</td>
                <td className="p-2">{o.status}</td>
                <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  <UpdateStatusForm orderId={o.id} current={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

async function updateOrderStatus(formData: FormData) {
  'use server';
  const orderId = String(formData.get('orderId'));
  const status = String(formData.get('status')) as 'pending'|'paid'|'fulfilled'|'cancelled';
  const db = await getDB();
  const order = db.data!.orders.find((o) => o.id === orderId);
  if (!order) return;
  order.status = status;
  await db.write();
  revalidatePath('/admin/orders');
}

function UpdateStatusForm({ orderId, current }: { orderId: string; current: 'pending'|'paid'|'fulfilled'|'cancelled' }) {
  return (
    <form action={updateOrderStatus} className="flex items-center gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <select name="status" defaultValue={current} className="border rounded px-2 py-1">
        <option value="pending">pending</option>
        <option value="paid">paid</option>
        <option value="fulfilled">fulfilled</option>
        <option value="cancelled">cancelled</option>
      </select>
      <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Update</button>
    </form>
  );
}
