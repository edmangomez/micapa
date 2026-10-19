import React from 'react';
import { Radio, ExternalLink } from 'lucide-react';
import { FacebookIcon, YouTubeIcon, InstagramIcon, TikTokIcon, TwitterIcon } from '@/components/Icons';
import { SiteSettings } from '@/lib/types';

export default function OfficialChannelsSection({ settings }: { settings: SiteSettings }) {
  const baseChannels = [
    {
      name: 'Facebook',
      handle: '@micapacomayagua',
      badge: 'Comunidad',
      badgeColor: 'bg-blue-100 text-blue-900',
      title: 'Comunidad y Noticias',
      description: 'Transmisiones dominicales, anuncios pastorales, peticiones de oración y galerías de fotos.',
      tags: ['Cultos en vivo', 'Peticiones'],
      href: settings.facebook_url || 'https://www.facebook.com/micapacomayagua',
      icon: FacebookIcon,
      color: 'bg-[#1877F2]',
      action: 'Seguir en Facebook',
      buttonRest: 'bg-blue-50 text-blue-800',
      buttonHover: 'group-hover:bg-[#1877F2] group-hover:text-white',
      show: true,
    },
    {
      name: 'Instagram',
      handle: '@micapacomayagua',
      badge: 'Devocionales',
      badgeColor: 'bg-pink-100 text-pink-900',
      title: 'Devocionales Diarios',
      description: 'Palabras diarias de aliento, versículos inspiradores y momentos del ministerio de jóvenes.',
      tags: ['Versículo del día', 'Juventud'],
      href: settings.instagram_url || 'https://www.instagram.com/micapacomayagua',
      icon: InstagramIcon,
      color: 'bg-[#E1306C]',
      action: 'Seguir en Instagram',
      buttonRest: 'bg-pink-50 text-pink-800',
      buttonHover: 'group-hover:bg-[#E1306C] group-hover:text-white',
      show: true,
    },
    {
      name: 'YouTube',
      handle: '@radiomicapa',
      badge: 'Cultos en Video',
      badgeColor: 'bg-red-100 text-red-900',
      title: 'Prédicas y Alabanza',
      description: 'Cultos sabatinos completos en video, predicaciones pastorales y momentos de adoración.',
      tags: ['Cultos completos', 'Prédicas'],
      href: settings.youtube_url || 'https://www.youtube.com/@radiomicapa',
      icon: YouTubeIcon,
      color: 'bg-[#FF0000]',
      action: 'Suscribirse al Canal',
      buttonRest: 'bg-red-50 text-red-800',
      buttonHover: 'group-hover:bg-[#FF0000] group-hover:text-white',
      show: true,
    },
    {
      name: 'Radio Mi Capa',
      handle: 'radio.micapa.net',
      badge: 'Señal 24/7',
      badgeColor: 'bg-amber-100 text-amber-950',
      title: 'Radio del Camino',
      description: 'Alabanza ininterrumpida y programación edificante transmitiendo de Comayagua al mundo.',
      tags: ['Señal 24/7', 'Adoración continua'],
      href: settings.radio_website_url || 'https://radio.micapa.net',
      icon: Radio,
      color: 'bg-amber-600',
      action: 'Sintonizar Emisora',
      buttonRest: 'bg-amber-50 text-amber-950',
      buttonHover: 'group-hover:bg-amber-600 group-hover:text-white',
      show: true,
    },
    {
      name: 'TikTok',
      handle: '@micapacomayagua',
      badge: 'Videos Cortos',
      badgeColor: 'bg-slate-100 text-slate-900',
      title: 'Reflexiones Breves',
      description: 'Clips dinámicos de prédicas, alabanzas y reflexiones directas al corazón para compartir.',
      tags: ['Videos cortos', 'Reflexiones'],
      href: settings.tiktok_url || '',
      icon: TikTokIcon,
      color: 'bg-black',
      action: 'Ver en TikTok',
      buttonRest: 'bg-slate-100 text-slate-900',
      buttonHover: 'group-hover:bg-black group-hover:text-white',
      show: Boolean(settings.tiktok_url),
    },
    {
      name: 'X (Twitter)',
      handle: '@micapa',
      badge: 'Noticias',
      badgeColor: 'bg-slate-100 text-slate-900',
      title: 'Avisos Rápidos',
      description: 'Noticias de última hora, pensamientos del pastor y pasajes de las Escrituras.',
      tags: ['Avisos oficiales', 'Citas bíblicas'],
      href: settings.twitter_url || '',
      icon: TwitterIcon,
      color: 'bg-slate-900',
      action: 'Seguir en X',
      buttonRest: 'bg-slate-100 text-slate-900',
      buttonHover: 'group-hover:bg-slate-900 group-hover:text-white',
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
                className="bg-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between group transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-card taste-enter" /* taste-skill-ignore */
              >
                <div>
                  {/* Fila superior: Icono de marca a la izquierda y Badge temático a la derecha */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl ${ch.color} text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ch.badgeColor}`}>
                      {ch.badge}
                    </span>
                  </div>

                  {/* Nombre de la plataforma y propuesta */}
                  <div className="mb-2">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-blue transition-colors">
                        {ch.name}
                      </h3>
                      <span className="text-xs text-brand-muted font-medium">
                        {ch.handle}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-brand-blue-dark mt-1">
                      {ch.title}
                    </p>
                  </div>

                  {/* Descripción enriquecida */}
                  <p className="text-sm text-brand-charcoal leading-relaxed mb-4 font-normal">
                    {ch.description}
                  </p>

                  {/* Micro-etiquetas temáticas */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {ch.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botón de acción interactivo */}
                <div
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors duration-200 ${ch.buttonRest} ${ch.buttonHover}`}
                >
                  <span>{ch.action}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

