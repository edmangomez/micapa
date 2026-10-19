'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAudioPlayer } from '../AudioPlayerContext';
import { Play, Pause, Calendar, Radio, ArrowRight, BookOpen, MapPin } from 'lucide-react';
import { SiteSettings, WeeklyActivity } from '@/lib/types';

export default function HeroSection({
  settings,
  activities = [],
}: {
  settings: SiteSettings;
  activities?: WeeklyActivity[];
}) {
  const { isPlaying, togglePlay } = useAudioPlayer();

  // Determinar reunión principal dinámica (ej: Culto General de los sábados)
  const mainService =
    activities.find((a) => /general|principal|celebraci[oó]n/i.test(a.title)) ||
    activities.find((a) => a.day_of_week === 6 || a.day_of_week === 7) ||
    activities[0];

  const serviceBadge = mainService ? mainService.title : 'Culto General';
  const serviceSchedule = mainService
    ? `${mainService.day_name} ${mainService.start_time}${mainService.end_time ? ` - ${mainService.end_time}` : ''} • ${
        mainService.location?.includes('Comayagua')
          ? mainService.location
          : mainService.location
          ? `${mainService.location}`
          : 'Comayagua'
      }`
    : 'Sábado 7:00 PM • Comayagua';
  const serviceImage = mainService?.image_url || '/images/culto-general.jpg';

  return (
    <section className="relative overflow-hidden bg-brand-dark text-white pt-8 pb-12 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-32">
      {/* Fondo con textura sutil e iluminación cálida ambiental */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-dark/85 z-10" />
        <Image
          src="/images/hero-bg.jpg"
          alt="Alabanza y Adoración MICAPA"
          fill
          unoptimized
          priority
          className="object-cover object-center opacity-40 mix-blend-luminosity"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Texto principal y CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                {settings.hero_title || 'El Camino de la Palabra'}
              </h1>
              <p className="text-lg sm:text-2xl text-brand-gold font-semibold tracking-normal mt-2">
                {settings.hero_highlight || 'Amamos caminar en su presencia'}
              </p>
            </div>

            <p className="text-sm font-medium text-amber-300 flex items-center justify-center lg:justify-start gap-1.5">
              <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Iglesia Cristiana en Comayagua, Honduras</span>
            </p>

            <p className="text-base sm:text-lg text-gray-200 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {settings.hero_subtitle ||
                'Una comunidad de fe viva, donde la Palabra de Dios guía cada paso de nuestras vidas y familias en Comayagua, Honduras.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1 sm:pt-2">
              <button
                onClick={togglePlay}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 sm:px-8 sm:py-3.5 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-dark font-extrabold text-sm sm:text-base transition-transform active:scale-95"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pausar Radio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Escuchar Radio en Vivo</span>
                  </>
                )}
              </button>

              <Link
                href="/actividades"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 transition-colors"
              >
                <Calendar className="w-4 h-4 text-brand-gold" />
                <span>Nuestras Actividades</span>
              </Link>
            </div>

            {/* Pastilla informativa compacta para móvil */}
            <div className="lg:hidden pt-1 flex items-center justify-center">
              <Link
                href="/actividades"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs text-gray-200 hover:text-white transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{serviceBadge}: {mainService ? `${mainService.day_name} ${mainService.start_time}` : 'Sábado 7:00 PM'}</span>
                <span className="text-brand-gold font-bold">→</span>
              </Link>
            </div>

            {/* Métricas limpias sin líneas artificiales */}
            <div className="pt-4 sm:pt-5 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center justify-around sm:justify-start sm:gap-10 text-center sm:text-left">
                <div>
                  <span className="block text-base sm:text-2xl font-bold text-white">24/7</span>
                  <span className="text-sm text-gray-300">Radio en Vivo</span>
                </div>
                <div>
                  <span className="block text-base sm:text-2xl font-bold text-white">5+</span>
                  <span className="text-sm text-gray-300">Cultos Semanales</span>
                </div>
                <div>
                  <span className="block text-base sm:text-2xl font-bold text-white">Comayagua</span>
                  <span className="text-sm text-gray-300">Sede Central</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta lateral exclusiva para pantallas de escritorio (lg+) */}
          <div className="hidden lg:block lg:col-span-5 taste-enter">
            <div className="bg-white rounded-3xl p-6 sm:p-7 text-brand-dark">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                  <span className="text-xs font-bold text-emerald-800">
                    Puertas Abiertas
                  </span>
                </div>
                <span className="text-xs text-brand-muted font-medium">Reuniones Presenciales</span>
              </div>

              <div className="mt-6 space-y-4">
                <Link
                  href="/actividades"
                  className="block relative rounded-2xl overflow-hidden aspect-video bg-gray-900 group cursor-pointer"
                >
                  <Image
                    src={serviceImage}
                    alt={serviceBadge}
                    fill
                    unoptimized
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end p-4 /* taste-skill-ignore */">
                    <div className="text-white">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-blue text-xs font-semibold text-white mb-1">
                        {serviceBadge}
                      </span>
                      <h3 className="text-base font-bold leading-tight">
                        {serviceSchedule}
                      </h3>
                    </div>
                  </div>
                </Link>

                <div className="bg-brand-cream rounded-2xl p-4">
                  <h4 className="text-sm font-bold text-brand-dark mb-1 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-brand-gold" />
                    Sintoniza Radio Mi Capa
                  </h4>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Música de adoración las 24 horas y mensajes que edifican tu espíritu en todo momento.
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={togglePlay}
                      className="text-xs font-bold text-brand-blue hover:text-brand-blue-hover flex items-center gap-1"
                    >
                      {isPlaying ? 'Pausar transmisión' : 'Reproducir ahora'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href="https://radio.micapa.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-muted hover:text-brand-dark font-medium underline"
                    >
                      radio.micapa.net
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link
                    href="/mensajes"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-dark hover:text-brand-blue transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-brand-blue" />
                    <span>Leer Reflexiones</span>
                  </Link>
                  <Link
                    href="/contacto"
                    className="text-xs font-semibold text-brand-gold hover:text-brand-gold-hover transition-colors"
                  >
                    ¿Cómo llegar? →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
