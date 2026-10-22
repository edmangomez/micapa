export interface PastorThought {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  pastor_photo?: string | null;
  background_image?: string | null;
  category: string;
  is_featured: number;
  created_at: string;
  updated_at: string;
}

export interface ThoughtAuthor {
  id: number;
  name: string;
  role?: string | null;
  photo_url?: string | null;
  created_at: string;
  thought_count?: number;
}

export interface ThoughtCategory {
  id: number;
  name: string;
  description?: string | null;
  created_at: string;
  thought_count?: number;
}

export interface WeeklyActivity {
  id: number;
  day_of_week: number;
  day_name: string;
  title: string;
  start_time: string;
  end_time?: string | null;
  description?: string;
  location: string;
  image_url?: string | null;
  is_active: number;
  sort_order: number;
}

export interface ChurchEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image_url?: string | null;
  registration_url?: string | null;
  is_featured: number;
  status: 'published' | 'draft' | 'archived';
  created_at: string;
}

export interface Sermon {
  id: number;
  title: string;
  preacher: string;
  date: string;
  video_url: string;
  thumbnail_url?: string | null;
  description?: string;
  category: string;
  is_live: number;
  is_featured: number;
  created_at: string;
}

export interface SiteSettings {
  site_name?: string;
  hero_title?: string;
  hero_highlight?: string;
  hero_subtitle?: string;
  church_address?: string;
  church_phone?: string;
  church_whatsapp?: string;
  church_email?: string;
  facebook_url?: string;
  youtube_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  twitter_url?: string;
  radio_stream_url?: string;
  radio_azuracast_url?: string;
  radio_website_url?: string;
  live_stream_url?: string;
  live_stream_active?: string;
  google_maps_embed_url?: string;
  // Sección Nosotros
  about_hero_badge?: string;
  about_hero_title?: string;
  about_hero_subtitle?: string;
  about_hero_image?: string;
  about_mission_title?: string;
  about_mission_text?: string;
  about_vision_title?: string;
  about_vision_text?: string;
  about_values_title?: string;
  about_values_subtitle?: string;
  about_values_json?: string;
  about_cta_title?: string;
  about_cta_subtitle?: string;
  // Configuración de Correo Electrónico (SMTP)
  smtp_host?: string;
  smtp_port?: string;
  smtp_secure?: string;
  smtp_user?: string;
  smtp_pass?: string;
  smtp_from?: string;
  smtp_to?: string;
}

export interface AboutValue {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface RadioNowPlaying {
  title: string;
  artist: string;
  album: string;
  artwork: string;
  isOnline: boolean;
  listeners: number;
}

export interface AdminAccount {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  type: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  created_at: string;
}
