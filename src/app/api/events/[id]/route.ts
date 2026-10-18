import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { autoArchivePastEvents } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    autoArchivePastEvents();
    const { id } = await params;
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    if (!event) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }
    return NextResponse.json(event);
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
    const { title, date, time, location, description, image_url, registration_url, is_featured, status } = body;

    const stmt = db.prepare(`
      UPDATE events
      SET title = ?, date = ?, time = ?, location = ?, description = ?, image_url = ?, registration_url = ?, is_featured = ?, status = ?
      WHERE id = ?
    `);

    stmt.run(
      title,
      date,
      time,
      location,
      description,
      image_url || null,
      registration_url || null,
      is_featured ? 1 : 0,
      status || 'published',
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
    db.prepare('DELETE FROM events WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
