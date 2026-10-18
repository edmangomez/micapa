'use client';

import React from 'react';
import Image from 'next/image';
import { useAudioPlayer } from '@/components/AudioPlayerContext';
import { Play, Pause, Radio, ExternalLink, Users, Volume2, VolumeX, Music, MessageSquare } from 'lucide-react';

export default function RadioPage() {
  const { isPlaying, isLoading, volume, isMuted, nowPlaying, togglePlay, setVolume, toggleMute } = useAudioPlayer();

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Radio */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold-light text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Sintoniza en Directo</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-brand-dark">
          Radio del Camino en Vivo
        </h1>
        <p className="text-brand-muted text-sm sm:text-base mt-3 leading-relaxed">
          La Radio del Camino: Conectándote Con El Cielo. Música cristiana contemporánea, prédicas, oraciones y comunidad las 24 horas.
        </p>
      </div>

      {/* Reproductor Visual Ampliado */}
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-brand-blue-dark via-brand-blue to-sky-800 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Carátula */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden bg-black/20 shadow-2xl border-2 border-white/20 flex-shrink-0">
            <Image
              src={nowPlaying.artwork || '/images/radio-logo.jpg'}
              alt={nowPlaying.title}
              fill
              className={`object-cover ${isPlaying ? 'scale-105' : 'scale-100'} transition-transform duration-700`}
              unoptimized
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-brand-gold/15 flex items-center justify-center">
                <div className="flex items-end gap-1.5 h-10">
                  <span className="w-1.5 bg-white rounded-full animate-[bounce_1s_infinite_100ms] h-6"></span>
                  <span className="w-1.5 bg-white rounded-full animate-[bounce_1s_infinite_300ms] h-10"></span>
                  <span className="w-1.5 bg-white rounded-full animate-[bounce_1s_infinite_200ms] h-5"></span>
                  <span className="w-1.5 bg-white rounded-full animate-[bounce_1s_infinite_400ms] h-8"></span>
                </div>
              </div>
            )}
          </div>

          {/* Información y Controles */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>SEÑAL EN DIRECTO</span>
              </span>
              <span className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white/90 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-brand-gold" />
                <span>{nowPlaying.listeners} oyentes</span>
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {nowPlaying.title || 'Radio del Camino'}
              </h2>
              <p className="text-base sm:text-lg text-white/80 font-medium mt-1">
                {nowPlaying.artist || 'La Radio del Camino: Conectándote Con El Cielo'}
              </p>
              <p className="text-xs text-brand-gold mt-1 font-semibold">
                {nowPlaying.album || 'Conectándote Con El Cielo'}
              </p>
            </div>

            {/* Controles de reproducción */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <button
                onClick={togglePlay}
                disabled={isLoading}
                className="w-16 h-16 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-white shadow-highlight flex items-center justify-center transition-all transform active:scale-95"
                title={isPlaying ? 'Pausar' : 'Reproducir'}
                aria-label={isPlaying ? 'Pausar transmisión de radio' : 'Reproducir transmisión de radio'}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-1" />
                )}
              </button>

              <div className="flex items-center gap-3 bg-black/20 px-4 py-2.5 rounded-full">
                <button
                  onClick={toggleMute}
                  className="text-white/80 hover:text-white"
                  title={isMuted ? 'Activar sonido' : 'Silenciar'}
                  aria-label={isMuted ? 'Activar sonido' : 'Silenciar radio'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-red-400" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  aria-label="Nivel de volumen"
                  className="w-24 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Puente con radio.micapa.net (Chat y App) */}
      <div className="max-w-4xl mx-auto bg-brand-cream rounded-3xl p-8 border border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-dark">¿Quieres unirte al Chat Global y la App?</h3>
            <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
              En <strong>radio.micapa.net</strong> puedes compartir peticiones de oración, saludar en el chat en vivo e instalar la aplicación en tu móvil.
            </p>
          </div>
        </div>

        <a
          href="https://radio.micapa.net"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-full bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs sm:text-sm transition-colors shadow-soft flex items-center gap-2 flex-shrink-0"
        >
          <span>Abrir radio.micapa.net</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
