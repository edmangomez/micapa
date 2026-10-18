'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { RadioNowPlaying } from '@/lib/types';

interface AudioPlayerContextType {
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  nowPlaying: RadioNowPlaying;
  isDockVisible: boolean;
  isMinimized: boolean;
  togglePlay: () => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  closeDock: () => void;
  setIsDockVisible: (val: boolean) => void;
  setIsMinimized: (val: boolean) => void;
  toggleMinimize: () => void;
}

const defaultNowPlaying: RadioNowPlaying = {
  title: 'Radio del Camino',
  artist: 'La Radio del Camino: Conectándote Con El Cielo',
  album: 'Conectándote Con El Cielo',
  artwork: '/images/radio-logo.jpg',
  isOnline: true,
  listeners: 0,
};

const AudioPlayerContext = createContext<AudioPlayerContextType>({
  isPlaying: false,
  isLoading: false,
  volume: 0.8,
  isMuted: false,
  nowPlaying: defaultNowPlaying,
  isDockVisible: false,
  isMinimized: false,
  togglePlay: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  closeDock: () => {},
  setIsDockVisible: () => {},
  setIsMinimized: () => {},
  toggleMinimize: () => {},
});

const STREAM_URL = 'https://hoststream.micapa.net/listen/radiomicapa/radio.mp3';
const AZURACAST_URL = 'https://hoststream.micapa.net/api/nowplaying/radiomicapa';

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [nowPlaying, setNowPlaying] = useState<RadioNowPlaying>(defaultNowPlaying);
  const [isDockVisible, setIsDockVisible] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const toggleMinimize = () => setIsMinimized((prev) => !prev);

  // Inicializar elemento de audio en cliente
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = volume;
    audioRef.current = audio;

    audio.onwaiting = () => setIsLoading(true);
    audio.onplaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    audio.onpause = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };
    audio.onerror = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Consultar NowPlaying de AzuraCast periódicamente
  useEffect(() => {
    let isMounted = true;

    async function fetchMetadata() {
      try {
        const res = await fetch(AZURACAST_URL, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();

        if (isMounted && data) {
          const song = data.now_playing?.song;
          setNowPlaying({
            title: song?.title || 'Radio del Camino',
            artist: song?.artist || 'La Radio del Camino: Conectándote Con El Cielo',
            album: song?.album || 'Conectándote Con El Cielo',
            artwork: song?.art || '/images/radio-logo.jpg',
            isOnline: data.is_online ?? true,
            listeners: data.listeners?.current || 0,
          });
        }
      } catch {
        // Fallback en caso de error de red
      }
    }

    fetchMetadata();
    const interval = setInterval(fetchMetadata, 12000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.src = ''; // Detener la descarga del stream
      setIsPlaying(false);
    } else {
      setIsDockVisible(true);
      setIsLoading(true);
      // Agregar timestamp para evitar cache en navegadores
      audioRef.current.src = `${STREAM_URL}?t=${Date.now()}`;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setIsLoading(false);
        });
    }
  };

  const closeDock = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setIsLoading(false);
    setIsDockVisible(false);
    setIsMinimized(false);
  };

  const handleSetVolume = (val: number) => {
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        isLoading,
        volume,
        isMuted,
        nowPlaying,
        isDockVisible,
        isMinimized,
        togglePlay,
        setVolume: handleSetVolume,
        toggleMute,
        closeDock,
        setIsDockVisible,
        setIsMinimized,
        toggleMinimize,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}
