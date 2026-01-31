import { NextRequest, NextResponse } from 'next/server';
import { logoutUser } from '@/lib/auth';

export async function POST(_req: NextRequest) {
  await logoutUser();
  return NextResponse.json({ ok: true });
}

export const dynamic = 'force-dynamic';
