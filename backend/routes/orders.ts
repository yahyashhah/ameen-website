import { Router, Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Create order
router.post('/', async (req: Request, res: Response) => {
  try {
    const { items, customerEmail, customerName, shippingAddress, paymentMethod } = (req as AuthRequest).body as any;

    // Validate inventory
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.inventory < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient inventory for ${product?.title || 'product'}` 
        });
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax (adjust as needed)
    const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
    const total = subtotal + tax + shipping;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = new Order({
      orderNumber,
      userId: (req as AuthRequest).user?.userId,
      customerEmail,
      customerName,
      items,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod,
      shippingAddress
    });

    await order.save();

    // Decrement inventory
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { inventory: -item.quantity }
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get orders (admin only)
router.get('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status } = req.query as any;
    
    const query: any = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order or is admin
    const authReq = req as AuthRequest;
    if (authReq.user) {
      if (order.userId?.toString() !== authReq.user.userId && authReq.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status, trackingNumber, notes } = (req as AuthRequest).body as any;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, trackingNumber, notes },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export default router;
