import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const users = db.prepare('SELECT id, email, name, role, created_at FROM admins ORDER BY id ASC').all();
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { email, password, name, role } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Nombre, correo y contraseña son obligatorios' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    const existing = db.prepare('SELECT id FROM admins WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ error: 'Ya existe un usuario con este correo electrónico' }, { status: 400 });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO admins (email, password_hash, name, role, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(email, passwordHash, name, role || 'editor', now);

    return NextResponse.json({
      success: true,
      user: {
        id: result.lastInsertRowid,
        email,
        name,
        role: role || 'editor',
        created_at: now,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id, email, password, name, role } = await request.json();

    if (!id || !email || !name) {
      return NextResponse.json({ error: 'ID, nombre y correo son obligatorios' }, { status: 400 });
    }

    // Verificar si el correo ya pertenece a otro usuario
    const duplicate = db.prepare('SELECT id FROM admins WHERE email = ? AND id != ?').get(email, id);
    if (duplicate) {
      return NextResponse.json({ error: 'Ya existe otro usuario con ese correo electrónico' }, { status: 400 });
    }

    if (password && password.trim().length >= 6) {
      const passwordHash = bcrypt.hashSync(password.trim(), 10);
      db.prepare(`
        UPDATE admins
        SET email = ?, password_hash = ?, name = ?, role = ?
        WHERE id = ?
      `).run(email, passwordHash, name, role || 'editor', id);
    } else {
      db.prepare(`
        UPDATE admins
        SET email = ?, name = ?, role = ?
        WHERE id = ?
      `).run(email, name, role || 'editor', id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const targetId = parseInt(id, 10);

    // Evitar que el administrador se borre a sí mismo
    if (currentAdmin.id === targetId) {
      return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta en uso' }, { status: 400 });
    }

    // Asegurar que no sea el único administrador del sistema
    const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins WHERE role = ?').get('admin') as { count: number };
    const targetUser = db.prepare('SELECT role FROM admins WHERE id = ?').get(targetId) as { role: string } | undefined;

    if (targetUser?.role === 'admin' && adminCount.count <= 1) {
      return NextResponse.json({ error: 'No puedes eliminar el único administrador del sistema' }, { status: 400 });
    }

    db.prepare('DELETE FROM admins WHERE id = ?').run(targetId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
