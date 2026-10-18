import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const rows = db.prepare('SELECT * FROM weekly_activities ORDER BY day_of_week ASC, sort_order ASC').all();
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
    const { day_of_week, day_name, title, start_time, end_time, description, location, image_url, is_active, sort_order } = body;

    if (!title || !day_of_week || !start_time) {
      return NextResponse.json({ error: 'Título, día y hora son obligatorios' }, { status: 400 });
    }

    const stmt = db.prepare(`
      INSERT INTO weekly_activities (day_of_week, day_name, title, start_time, end_time, description, location, image_url, is_active, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      day_of_week,
      day_name,
      title,
      start_time,
      end_time || null,
      description || '',
      location || 'Templo Principal MICAPA',
      image_url || null,
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      sort_order || 0
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { id, day_of_week, day_name, title, start_time, end_time, description, location, image_url, is_active, sort_order } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 });
    }

    const stmt = db.prepare(`
      UPDATE weekly_activities
      SET day_of_week = ?, day_name = ?, title = ?, start_time = ?, end_time = ?, description = ?, location = ?, image_url = ?, is_active = ?, sort_order = ?
      WHERE id = ?
    `);

    stmt.run(
      day_of_week,
      day_name,
      title,
      start_time,
      end_time || null,
      description,
      location,
      image_url || null,
      is_active ? 1 : 0,
      sort_order || 0,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    db.prepare('DELETE FROM weekly_activities WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
