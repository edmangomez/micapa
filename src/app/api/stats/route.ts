import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const thoughts = db.prepare('SELECT COUNT(*) as count FROM pastor_thoughts').get() as { count: number };
    const activities = db.prepare('SELECT COUNT(*) as count FROM weekly_activities').get() as { count: number };
    const events = db.prepare('SELECT COUNT(*) as count FROM events WHERE status != ?').get('archived') as { count: number };
    const sermons = db.prepare('SELECT COUNT(*) as count FROM sermons').get() as { count: number };
    const users = db.prepare('SELECT COUNT(*) as count FROM admins').get() as { count: number };

    return NextResponse.json({
      thoughts: thoughts.count,
      activities: activities.count,
      events: events.count,
      sermons: sermons.count,
      users: users.count,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
