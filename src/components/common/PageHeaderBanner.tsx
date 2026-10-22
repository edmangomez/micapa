import React from 'react';
import Image from 'next/image';

interface PageHeaderBannerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  bgImage: string;
  alt?: string;
}

export default function PageHeaderBanner({
  title,
  subtitle,
  badge,
  bgImage,
  alt = 'MICAPA - Ministerio el Camino de la Palabra',
}: PageHeaderBannerProps) {
  return (
    <section className="relative py-16 sm:py-24 bg-brand-dark text-white overflow-hidden rounded-b-3xl sm:rounded-b-[2.5rem]">
      {/* Imagen de Fondo con Overlay Oscuro para Contraste Óptimo */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/75 via-brand-dark/70 to-brand-dark/95" />
      </div>

      {/* Contenido Central */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-semibold mb-4 tracking-wide uppercase">
            <span>{badge}</span>
          </div>
        )}
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-300 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
