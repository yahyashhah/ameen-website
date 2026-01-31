import { NextResponse } from 'next/server';

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const newComment = {
      id: `c_${Date.now()}`,
      author: body.name || 'Anonymous',
      authorAvatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=128&q=80',
      content: body.content || '',
      createdAt: new Date().toISOString(),
      likes: 0,
      postId: slug,
    };
    return NextResponse.json(newComment, { status: 201 });
  } catch (err) {
    console.error('Blog comments API error:', err);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
