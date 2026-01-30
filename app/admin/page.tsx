import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AdminHome() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/orders" className="block border rounded p-4 hover:bg-gray-50">
          <div className="font-medium mb-1">Orders</div>
          <div className="text-sm text-gray-600">Review and update order statuses.</div>
        </Link>
        <Link href="/admin/inventory" className="block border rounded p-4 hover:bg-gray-50">
          <div className="font-medium mb-1">Inventory</div>
          <div className="text-sm text-gray-600">Adjust stock levels for products.</div>
        </Link>
      </div>
    </div>
  );
}
