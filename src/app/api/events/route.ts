import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { autoArchivePastEvents } from '@/lib/data';

export async function GET(request: Request) {
  try {
    autoArchivePastEvents();
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const status = searchParams.get('status') || 'published';

    let query = 'SELECT * FROM events';
    const params: any[] = [];

    if (status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY date ASC';

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
    const { title, date, time, location, description, image_url, registration_url, is_featured, status } = body;

    if (!title || !date || !time) {
      return NextResponse.json({ error: 'Título, fecha y hora son obligatorios' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO events (title, date, time, location, description, image_url, registration_url, is_featured, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      date,
      time,
      location || 'Templo Principal MICAPA',
      description || '',
      image_url || null,
      registration_url || null,
      is_featured ? 1 : 0,
      status || 'published',
      now
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
