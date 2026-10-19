import React from 'react';
import { Radio, ExternalLink } from 'lucide-react';
import { FacebookIcon, YouTubeIcon, InstagramIcon, TikTokIcon, TwitterIcon } from '@/components/Icons';
import { SiteSettings } from '@/lib/types';

export default function OfficialChannelsSection({ settings }: { settings: SiteSettings }) {
  const baseChannels = [
    {
      name: 'Facebook Oficial',
      description: 'MICAPA (Ministerio el Camino de la Palabra)',
      href: settings.facebook_url || 'https://www.facebook.com/micapacomayagua',
      icon: FacebookIcon,
      color: 'bg-blue-600',
      action: 'Seguir página',
      show: true,
    },
    {
      name: 'Instagram Oficial',
      description: '@micapacomayagua • Devocionales y fotos',
      href: settings.instagram_url || 'https://www.instagram.com/micapacomayagua',
      icon: InstagramIcon,
      color: 'bg-[#E1306C]',
      action: 'Seguir en Instagram',
      show: true,
    },
    {
      name: 'Canal de YouTube',
      description: 'Transmisiones, alabanzas y mensajes en video',
      href: settings.youtube_url || 'https://www.youtube.com/@radiomicapa',
      icon: YouTubeIcon,
      color: 'bg-red-600',
      action: 'Suscribirse',
      show: true,
    },
    {
      name: 'Radio Mi Capa',
      description: 'La Radio del Camino: Conectándote Con El Cielo • 24/7',
      href: settings.radio_website_url || 'https://radio.micapa.net',
      icon: Radio,
      color: 'bg-brand-gold',
      action: 'Visitar emisora',
      show: true,
    },
    {
      name: 'TikTok Oficial',
      description: 'Videos cortos, mensajes y alabanzas',
      href: settings.tiktok_url || '',
      icon: TikTokIcon,
      color: 'bg-black',
      action: 'Ver en TikTok',
      show: Boolean(settings.tiktok_url),
    },
    {
      name: 'X (Twitter)',
      description: 'Noticias y reflexiones breves',
      href: settings.twitter_url || '',
      icon: TwitterIcon,
      color: 'bg-slate-900',
      action: 'Seguir en X',
      show: Boolean(settings.twitter_url),
    },
  ];

  const channels = baseChannels.filter((ch) => ch.show);

  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Columna Izquierda: Narrativa */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
              Canales y Redes Oficiales
            </h2>
            <p className="text-base sm:text-lg text-brand-charcoal leading-relaxed">
              Mantente conectado con las actividades de MICAPA y edifícate cada día a través de nuestras transmisiones en vivo, reflexiones bíblicas y comunicados oficiales.
            </p>
            <div className="pt-2">
              <a
                href={settings.radio_website_url || 'https://radio.micapa.net'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-dark text-white hover:bg-black font-semibold text-sm transition-colors"
              >
                <span>Web Oficial de Radio</span>
                <ExternalLink className="w-4 h-4 text-brand-gold" />
              </a>
            </div>
          </div>

          {/* Columna Derecha: Lista Editorial de Canales */}
          <div className="lg:col-span-7 space-y-3">
            {channels.map((ch) => (
              <a
                key={ch.name}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 sm:p-6 rounded-3xl bg-white hover:bg-white/80 transition-colors flex items-center justify-between gap-4 group taste-enter"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-brand-dark group-hover:text-brand-blue transition-colors">
                    {ch.name}
                  </h3>
                  <p className="text-sm text-brand-muted truncate mt-0.5">
                    {ch.description}
                  </p>
                </div>

                <span className="text-sm font-bold text-brand-blue-dark group-hover:underline shrink-0">
                  {ch.action} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
