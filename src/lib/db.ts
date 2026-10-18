import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Asegurar que el directorio data exista
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'micapa.db');
const db = new Database(dbPath);

// Habilitar modo WAL para concurrencia óptima
db.pragma('journal_mode = WAL');

// Crear tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS pastor_thoughts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author TEXT DEFAULT 'Pastor MICAPA',
    pastor_photo TEXT,
    background_image TEXT,
    category TEXT DEFAULT 'Reflexión',
    is_featured INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS weekly_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_of_week INTEGER NOT NULL,
    day_name TEXT NOT NULL,
    title TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    description TEXT,
    location TEXT DEFAULT 'Templo Principal MICAPA',
    image_url TEXT,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT DEFAULT 'Templo Principal MICAPA',
    description TEXT NOT NULL,
    image_url TEXT,
    registration_url TEXT,
    is_featured INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sermons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    preacher TEXT NOT NULL,
    date TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    category TEXT DEFAULT 'Culto General',
    is_live INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS thought_authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    role TEXT,
    photo_url TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS thought_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    type TEXT DEFAULT 'Petición de Oración',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TEXT NOT NULL
  );
`);

// Sembrar autores y categorías iniciales si las tablas están vacías
try {
  const authorCount = (db.prepare('SELECT count(*) as count FROM thought_authors').get() as any)?.count || 0;
  if (authorCount === 0) {
    const insertAuthor = db.prepare('INSERT OR IGNORE INTO thought_authors (name, role, photo_url, created_at) VALUES (?, ?, ?, ?)');
    const now = new Date().toISOString();
    insertAuthor.run('Pastor Principal MICAPA', 'Pastor Principal', '/images/logo.png', now);
    insertAuthor.run('Pastora de la Iglesia', 'Pastora', '/images/logo.png', now);
    insertAuthor.run('Pastores Asociados', 'Ministerio Pastoral', '/images/logo.png', now);
    insertAuthor.run('Ministerio Juvenil', 'Liderazgo Juvenil', '/images/logo.png', now);
    insertAuthor.run('Ministerio de Alabanza', 'Líder de Alabanza', '/images/logo.png', now);
  }

  const categoryCount = (db.prepare('SELECT count(*) as count FROM thought_categories').get() as any)?.count || 0;
  if (categoryCount === 0) {
    const insertCategory = db.prepare('INSERT OR IGNORE INTO thought_categories (name, description, created_at) VALUES (?, ?, ?)');
    const now = new Date().toISOString();
    insertCategory.run('Vida Cristiana', 'Principios bíblicos para el caminar y testimonio diario', now);
    insertCategory.run('Familia y Hogar', 'Principios para el matrimonio, crianza y restauración familiar', now);
    insertCategory.run('Esperanza', 'Palabras de aliento, consuelo y fe en medio de las pruebas', now);
    insertCategory.run('Fe y Discipulado', 'Fundamentos doctrinales y madurez espiritual en Cristo', now);
    insertCategory.run('Oración y Avivamiento', 'Búsqueda del rostro de Dios, ayuno e intercesión', now);
    insertCategory.run('Juventud', 'Desafíos, identidad y pasión por Dios en las nuevas generaciones', now);
  }
} catch (err) {
  console.error('Error seeding initial authors/categories:', err);
}

export default db;
