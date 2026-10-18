import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const categories = db.prepare(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM pastor_thoughts p WHERE p.category = c.name) as thought_count
      FROM thought_categories c
      ORDER BY c.name ASC
    `).all();

    return NextResponse.json(categories);
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
    const { name, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'El nombre de la categoría es obligatorio' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const existing = db.prepare('SELECT id FROM thought_categories WHERE name = ?').get(trimmedName);
    if (existing) {
      return NextResponse.json({ error: 'Ya existe una categoría con este nombre' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO thought_categories (name, description, created_at)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(trimmedName, description?.trim() || null, now);
    const newCategory = db.prepare('SELECT * FROM thought_categories WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json(newCategory, { status: 201 });
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
    const { id, name, description } = body;

    if (!id || !name || !name.trim()) {
      return NextResponse.json({ error: 'ID y nombre son obligatorios' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const current = db.prepare('SELECT * FROM thought_categories WHERE id = ?').get(id) as any;
    if (!current) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    // Si cambia el nombre, verificar que no colisione con otra
    if (current.name !== trimmedName) {
      const collision = db.prepare('SELECT id FROM thought_categories WHERE name = ? AND id != ?').get(trimmedName, id);
      if (collision) {
        return NextResponse.json({ error: 'Ya existe otra categoría con ese nombre' }, { status: 400 });
      }

      // Sincronizar en publicaciones existentes
      db.prepare('UPDATE pastor_thoughts SET category = ? WHERE category = ?').run(trimmedName, current.name);
    }

    const stmt = db.prepare(`
      UPDATE thought_categories
      SET name = ?, description = ?
      WHERE id = ?
    `);

    stmt.run(trimmedName, description?.trim() || null, id);

    const updated = db.prepare('SELECT * FROM thought_categories WHERE id = ?').get(id);
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

    const category = db.prepare('SELECT * FROM thought_categories WHERE id = ?').get(id) as any;
    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    db.prepare('DELETE FROM thought_categories WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
