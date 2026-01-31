import { getSession } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const session = await getSession();
  if (!session) return redirect('/login');
  const db = await getDB();
  const orders = db.data!.orders.filter((o) => o.customerEmail?.toLowerCase() === session.email.toLowerCase());

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Account</h1>
      <div className="mb-6 text-sm text-gray-600">Signed in as {session.email}</div>
      <h2 className="text-xl font-semibold mb-2">Orders</h2>
      {!orders.length ? (
        <div className="text-gray-600">No orders yet.</div>
      ) : (
        <table className="w-full text-sm border rounded">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2">Order</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-2 font-mono">{o.id}</td>
                <td className="p-2">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(o.total)}</td>
                <td className="p-2">{o.status}</td>
                <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
