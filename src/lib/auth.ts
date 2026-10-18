import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import db from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'micapa_super_secret_jwt_key_2026';
const COOKIE_NAME = 'micapa_admin_token';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export function createToken(user: AdminUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    return decoded;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const user = verifyToken(token);
    if (!user) return null;

    // Verificar que siga existiendo en la base de datos
    const row = db.prepare('SELECT id, email, name, role FROM admins WHERE id = ?').get(user.id) as AdminUser | undefined;
    return row || null;
  } catch {
    return null;
  }
}
