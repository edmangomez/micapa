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
      color: 'bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600',
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
    <section className="py-20 bg-brand-cream border-t border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full bg-brand-gold-light text-brand-gold-hover text-xs font-semibold uppercase tracking-wider">
            Comunidad Digital
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark mt-2">
            Canales y Redes Oficiales
          </h2>
          <p className="text-brand-muted text-sm sm:text-base mt-2">
            Mantente conectado con las actividades de MICAPA y edifícate cada día a través de nuestras plataformas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {channels.map((ch) => {
            const Icon = ch.icon;
            return (
              <a
                key={ch.name}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-3xl p-6 border border-brand-border/60 hover:border-brand-blue/40 shadow-sm hover:shadow-card transition-all hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl ${ch.color} text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-brand-dark mb-1 group-hover:text-brand-blue transition-colors">
                    {ch.name}
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed mb-4">
                    {ch.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-brand-blue">
                  <span>{ch.action}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
