'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAudioPlayer } from './AudioPlayerContext';
import { Radio, Menu, X, Play, Pause, Phone, MapPin, Shield } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isPlaying, togglePlay } = useAudioPlayer();

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Reflexiones', href: '/mensajes' },
    { name: 'Actividades', href: '/actividades' },
    { name: 'Eventos', href: '/eventos' },
    { name: 'Radio en Vivo', href: '/radio' },
    { name: 'Contacto', href: '/contacto' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Banner informativo institucional */}
      <div className="bg-brand-dark text-white/90 text-xs py-2 px-4 border-b border-white/10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href="https://www.google.com/maps/place/El+Camino+de+la+palabra/@14.4577267,-87.6350963,17z/data=!3m1!4b1!4m6!3m5!1s0x8f6585f5b28d408b:0x4f4abd454796826a!8m2!3d14.4577267!4d-87.6350963!16s%2Fg%2F11b6d_p8w1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
              title="Ver ubicación de El Camino de la palabra en Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-gold" />
              <span>Calle 2 NO, Comayagua, Honduras</span>
            </a>
            <span className="flex items-center gap-1.5 text-gray-300">
              <Phone className="w-3.5 h-3.5 text-brand-gold" />
              +504 2772-0872
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-400">Ministerio el Camino de la Palabra</span>
            <span className="text-gray-600">|</span>
            <Link
              href="/admin"
              className="text-gray-400 hover:text-brand-gold flex items-center gap-1 transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>Acceso Pastoral</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Header Principal Sticky */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border/60 shadow-soft transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo e Identidad */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/logo.png"
                  alt="MICAPA Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-brand-blue flex items-center gap-1">
                  MICAPA
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-brand-muted tracking-wide uppercase">
                  Camino de la Palabra
                </span>
              </div>
            </Link>

            {/* Navegación Desktop */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                      active
                        ? 'text-brand-blue bg-brand-blue-light font-semibold shadow-sm'
                        : 'text-brand-charcoal hover:text-brand-blue hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Botón Radio y Acciones */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="relative inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold to-amber-500 hover:from-brand-gold-hover hover:to-amber-600 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-highlight transition-all active:scale-95"
              >
                <span className="relative flex h-2.5 w-2.5">
                  {isPlaying && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  )}
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pausar Radio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Escuchar Radio</span>
                  </>
                )}
              </button>
            </div>

            {/* Botón Mobile Menu */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-brand-gold text-white"
                aria-label={isPlaying ? "Pausar Radio" : "Reproducir Radio en vivo"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-brand-dark hover:bg-gray-100 transition-colors"
                aria-label={mobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú Móvil Desplegable */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/98 backdrop-blur-lg px-4 pt-4 pb-6 space-y-2 shadow-xl animate-fadeIn">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    active
                      ? 'bg-brand-blue-light text-brand-blue font-bold'
                      : 'text-brand-dark hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2 text-xs text-brand-muted hover:text-brand-blue"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Panel Pastoral Administrativo</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
