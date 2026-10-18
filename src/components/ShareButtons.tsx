'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Check, Copy, Share2 } from 'lucide-react';
import { FacebookIcon, TwitterIcon, TelegramIcon } from '@/components/Icons';

interface ShareButtonsProps {
  title: string;
  url?: string;
  summary?: string;
}

export default function ShareButtons({ title, url, summary }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url || '');

  useEffect(() => {
    if (!url && typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    } else if (url) {
      setCurrentUrl(url);
    }

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
  }, [url]);

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedText = encodeURIComponent(`"${title}" - Reflexión MICAPA`);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (err) {
      console.error('Error al copiar enlace:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary ? `"${title}" - ${summary.slice(0, 100)}...` : `"${title}" - Reflexión pastoral MICAPA`,
          url: currentUrl,
        });
      } catch (err) {
        // Ignorar si el usuario canceló el share dialog
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Botón WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
        title="Compartir en WhatsApp"
      >
        <MessageCircle className="w-4 h-4 fill-current" />
        <span>WhatsApp</span>
      </a>

      {/* Botón Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
        title="Compartir en Facebook"
      >
        <FacebookIcon className="w-4 h-4" />
        <span>Facebook</span>
      </a>

      {/* Botón X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
        title="Compartir en X (Twitter)"
      >
        <TwitterIcon className="w-3.5 h-3.5" />
        <span>X</span>
      </a>

      {/* Botón Telegram */}
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#229ED9] hover:bg-[#1D8BC0] text-white text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
        title="Compartir en Telegram"
      >
        <TelegramIcon className="w-4 h-4" />
        <span>Telegram</span>
      </a>

      {/* Botón Copiar Enlace */}
      <button
        onClick={handleCopy}
        type="button"
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all border shadow-sm ${
          copied
            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
            : 'bg-white hover:bg-slate-50 text-slate-700 border-gray-200'
        }`}
        title="Copiar enlace directo"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-600" />
            <span>¡Copiado!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Copiar Enlace</span>
          </>
        )}
      </button>

      {/* Compartir Nativo (Móvil / Web Share API) */}
      {canNativeShare && (
        <button
          onClick={handleNativeShare}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
          title="Más opciones (Instagram, Mensajes, etc.)"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Más Opciones</span>
        </button>
      )}
    </div>
  );
}
