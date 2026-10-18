import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const authors = db.prepare(`
      SELECT a.*, 
        (SELECT COUNT(*) FROM pastor_thoughts p WHERE p.author = a.name) as thought_count
      FROM thought_authors a
      ORDER BY a.name ASC
    `).all();

    return NextResponse.json(authors);
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
    const { name, role, photo_url } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'El nombre del autor es obligatorio' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const existing = db.prepare('SELECT id FROM thought_authors WHERE name = ?').get(trimmedName);
    if (existing) {
      return NextResponse.json({ error: 'Ya existe un autor con este nombre' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO thought_authors (name, role, photo_url, created_at)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(trimmedName, role?.trim() || null, photo_url || '/images/logo.png', now);
    const newAuthor = db.prepare('SELECT * FROM thought_authors WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json(newAuthor, { status: 201 });
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
    const { id, name, role, photo_url } = body;

    if (!id || !name || !name.trim()) {
      return NextResponse.json({ error: 'ID y nombre son obligatorios' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const current = db.prepare('SELECT * FROM thought_authors WHERE id = ?').get(id) as any;
    if (!current) {
      return NextResponse.json({ error: 'Autor no encontrado' }, { status: 404 });
    }

    // Si cambia el nombre, verificar que no colisione con otro
    if (current.name !== trimmedName) {
      const collision = db.prepare('SELECT id FROM thought_authors WHERE name = ? AND id != ?').get(trimmedName, id);
      if (collision) {
        return NextResponse.json({ error: 'Ya existe otro autor con ese nombre' }, { status: 400 });
      }

      // Sincronizar en publicaciones existentes
      db.prepare('UPDATE pastor_thoughts SET author = ? WHERE author = ?').run(trimmedName, current.name);
    }

    const finalPhoto = photo_url || current.photo_url || '/images/logo.png';
    const stmt = db.prepare(`
      UPDATE thought_authors
      SET name = ?, role = ?, photo_url = ?
      WHERE id = ?
    `);

    stmt.run(trimmedName, role?.trim() || null, finalPhoto, id);

    // Sincronizar foto en publicaciones existentes del autor
    db.prepare('UPDATE pastor_thoughts SET pastor_photo = ? WHERE author = ?').run(finalPhoto, trimmedName);

    const updated = db.prepare('SELECT * FROM thought_authors WHERE id = ?').get(id);
    return NextResponse.json(updated);
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
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const author = db.prepare('SELECT * FROM thought_authors WHERE id = ?').get(id) as any;
    if (!author) {
      return NextResponse.json({ error: 'Autor no encontrado' }, { status: 404 });
    }

    db.prepare('DELETE FROM thought_authors WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
