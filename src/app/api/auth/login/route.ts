import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { createToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Por favor ingresa correo y contraseña' }, { status: 400 });
    }

    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email) as any;
    if (!admin) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const isValid = bcrypt.compareSync(password, admin.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const token = createToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });

    const host = request.headers.get('host') || '';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

    response.cookies.set({
      name: 'micapa_admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && !isLocal,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error en el servidor' }, { status: 500 });
  }
}
