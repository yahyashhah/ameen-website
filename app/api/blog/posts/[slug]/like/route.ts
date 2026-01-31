import { NextResponse } from 'next/server';

export async function POST(_: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    return NextResponse.json({ ok: true, postId: slug });
  } catch (err) {
    console.error('Blog like API error:', err);
    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 });
  }
}
