'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAudioPlayer } from './AudioPlayerContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
} from 'lucide-react';

export default function PersistentAudioDock() {
  const {
    isPlaying,
    isLoading,
    volume,
    isMuted,
    nowPlaying,
    isDockVisible,
    isMinimized,
    setIsMinimized,
    togglePlay,
    setVolume,
    toggleMute,
    closeDock,
  } = useAudioPlayer();
  const pathname = usePathname();

  // No mostrar si el usuario no ha iniciado la reproducción o si ha cerrado el dock
  if (!isDockVisible) return null;

  // En la página dedicada de /radio no mostramos el dock flotante redundante
  if (pathname === '/radio') return null;

  // =========================================================================
  // ALTERNATIVA MINIMALISTA: PASTILLA FLOTANTE EN ESQUINA (FAB WIDGET)
  // Cuando el usuario minimiza, en vez de recortar la barra contra el suelo,
  // se convierte en una píldora compacta, moderna y elegante en la esquina inferior.
  // =========================================================================
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-in fade-in zoom-in-95 duration-200">
        <div data-ui="dock" className="bg-white/95 backdrop-blur-xl border border-brand-border/80 rounded-full shadow-2xl p-1.5 pr-2.5 sm:pr-3 flex items-center gap-2 sm:gap-2.5 max-w-[92vw] sm:max-w-xs transition-colors text-brand-dark">
          {/* Avatar con carátula y estado */}
          <button
            onClick={() => setIsMinimized(false)}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-brand-cream border border-gray-200 shrink-0 cursor-pointer group"
            title="Expandir reproductor"
          >
            <Image
              src={nowPlaying.artwork || '/images/radio-logo.jpg'}
              alt={nowPlaying.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              unoptimized
            />
            {isPlaying && (
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            )}
          </button>

          {/* Información comprimida (click expande) */}
          <button
            onClick={() => setIsMinimized(false)}
            className="flex flex-col text-left min-w-0 max-w-[110px] sm:max-w-[140px] cursor-pointer group"
            title="Expandir reproductor"
          >
            <span className="text-[10px] font-semibold text-brand-blue flex items-center gap-1 leading-none">
              {isPlaying ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>En Vivo</span>
                </>
              ) : (
                <span className="text-gray-400">Pausado</span>
              )}
            </span>
            <span className="text-xs font-bold text-brand-dark truncate mt-0.5 group-hover:text-brand-blue transition-colors leading-tight">
              {nowPlaying.title || 'Radio del Camino'}
            </span>
          </button>

          {/* Control Play/Pause rápido */}
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="w-8 h-8 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform"
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          {/* Botón Expandir a Barra Completa */}
          <button
            onClick={() => setIsMinimized(false)}
            className="text-gray-400 hover:text-brand-blue p-1.5 rounded-full hover:bg-gray-100 transition-colors shrink-0"
            title="Expandir a barra completa"
            aria-label="Expandir a barra completa"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Botón Quitar / Cerrar */}
          <button
            onClick={closeDock}
            className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors shrink-0"
            title="Quitar reproductor"
            aria-label="Quitar reproductor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ESTADO COMPLETO: BARRA FLOTANTE EXPANDIDA
  // =========================================================================
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-4xl transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-bottom-4">
      <div data-ui="dock" className="bg-white/95 backdrop-blur-md border border-brand-border/80 rounded-2xl shadow-2xl p-3 sm:p-4 text-brand-dark">
        {/* Barra superior de control de minimizado y cerrado en móvil */}
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-gray-100 sm:hidden">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className={`inline-flex rounded-full h-2 w-2 ${
                  isPlaying ? 'bg-red-500' : 'bg-gray-400'
                }`}
              ></span>
            </span>
            <span className="text-xs font-semibold text-brand-blue">
              {isPlaying ? 'Radio en Vivo' : 'Radio MICAPA'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              title="Minimizar a botón flotante"
              aria-label="Minimizar reproductor"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              onClick={closeDock}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg transition-colors ml-1"
              title="Quitar reproductor"
              aria-label="Quitar reproductor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* Lado izquierdo: Carátula e Información */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-brand-cream border border-gray-100 flex-shrink-0">
              <Image
                src={nowPlaying.artwork || '/images/radio-logo.jpg'}
                alt={nowPlaying.title}
                fill
                sizes="(max-width: 640px) 48px, 56px"
                className={`object-cover ${isPlaying ? 'scale-105' : 'scale-100'} transition-transform duration-500`}
                unoptimized
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-brand-blue/10 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="hidden sm:flex items-center gap-2 mb-0.5">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`inline-flex rounded-full h-2 w-2 ${
                      isPlaying ? 'bg-red-500' : 'bg-gray-400'
                    }`}
                  ></span>
                </span>
                <span className="text-xs font-semibold text-brand-blue">
                  {isPlaying ? 'Transmitiendo en Vivo' : 'Radio del Camino'}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-brand-dark truncate leading-tight">
                {nowPlaying.title || 'Radio del Camino'}
              </h4>
              <p className="text-[11px] sm:text-xs text-brand-muted truncate mt-0.5">
                {nowPlaying.artist || 'La Radio del Camino: Conectándote Con El Cielo'}
              </p>
            </div>
          </div>

          {/* Centro: Botón Play / Pause */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-white shadow-highlight flex items-center justify-center transition-all transform active:scale-95"
              title={isPlaying ? 'Pausar transmisión' : 'Reproducir Radio MICAPA'}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>
          </div>

          {/* Lado derecho: Volumen, Botón radio.micapa.net, Minimizar y Quitar */}
          <div className="hidden md:flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* Control de volumen */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-brand-muted hover:text-brand-blue transition-colors p-1"
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-500" />
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
                className="w-20 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
              />
            </div>

            {/* Enlace directo a radio.micapa.net */}
            <a
              href="https://radio.micapa.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:text-brand-blue-hover bg-brand-blue-light hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Abrir radio.micapa.net</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
            </a>

            {/* Controles de barra: Minimizar y Quitar */}
            <div className="flex items-center gap-1 pl-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="Minimizar a botón flotante en la esquina"
                aria-label="Minimizar reproductor"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              <button
                onClick={closeDock}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                title="Quitar reproductor"
                aria-label="Quitar reproductor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Enlace móvil simplificado y botón de minimizar/quitar */}
          <div className="flex items-center gap-1 md:hidden">
            <a
              href="https://radio.micapa.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue p-2 hover:bg-brand-blue-light rounded-full"
              title="Abrir en radio.micapa.net"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Minimizar"
              aria-label="Minimizar reproductor"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              onClick={closeDock}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
              title="Quitar reproductor"
              aria-label="Quitar reproductor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
