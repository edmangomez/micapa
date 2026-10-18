'use client';

import React from 'react';
import Image from 'next/image';
import { useAudioPlayer } from '../AudioPlayerContext';
import { Play, Pause, Radio, ExternalLink, Users, Volume2, VolumeX, Music } from 'lucide-react';

export default function RadioPlayerSection() {
  const { isPlaying, isLoading, volume, isMuted, nowPlaying, togglePlay, setVolume, toggleMute } = useAudioPlayer();

  return (
    <section className="py-16 bg-gradient-to-b from-brand-cream to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-blue-dark via-brand-blue to-sky-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Lado izquierdo: Información y Badges */}
            <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-brand-gold">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Emisora Oficial • La Radio del Camino: Conectándote Con El Cielo</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                Radio del Camino en Vivo
              </h2>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl">
                La Radio del Camino: Conectándote Con El Cielo. Alabanza, adoración y la palabra viva de Dios transmitiendo sin descanso para bendecir tu hogar, trabajo y vida diaria.
              </p>

              {/* Estado de emisión y oyentes */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-semibold text-emerald-300">Señal Online 192 kbps</span>
                </div>

                <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs text-white/90">
                  <Users className="w-3.5 h-3.5 text-brand-gold" />
                  <span>{nowPlaying.listeners} oyentes sintonizando</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://radio.micapa.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-colors border border-white/20"
                >
                  <span>Abrir experiencia completa en radio.micapa.net</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Lado derecho: Tarjeta de Reproductor Interactivo */}
            <div className="lg:col-span-6">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Carátula */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-black/20 shadow-lg flex-shrink-0 border border-white/20">
                    <Image
                      src={nowPlaying.artwork || '/images/radio-logo.jpg'}
                      alt={nowPlaying.title}
                      fill
                      className={`object-cover ${isPlaying ? 'scale-105' : 'scale-100'} transition-transform duration-700`}
                      unoptimized
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 bg-brand-gold/15 flex items-center justify-center">
                        <div className="flex items-end gap-1 h-6">
                          <span className="w-1 bg-white rounded-full animate-[bounce_1s_infinite_100ms] h-4"></span>
                          <span className="w-1 bg-white rounded-full animate-[bounce_1s_infinite_300ms] h-6"></span>
                          <span className="w-1 bg-white rounded-full animate-[bounce_1s_infinite_200ms] h-3"></span>
                          <span className="w-1 bg-white rounded-full animate-[bounce_1s_infinite_400ms] h-5"></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metadata de la pista */}
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <Music className="w-3.5 h-3.5 text-brand-gold" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold">
                        {isPlaying ? 'Sonando Ahora' : 'Radio del Camino'}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                      {nowPlaying.title || 'Radio del Camino'}
                    </h3>
                    <p className="text-sm text-white/80 truncate mt-0.5">
                      {nowPlaying.artist || 'La Radio del Camino: Conectándote Con El Cielo'}
                    </p>
                    <p className="text-xs text-brand-gold/90 truncate mt-0.5 font-semibold">
                      Conectándote Con El Cielo
                    </p>

                    {/* Controles de reproducción */}
                    <div className="mt-4 flex items-center justify-center sm:justify-start gap-4">
                      <button
                        onClick={togglePlay}
                        disabled={isLoading}
                        className="w-14 h-14 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-white shadow-highlight flex items-center justify-center transition-all transform active:scale-95"
                        title={isPlaying ? 'Pausar' : 'Reproducir'}
                        aria-label={isPlaying ? 'Pausar transmisión de radio' : 'Reproducir transmisión de radio'}
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 fill-current" />
                        ) : (
                          <Play className="w-6 h-6 fill-current ml-1" />
                        )}
                      </button>

                      {/* Control de volumen */}
                      <div className="flex items-center gap-2 bg-black/20 px-3 py-2 rounded-full">
                        <button
                          onClick={toggleMute}
                          className="text-white/80 hover:text-white"
                          title={isMuted ? 'Activar sonido' : 'Silenciar'}
                          aria-label={isMuted ? 'Activar sonido' : 'Silenciar radio'}
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-4 h-4 text-red-400" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
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
                          className="w-20 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
