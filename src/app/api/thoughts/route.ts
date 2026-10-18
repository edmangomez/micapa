import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured');

    let query = `
      SELECT p.*, COALESCE(p.pastor_photo, a.photo_url, '/images/logo.png') as pastor_photo, a.role as author_role
      FROM pastor_thoughts p
      LEFT JOIN thought_authors a ON p.author = a.name
    `;
    const params: any[] = [];

    if (featured === 'true') {
      query += ' WHERE p.is_featured = 1';
    }

    query += ' ORDER BY p.created_at DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const rows = db.prepare(query).all(...params);
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, author, pastor_photo, background_image, category, is_featured } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'El título y el contenido son obligatorios' }, { status: 400 });
    }

    const finalAuthor = author || 'Pastor MICAPA';
    const authorData = db.prepare('SELECT photo_url FROM thought_authors WHERE name = ?').get(finalAuthor) as any;
    const finalPhoto = pastor_photo || authorData?.photo_url || '/images/logo.png';

    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO pastor_thoughts (title, content, excerpt, author, pastor_photo, background_image, category, is_featured, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      content,
      excerpt || content.slice(0, 160) + '...',
      finalAuthor,
      finalPhoto,
      background_image || null,
      category || 'Reflexión',
      is_featured ? 1 : 0,
      now,
      now
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
