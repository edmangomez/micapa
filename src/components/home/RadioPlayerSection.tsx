'use client';

import React from 'react';
import Image from 'next/image';
import { useAudioPlayer } from '../AudioPlayerContext';
import { Play, Pause, Radio, ExternalLink, Users, Volume2, VolumeX, Music } from 'lucide-react';

export default function RadioPlayerSection() {
  const { isPlaying, isLoading, volume, isMuted, nowPlaying, togglePlay, setVolume, toggleMute } = useAudioPlayer();

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-blue-dark rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden taste-enter">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Lado izquierdo: Información y Badges */}
            <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white flex items-center justify-center lg:justify-start gap-2.5">
                <Radio className="w-6 h-6 text-brand-gold shrink-0" />
                <span>Radio del Camino en Vivo</span>
              </h2>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl">
                La Radio del Camino: Conectándote Con El Cielo. Alabanza, adoración y la palabra viva de Dios transmitiendo sin descanso para bendecir tu hogar, trabajo y vida diaria.
              </p>

              {/* Estado de emisión y oyentes */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <div className="flex items-center gap-2 bg-black/30 px-3.5 py-1.5 rounded-full text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-semibold text-emerald-300">Señal Online 192 kbps</span>
                </div>

                <div className="flex items-center gap-1.5 bg-black/30 px-3.5 py-1.5 rounded-full text-xs text-white/90">
                  <Users className="w-3.5 h-3.5 text-brand-gold" />
                  <span>{nowPlaying.listeners} oyentes sintonizando</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://radio.micapa.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors"
                >
                  <span>Abrir experiencia completa en radio.micapa.net</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Lado derecho: Tarjeta de Reproductor Interactivo */}
            <div className="lg:col-span-6">
              <div className="bg-black/25 rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Carátula */}
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden bg-black/40 flex-shrink-0">
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
                          <span className="w-1 bg-white rounded-full h-4"></span>
                          <span className="w-1 bg-white rounded-full h-6"></span>
                          <span className="w-1 bg-white rounded-full h-3"></span>
                          <span className="w-1 bg-white rounded-full h-5"></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metadata de la pista */}
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <Music className="w-3.5 h-3.5 text-brand-gold" />
                      <span className="text-xs font-semibold text-amber-300">
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
                        className="w-14 h-14 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-dark flex items-center justify-center transition-transform active:scale-95"
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
