import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const thought = db.prepare(`
      SELECT p.*, COALESCE(p.pastor_photo, a.photo_url, '/images/logo.png') as pastor_photo, a.role as author_role
      FROM pastor_thoughts p
      LEFT JOIN thought_authors a ON p.author = a.name
      WHERE p.id = ?
    `).get(id);
    if (!thought) {
      return NextResponse.json({ error: 'Pensamiento no encontrado' }, { status: 404 });
    }
    return NextResponse.json(thought);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content, excerpt, author, pastor_photo, background_image, category, is_featured } = body;

    const finalAuthor = author || 'Pastor MICAPA';
    const authorData = db.prepare('SELECT photo_url FROM thought_authors WHERE name = ?').get(finalAuthor) as any;
    const finalPhoto = pastor_photo || authorData?.photo_url || '/images/logo.png';

    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE pastor_thoughts
      SET title = ?, content = ?, excerpt = ?, author = ?, pastor_photo = ?, background_image = ?, category = ?, is_featured = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      title,
      content,
      excerpt,
      finalAuthor,
      finalPhoto,
      background_image || null,
      category,
      is_featured ? 1 : 0,
      now,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    db.prepare('DELETE FROM pastor_thoughts WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
