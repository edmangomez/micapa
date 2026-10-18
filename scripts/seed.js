const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(path.join(dbDir, 'micapa.db'));

// Asegurar tablas
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
`);

console.log('Sembrando datos en la base de datos de MICAPA...');

// 1. Configuración Institucional
const insertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
const settings = [
  ['site_name', 'MICAPA - Ministerio el Camino de la Palabra'],
  ['hero_title', 'El Camino de la Palabra'],
  ['hero_subtitle', 'Una comunidad de fe viva, donde la Palabra de Dios guía cada paso de nuestras vidas y familias en Comayagua, Honduras.'],
  ['church_address', 'Bo. El INVA Calle 2 NO, entre 5a Avenida SE y 7a Avenida SE, Comayagua, Honduras'],
  ['church_phone', '+504 2772-0872'],
  ['church_whatsapp', '+504 2772-0872'],
  ['church_email', 'micapacomayagua@gmail.com'],
  ['facebook_url', 'https://www.facebook.com/micapacomayagua'],
  ['youtube_url', 'https://www.youtube.com/@radiomicapa'],
  ['instagram_url', 'https://www.instagram.com/micapacomayagua'],
  ['radio_stream_url', 'https://hoststream.micapa.net/listen/radiomicapa/radio.mp3'],
  ['radio_azuracast_url', 'https://hoststream.micapa.net/api/nowplaying/radiomicapa'],
  ['radio_website_url', 'https://radio.micapa.net'],
  ['live_stream_active', 'false'],
  ['live_stream_url', ''],
];

settings.forEach(([k, v]) => insertSetting.run(k, v));

// 2. Administrador por defecto
const existingAdmin = db.prepare('SELECT id FROM admins WHERE email = ?').get('admin@micapa.org');
if (!existingAdmin) {
  const hash = bcrypt.hashSync('admin123456', 10);
  db.prepare('INSERT INTO admins (email, password_hash, name, role, created_at) VALUES (?, ?, ?, ?, ?)').run(
    'admin@micapa.org',
    hash,
    'Pastor / Administrador MICAPA',
    'admin',
    new Date().toISOString()
  );
  console.log('Usuario administrador creado: admin@micapa.org / admin123456');
}

// 3. Actividades Semanales
const countActivities = db.prepare('SELECT COUNT(*) as count FROM weekly_activities').get().count;
if (countActivities === 0) {
  const insertActivity = db.prepare(`
    INSERT INTO weekly_activities (day_of_week, day_name, title, start_time, end_time, description, location, is_active, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const activities = [
    [2, 'Martes', 'Culto de Oración e Intercesión', '6:30 PM', '8:00 PM', 'Un tiempo especial para clamar a Dios por las familias, los enfermos, la iglesia y nuestra nación.', 'Santuario Principal MICAPA', 1, 1],
    [4, 'Jueves', 'Estudio Bíblico y Discipulado', '6:30 PM', '8:00 PM', 'Profundizando en las Escrituras versículo a versículo para un crecimiento espiritual sólido.', 'Santuario Principal MICAPA', 1, 2],
    [5, 'Viernes', 'Reunión de Jóvenes: Generación del Camino', '6:30 PM', '8:30 PM', 'Alabanza vibrante, compañerismo y mensaje relevante para jóvenes y adolescentes.', 'Auditorio Juvenil MICAPA', 1, 3],
    [6, 'Sábado', 'Reunión de Damas y Caballeros', '5:00 PM', '7:00 PM', 'Espacios de ministración enfocados en el rol de padres, madres e hijos bajo la Palabra de Dios.', 'Salón Multiusos MICAPA', 1, 4],
    [7, 'Domingo', 'Culto de Adoración y Celebración Matutino', '9:00 AM', '11:30 AM', 'Nuestra principal reunión congregacional de alabanza, palabra inspirada y Santa Cena mensual.', 'Santuario Principal MICAPA', 1, 5],
    [7, 'Domingo', 'Escuela Bíblica Infantil (Corderitos del Camino)', '9:30 AM', '11:00 AM', 'Clases dinámicas, cantos y enseñanzas bíblicas adaptadas para niños de todas las edades.', 'Pabellón Infantil', 1, 6],
    [7, 'Domingo', 'Culto de Alabanza Vespertino', '5:00 PM', '7:00 PM', 'Cierre de domingo en la presencia de Dios con edificación espiritual para toda la familia.', 'Santuario Principal MICAPA', 1, 7],
  ];

  activities.forEach(act => insertActivity.run(...act));
  console.log('Actividades semanales sembradas.');
}

// 4. Pensamientos del Pastor
const countThoughts = db.prepare('SELECT COUNT(*) as count FROM pastor_thoughts').get().count;
if (countThoughts === 0) {
  const insertThought = db.prepare(`
    INSERT INTO pastor_thoughts (title, content, excerpt, author, category, is_featured, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  const thoughts = [
    [
      'Caminando por Fe en Tiempos de Incertidumbre',
      'En la travesía de la vida cristiana, muchas veces nos encontramos ante encrucijadas donde la visibilidad es reducida. La Palabra de Dios nos recuerda en Salmos 119:105 que su Palabra es lámpara a nuestros pies y lumbrera a nuestro camino. No necesitamos ver el panorama completo de los próximos años para avanzar con confianza; solo necesitamos la luz de su verdad para dar el siguiente paso en obediencia. Cuando confías en el Señor de todo corazón, Él endereza tus sendas.',
      'No necesitamos ver todo el futuro para avanzar; solo necesitamos la luz de Su Palabra para dar el siguiente paso en obediencia.',
      'Pastor Principal MICAPA',
      'Vida Cristiana',
      1,
      now,
      now
    ],
    [
      'El Poder de la Familia Fundada en la Roca',
      'La familia no es una institución inventada por el hombre, sino un diseño sagrado establecido por Dios. En MICAPA creemos apasionadamente que restaurar a las familias es la clave para transformar nuestra comunidad en Comayagua. Dedica tiempo a orar con tus hijos, a bendecir a tu cónyuge y a cultivar un hogar donde la presencia del Espíritu Santo sea el huésped de honor cada día.',
      'Restaurar y edificar familias sobre el fundamento de Cristo es la clave para la transformación de nuestra comunidad.',
      'Pastor Principal MICAPA',
      'Familia y Hogar',
      0,
      now,
      now
    ],
    [
      'La Gracia que Restaura y Renueva',
      'No hay error tan grande que la gracia de Jesucristo no pueda perdonar, ni corazón tan herido que Su amor no pueda sanar. El camino de la vida no es para los que nunca caen, sino para aquellos que, al tropezar, extienden su mano hacia el Salvador y se levantan por su misericordia.',
      'El camino de la vida no es para los perfectos, sino para aquellos que se levantan confiando en el amor inagotable de Jesús.',
      'Pastor Principal MICAPA',
      'Esperanza',
      0,
      now,
      now
    ]
  ];

  thoughts.forEach(t => insertThought.run(...t));
  console.log('Pensamientos del pastor sembrados.');
}

// 5. Eventos Próximos
const countEvents = db.prepare('SELECT COUNT(*) as count FROM events').get().count;
if (countEvents === 0) {
  const insertEvent = db.prepare(`
    INSERT INTO events (title, date, time, location, description, is_featured, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  const events = [
    [
      'Gran Conferencia de Familias del Camino 2026',
      '2026-11-14',
      '6:00 PM',
      'Santuario Principal MICAPA, Comayagua',
      'Un fin de semana diseñado para renovar el pacto matrimonial, sanar relaciones familiares y equipar a los padres con principios bíblicos prácticos. Entrada libre y refrigerio para toda la congregación.',
      1,
      'published',
      now
    ],
    [
      'Jornada de Oración y Ayuno Congregacional',
      '2026-11-28',
      '8:00 AM - 1:00 PM',
      'Templo MICAPA',
      'Nos unimos en un solo espíritu para clamar por avivamiento espiritual, sanidad para los enfermos y protección sobre nuestros jóvenes y niños.',
      0,
      'published',
      now
    ],
    [
      'Encuentro Juvenil "Firme en la Promesa"',
      '2026-12-05',
      '5:30 PM',
      'Auditorio Juvenil MICAPA',
      'Música en vivo con la banda de alabanza, dinámicas, testimonios impactantes y un mensaje inspirador para todos los jóvenes de Comayagua.',
      0,
      'published',
      now
    ]
  ];

  events.forEach(e => insertEvent.run(...e));
  console.log('Eventos sembrados.');
}

// 6. Predicaciones
const countSermons = db.prepare('SELECT COUNT(*) as count FROM sermons').get().count;
if (countSermons === 0) {
  const insertSermon = db.prepare(`
    INSERT INTO sermons (title, preacher, date, video_url, thumbnail_url, description, category, is_live, is_featured, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  const sermons = [
    [
      'La Fidelidad de Dios en el Desierto',
      'Pastor Principal MICAPA',
      '2026-10-11',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80',
      'Un mensaje poderoso sobre cómo Dios utiliza los momentos difíciles de la vida para moldear nuestro carácter y fortalecer nuestra confianza en Sus promesas eternas.',
      'Serie: Fe Inquebrantable',
      0,
      1,
      now
    ],
    [
      'Edificando una Casa que Permanece',
      'Pastor Principal MICAPA',
      '2026-10-04',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
      'Enseñanza sobre el pasaje de Mateo 7 respecto al hombre prudente que edificó su casa sobre la roca y los vientos no pudieron derribarla.',
      'Serie: Familia Fuerte',
      0,
      0,
      now
    ],
    [
      'El Propósito del Espíritu Santo en Ti',
      'Pastor Principal MICAPA',
      '2026-09-27',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=800&q=80',
      'Comprendiendo la obra consoladora, guiadora y capacitadora del Espíritu Santo en el creyente para el testimonio diario.',
      'Culto de Adoración',
      0,
      0,
      now
    ]
  ];

  sermons.forEach(s => insertSermon.run(...s));
  console.log('Predicaciones sembradas.');
}

console.log('¡Base de datos inicializada exitosamente!');
db.close();
