import { Router, Response } from 'express';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import Product from '../models/Product';

const router = Router();

// Sync inventory from distributor feed
router.post('/sync-inventory', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body; // Array of { sku, inventory }

    let updated = 0;
    let errors = 0;

    for (const item of items) {
      try {
        const product = await Product.findOneAndUpdate(
          { sku: item.sku },
          { inventory: item.inventory },
          { new: true }
        );

        if (product) {
          updated++;
        }
      } catch (error) {
        errors++;
        console.error(`Failed to update ${item.sku}:`, error);
      }
    }

    res.json({
      message: 'Inventory sync completed',
      updated,
      errors,
      total: items.length
    });
  } catch (error) {
    console.error('Sync inventory error:', error);
    res.status(500).json({ error: 'Inventory sync failed' });
  }
});

// Import products from distributor feed
router.post('/import-products', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { products } = req.body;

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const productData of products) {
      try {
        const existing = await Product.findOne({ sku: productData.sku });

        if (existing) {
          await Product.findOneAndUpdate({ sku: productData.sku }, productData);
          updated++;
        } else {
          await Product.create(productData);
          created++;
        }
      } catch (error) {
        errors++;
        console.error(`Failed to import ${productData.sku}:`, error);
      }
    }

    res.json({
      message: 'Product import completed',
      created,
      updated,
      errors,
      total: products.length
    });
  } catch (error) {
    console.error('Import products error:', error);
    res.status(500).json({ error: 'Product import failed' });
  }
});

export default router;
