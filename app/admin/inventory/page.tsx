import { getDB } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminInventoryPage() {
  const db = await getDB();
  const products = db.data!.products;
  const inventory = db.data!.inventory;
  const rows = products.map((p) => ({
    id: p.id,
    title: p.title,
    vendor: p.vendor,
    quantity: inventory.find((i) => i.productId === p.id)?.quantity ?? 0,
  }));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Inventory</h1>
      {!rows.length ? (
        <div className="text-gray-600">No products found.</div>
      ) : (
        <table className="w-full text-sm border rounded">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2">Product</th>
              <th className="text-left p-2">Vendor</th>
              <th className="text-left p-2">Quantity</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.title}</td>
                <td className="p-2">{r.vendor}</td>
                <td className="p-2">{r.quantity}</td>
                <td className="p-2"><UpdateInventoryForm productId={r.id} quantity={r.quantity} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

async function updateInventory(formData: FormData) {
  'use server';
  const productId = String(formData.get('productId'));
  const quantityRaw = String(formData.get('quantity'));
  const quantity = Number.parseInt(quantityRaw, 10);
  if (Number.isNaN(quantity) || quantity < 0) return;
  const db = await getDB();
  const entry = db.data!.inventory.find((i) => i.productId === productId);
  if (entry) {
    entry.quantity = quantity;
  } else {
    db.data!.inventory.push({ productId, quantity });
  }
  await db.write();
  revalidatePath('/admin/inventory');
}

function UpdateInventoryForm({ productId, quantity }: { productId: string; quantity: number }) {
  return (
    <form action={updateInventory} className="flex items-center gap-2">
      <input type="hidden" name="productId" value={productId} />
      <input type="number" name="quantity" defaultValue={quantity} min={0} className="border rounded px-2 py-1 w-24" />
      <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
    </form>
  );
}
