import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  userId?: mongoose.Types.ObjectId;
  customerEmail: string;
  customerName: string;
  items: Array<{ productId: mongoose.Types.ObjectId; sku: string; title: string; quantity: number; price: number }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'fulfilled' | 'cancelled';
  paymentMethod: 'stripe' | 'paypal' | 'other';
  paymentId?: string;
  shippingAddress: { name: string; line1: string; line2?: string; city: string; state?: string; postalCode: string; country: string };
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  customerEmail: { type: String, required: true },
  customerName: { type: String, required: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  }],
  subtotal: { type: Number, required: true, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  shipping: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'paid', 'processing', 'fulfilled', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, enum: ['stripe', 'paypal', 'other'], required: true },
  paymentId: String,
  shippingAddress: { name: String, line1: String, line2: String, city: String, state: String, postalCode: String, country: String },
  trackingNumber: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

OrderSchema.pre('save', function(next) {
  // @ts-ignore
  this.updatedAt = new Date();
  next();
});

export default (mongoose.models.Order as mongoose.Model<IOrder>) || mongoose.model<IOrder>('Order', OrderSchema);
