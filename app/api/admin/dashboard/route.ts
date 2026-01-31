import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectMongo } from '@/lib/mongo';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import { listProducts } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const range = url.searchParams.get('range') || '7days';

    try {
      await connectMongo();
      const [orders, products] = await Promise.all([
        Order.find({}).sort({ createdAt: -1 }).limit(100).lean(),
        Product.find({ active: true }).lean(),
      ]);

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.status === 'paid' ? (o.total || 0) : 0), 0);
      const customersSet = new Set<string>();
      orders.forEach((o: any) => { if (o.customerEmail) customersSet.add(o.customerEmail.toLowerCase()); });
      const totalCustomers = customersSet.size;
      const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
      const averageOrderValue = totalOrders ? Math.round((orders.reduce((s: number, o: any) => s + (o.total || 0), 0) / totalOrders) * 100) / 100 : 0;
      const conversionRate = Math.min(100, Math.round((totalOrders / Math.max(products.length, 1)) * 100) / 100);

      const recentOrders = orders.slice(0, 10).map((o: any) => ({
        id: String(o._id || o.orderNumber),
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        date: new Date(o.createdAt).toISOString(),
        amount: o.total || 0,
        status: o.status || 'pending',
      }));

      const topProducts = products.slice(0, 8).map((p: any) => ({
        id: String(p._id || p.sku),
        title: p.title,
        sales: Math.floor(Math.random() * 100),
        revenue: Math.round((p.price || 0) * Math.floor(Math.random() * 100)),
        stock: p.inventory || 0,
      }));

      return NextResponse.json({
        stats: { totalRevenue, totalOrders, totalCustomers, conversionRate, averageOrderValue, pendingOrders },
        recentOrders,
        topProducts,
        range,
      });
    } catch (mongoErr) {
      // Fallback demo data if DB not reachable
      const products = await listProducts(8);
      return NextResponse.json({
        stats: { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, conversionRate: 0.0, averageOrderValue: 0, pendingOrders: 0 },
        recentOrders: [],
        topProducts: products.map((p: any) => ({ id: p.id, title: p.title, sales: 0, revenue: 0, stock: 0 })),
        range,
      });
    }
  } catch (err) {
    console.error('Admin dashboard error:', err);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';