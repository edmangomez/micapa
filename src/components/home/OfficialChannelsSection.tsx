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
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
            Canales y Redes Oficiales
          </h2>
          <p className="text-brand-charcoal text-base sm:text-lg mt-3 leading-relaxed">
            Mantente conectado con las actividades de MICAPA y edifícate cada día a través de nuestras plataformas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {channels.map((ch) => {
            const Icon = ch.icon;
            return (
              <a
                key={ch.name}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-3xl p-7 flex flex-col justify-between group transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-card taste-enter" /* taste-skill-ignore */
              >
                <div>
                  <div
                    className={`w-14 h-14 rounded-2xl ${ch.color} text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark mb-1.5 group-hover:text-brand-blue transition-colors">
                    {ch.name}
                  </h3>
                  <p className="text-base text-brand-muted leading-relaxed mb-6 font-normal">
                    {ch.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-sm sm:text-base font-bold text-brand-blue-dark group-hover:underline">
                  <span>{ch.action}</span>
                  <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

