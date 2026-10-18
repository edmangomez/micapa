import db from './db';
import { PastorThought, WeeklyActivity, ChurchEvent, Sermon, SiteSettings } from './types';

export function getSettings(): SiteSettings {
  try {
    const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];
    const settings: Record<string, string> = {};
    rows.forEach(r => {
      settings[r.key] = r.value;
    });
    return settings;
  } catch {
    return {};
  }
}

export function getFeaturedThought(): PastorThought | null {
  try {
    const thought = db.prepare(`
      SELECT p.*, COALESCE(p.pastor_photo, a.photo_url, '/images/logo.png') as pastor_photo
      FROM pastor_thoughts p
      LEFT JOIN thought_authors a ON p.author = a.name
      WHERE p.is_featured = 1 
      ORDER BY p.created_at DESC LIMIT 1
    `).get() as PastorThought | undefined;
    if (thought) return thought;
    return (db.prepare(`
      SELECT p.*, COALESCE(p.pastor_photo, a.photo_url, '/images/logo.png') as pastor_photo
      FROM pastor_thoughts p
      LEFT JOIN thought_authors a ON p.author = a.name
      ORDER BY p.created_at DESC LIMIT 1
    `).get() as PastorThought) || null;
  } catch {
    return null;
  }
}

export function getRecentThoughts(limit = 3): PastorThought[] {
  try {
    return (db.prepare(`
      SELECT p.*, COALESCE(p.pastor_photo, a.photo_url, '/images/logo.png') as pastor_photo
      FROM pastor_thoughts p
      LEFT JOIN thought_authors a ON p.author = a.name
      ORDER BY p.created_at DESC LIMIT ?
    `).all(limit) as PastorThought[]) || [];
  } catch {
    return [];
  }
}

export function getAllThoughts(): PastorThought[] {
  try {
    return (db.prepare(`
      SELECT p.*, COALESCE(p.pastor_photo, a.photo_url, '/images/logo.png') as pastor_photo
      FROM pastor_thoughts p
      LEFT JOIN thought_authors a ON p.author = a.name
      ORDER BY p.created_at DESC
    `).all() as PastorThought[]) || [];
  } catch {
    return [];
  }
}

export function getWeeklyActivities(): WeeklyActivity[] {
  try {
    return (db.prepare('SELECT * FROM weekly_activities WHERE is_active = 1 ORDER BY day_of_week ASC, sort_order ASC').all() as WeeklyActivity[]) || [];
  } catch {
    return [];
  }
}

export function autoArchivePastEvents(): number {
  try {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Tegucigalpa' }).format(new Date());
    const stmt = db.prepare(`
      UPDATE events 
      SET status = 'archived' 
      WHERE date < ? AND status = 'published'
    `);
    const result = stmt.run(today);
    return result.changes;
  } catch (err) {
    console.error('Error auto-archiving past events:', err);
    return 0;
  }
}

export function getUpcomingEvents(limit = 3): ChurchEvent[] {
  try {
    autoArchivePastEvents();
    return (db.prepare('SELECT * FROM events WHERE status = ? ORDER BY date ASC LIMIT ?').all('published', limit) as ChurchEvent[]) || [];
  } catch (err) {
    console.error('Error in getUpcomingEvents:', err);
    return [];
  }
}

export function getAllEvents(): ChurchEvent[] {
  try {
    autoArchivePastEvents();
    return (db.prepare('SELECT * FROM events WHERE status != ? ORDER BY date ASC').all('archived') as ChurchEvent[]) || [];
  } catch (err) {
    console.error('Error in getAllEvents:', err);
    return [];
  }
}

export function getFeaturedSermons(limit = 3): Sermon[] {
  try {
    return (db.prepare('SELECT * FROM sermons ORDER BY is_featured DESC, date DESC LIMIT ?').all(limit) as Sermon[]) || [];
  } catch {
    return [];
  }
}

export function getAllSermons(): Sermon[] {
  try {
    return (db.prepare('SELECT * FROM sermons ORDER BY date DESC').all() as Sermon[]) || [];
  } catch {
    return [];
  }
}

export function createContactMessage(data: {
  name: string;
  email?: string;
  phone?: string;
  type?: string;
  message: string;
}): number {
  try {
    const stmt = db.prepare(`
      INSERT INTO contact_messages (name, email, phone, type, message, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'unread', ?)
    `);
    const now = new Date().toISOString();
    const result = stmt.run(
      data.name.trim(),
      data.email?.trim() || null,
      data.phone?.trim() || null,
      data.type?.trim() || 'Petición de Oración',
      data.message.trim(),
      now
    );
    return result.lastInsertRowid as number;
  } catch (err) {
    console.error('Error inserting contact message:', err);
    throw err;
  }
}
