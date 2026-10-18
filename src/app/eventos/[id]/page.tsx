import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import { ChurchEvent } from '@/lib/types';
import { Calendar, Clock, MapPin, ArrowLeft, Share2, ExternalLink, MessageCircle } from 'lucide-react';
import ShareButtons from '@/components/ShareButtons';

export const dynamic = 'force-dynamic';

export default async function DetalleEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id) as ChurchEvent | undefined;

  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.date + 'T12:00:00');

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Link
        href="/eventos"
        className="inline-flex items-center gap-2 text-xs font-bold text-brand-blue hover:text-brand-blue-hover"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al calendario de eventos</span>
      </Link>

      <article className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-border/60 shadow-card space-y-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-brand-gold-light text-brand-gold-hover text-xs font-bold uppercase tracking-wider">
              {event.status === 'published' ? 'Evento Confirmado' : event.status}
            </span>
            <span className="text-xs text-brand-muted">MICAPA Comayagua</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark leading-tight">
            {event.title}
          </h1>
        </div>

        {/* Bloque destacado con fecha, hora y lugar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 p-6 rounded-2xl bg-brand-cream border border-brand-border/60">
          <div className="sm:col-span-1 lg:col-span-4 flex items-start gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] text-brand-muted uppercase font-bold block tracking-wider">Fecha</span>
              <span className="text-sm font-bold text-brand-dark leading-snug break-words block">
                {eventDate.toLocaleDateString('es-HN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="sm:col-span-1 lg:col-span-3 flex items-start gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-brand-gold-light text-brand-gold-hover flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] text-brand-muted uppercase font-bold block tracking-wider">Horario</span>
              <span className="text-sm font-bold text-brand-dark leading-snug break-words block">{event.time}</span>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-5 flex items-start gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-brand-green-light text-brand-green flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] text-brand-muted uppercase font-bold block tracking-wider">Lugar</span>
              <span className="text-sm font-bold text-brand-dark leading-snug break-words block">{event.location}</span>
            </div>
          </div>
        </div>

        {event.image_url && (
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm">
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-brand-charcoal leading-relaxed whitespace-pre-line text-base sm:text-lg break-words">
          {event.description}
        </div>

        {/* Compartir evento */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-brand-gold" />
            <span>Compartir este evento:</span>
          </span>

          <ShareButtons title={event.title} summary={event.description} />
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href={`https://wa.me/50427720872?text=Hola%20MICAPA,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20evento:%20${encodeURIComponent(event.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-soft transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar por WhatsApp</span>
          </a>

          <Link
            href="/contacto"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-sm shadow-soft transition-colors"
          >
            <span>Cómo Llegar a la Iglesia</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
