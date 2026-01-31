import { cookies } from 'next/headers';
import { getDB, User, newId } from './db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

const AUTH_COOKIE = 'auth';
const SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'dev-secret';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export type Session = { id: string; email: string; role: 'user'|'admin' };

export async function registerUser(email: string, password: string, name?: string) {
  const db = await getDB();
  const exists = db.data!.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) throw new Error('User already exists');
  const passwordHash = await bcrypt.hash(password, 10);
  const role: 'user'|'admin' = db.data!.users.length === 0 ? 'admin' : 'user';
  const user: User = { id: newId(), email, name, passwordHash, role };
  db.data!.users.push(user);
  await db.write();
  return user;
}

export async function loginUser(email: string, password: string) {
  const db = await getDB();
  const user = db.data!.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: EXPIRES_IN });
  const store = await cookies();
  store.set(AUTH_COOKIE, token, { httpOnly: true, path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });
  return { id: user.id, email: user.email, role: user.role } as Session;
}

export async function logoutUser() {
  const store = await cookies();
  store.set(AUTH_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, SECRET) as any;
    return { id: payload.id, email: payload.email, role: payload.role } as Session;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }
}
