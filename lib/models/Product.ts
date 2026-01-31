import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  inventory: number;
  lowStockThreshold: number;
  ean?: string;
  mpn?: string;
  featured: boolean;
  active: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  sku: { type: String, required: true, unique: true },
  handle: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  vendor: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: Number,
  images: [{ type: String }],
  inventory: { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  ean: String,
  mpn: String,
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ProductSchema.pre('save', function(next) {
  // @ts-ignore
  this.updatedAt = new Date();
  next();
});

export default (mongoose.models.Product as mongoose.Model<IProduct>) || mongoose.model<IProduct>('Product', ProductSchema);
