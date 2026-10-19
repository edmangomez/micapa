import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  Compass,
  BookOpen,
  Users,
  Shield,
  Sparkles,
  Anchor,
  Flame,
  Cross,
  LucideIcon,
} from 'lucide-react';
import { getSettings } from '@/lib/data';
import { AboutValue } from '@/lib/types';

export const metadata = {
  title: 'Quiénes Somos | MICAPA - Ministerio el Camino de la Palabra',
  description: 'Conoce la historia, visión, misión y valores de la iglesia cristiana MICAPA en Comayagua, Honduras.',
};

export const dynamic = 'force-dynamic';

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Heart,
  Users,
  Compass,
  Shield,
  Sparkles,
  Anchor,
  Flame,
  Cross,
};

const defaultValues: AboutValue[] = [
  {
    id: 'val-1',
    title: 'La Autoridad de la Palabra',
    desc: 'Creemos que la Biblia es la Palabra inspirada e inerrante de Dios, lámpara para nuestros pies y guía absoluta para la vida cotidiana.',
    icon: 'BookOpen',
  },
  {
    id: 'val-2',
    title: 'Restauración Familiar',
    desc: 'Nos dedicamos a sanar y fortalecer los hogares con principios bíblicos, sabiendo que familias sólidas transforman la sociedad.',
    icon: 'Heart',
  },
  {
    id: 'val-3',
    title: 'Comunidad y Discipulado',
    desc: 'Fomentamos relaciones genuinas de amor cristiano donde cada creyente es edificado para servir según sus dones.',
    icon: 'Users',
  },
  {
    id: 'val-4',
    title: 'Evangelismo y Alcance',
    desc: 'A través de cultos presenciales y las ondas radiales de Radio del Camino, llevamos el mensaje de salvación a cada rincón.',
    icon: 'Compass',
  },
];

export default function NosotrosPage() {
  const settings = getSettings();

  const heroBadge = settings.about_hero_badge || 'Nuestra Identidad';
  const heroTitle = settings.about_hero_title || 'Quiénes Somos en MICAPA';
  const heroSubtitle =
    settings.about_hero_subtitle ||
    'Ministerio el Camino de la Palabra: una familia de fe plantada en Comayagua para proclamar la verdad que liberta y transforma.';
  const heroImage =
    settings.about_hero_image ||
    'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1920&q=80';

  const missionTitle = settings.about_mission_title || 'Nuestra Misión';
  const missionText =
    settings.about_mission_text ||
    'Guiar a personas de toda edad hacia una relación viva y salvadora con Jesucristo a través del ministerio de la Palabra, discipulando a cada creyente para vivir en santidad, servir con amor y reflejar la gloria de Dios en su hogar y comunidad.';

  const visionTitle = settings.about_vision_title || 'Nuestra Visión';
  const visionText =
    settings.about_vision_text ||
    'Ser una congregación referente de avivamiento espiritual y transformación social en Comayagua y Honduras, expandiendo el Reino de Dios a través de vidas restauradas, familias sólidas y ministerios multiplicadores de impacto global.';

  const valuesTitle = settings.about_values_title || 'Nuestros Valores Fundamentales';
  const valuesSubtitle =
    settings.about_values_subtitle || 'Los pilares que sostienen cada ministerio y actividad en MICAPA.';

  let values = defaultValues;
  if (settings.about_values_json) {
    try {
      const parsed = JSON.parse(settings.about_values_json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        values = parsed;
      }
    } catch (e) {
      console.error('Error parsing about_values_json:', e);
    }
  }

  const ctaTitle = settings.about_cta_title || '¡Nos encantaría conocerte!';
  const ctaSubtitle =
    settings.about_cta_subtitle ||
    'Acompáñanos en nuestro Culto General o en cualquiera de nuestras reuniones de la semana en Comayagua.';

  return (
    <div className="space-y-16 py-12">
      {/* Hero Nosotros */}
      <section className="relative py-20 bg-brand-dark text-white overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={heroImage}
            alt="Nosotros MICAPA"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {heroTitle}
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto mt-4 leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-border/80">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-brand-dark mb-3">{missionTitle}</h2>
            <p className="text-brand-muted text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {missionText}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-border/80">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold-light text-brand-gold-hover flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-brand-dark mb-3">{visionTitle}</h2>
            <p className="text-brand-muted text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {visionText}
            </p>
          </div>
        </div>
      </section>

      {/* Valores Fundamentales */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-brand-dark">{valuesTitle}</h2>
          {valuesSubtitle && (
            <p className="text-brand-muted text-sm mt-2">{valuesSubtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => {
            const Icon = (v.icon && ICON_MAP[v.icon]) ? ICON_MAP[v.icon] : BookOpen;
            return (
              <div
                key={v.id || idx}
                className="bg-brand-cream rounded-3xl p-6 border border-brand-border/80 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white text-brand-blue flex items-center justify-center mb-4 border border-brand-border/40 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-brand-dark mb-2">{v.title}</h3>
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed whitespace-pre-line">
                    {v.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Llamado a la acción */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-blue-dark border border-brand-blue/30 rounded-3xl p-8 sm:p-12 text-white text-center">
          <h2 className="text-2xl sm:text-4xl font-bold">{ctaTitle}</h2>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mt-3">
            {ctaSubtitle}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/actividades"
              className="px-6 py-3 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-white font-bold text-xs sm:text-sm transition-colors"
            >
              Consultar Actividades
            </Link>
            <Link
              href="/contacto"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors"
            >
              Cómo Llegar al Templo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
