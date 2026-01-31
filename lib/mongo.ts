import mongoose from 'mongoose';

const MONGO_URL = process.env.DATABASE_URL || '';

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = (global as any).__mongo__ || { conn: null, promise: null };

export async function connectMongo() {
  if (cached.conn) return cached.conn;
  if (!MONGO_URL) throw new Error('DATABASE_URL not set');
  if (!cached.promise) {
    const isSrv = MONGO_URL.startsWith('mongodb+srv://');
    const opts: any = { serverSelectionTimeoutMS: 2500 };
    if (!isSrv) opts.directConnection = true;
    cached.promise = mongoose.connect(MONGO_URL, opts).then((mongooseInstance) => mongooseInstance);
  }
  cached.conn = await cached.promise;
  (global as any).__mongo__ = cached;
  return cached.conn;
}
