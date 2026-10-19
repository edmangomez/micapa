import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChurchEvent } from '@/lib/types';
import { Clock, MapPin, ArrowRight } from 'lucide-react';

export default function EventsSection({ events }: { events: ChurchEvent[] }) {
  if (events.length === 0) return null;

  return (
    <section className="py-20 bg-brand-cream-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
              Próximos Eventos
            </h2>
            <p className="text-brand-charcoal text-base sm:text-lg mt-2 max-w-xl">
              Congresos, conferencias de familia, retiros espirituales y vigilias de adoración para toda la congregación.
            </p>
          </div>

          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-base font-bold text-brand-blue-dark hover:underline transition-colors group"
          >
            <span>Ver calendario completo</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const eventDate = new Date(event.date + 'T12:00:00');
            const dayNum = eventDate.getDate();
            const monthStr = eventDate.toLocaleDateString('es-HN', { month: 'short' }).toUpperCase();

            return (
              <div
                key={event.id}
                className="bg-white rounded-3xl overflow-hidden transition-colors flex flex-col justify-between taste-enter"
              >
                {/* Fotografía real del evento */}
                <div className="relative w-full h-48 bg-slate-900">
                  <Image
                    src={event.image_url || '/images/culto-general.jpg'}
                    alt={event.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 rounded-xl bg-white px-3 py-1.5 flex flex-col items-center justify-center text-brand-dark">
                    <span className="text-xs font-bold uppercase leading-none text-brand-blue-dark">{monthStr}</span>
                    <span className="text-lg font-bold leading-tight mt-0.5">{dayNum}</span>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-1.5 text-sm text-brand-muted mb-2">
                    <Clock className="w-4 h-4 text-brand-gold flex-shrink-0" />
                    <span className="truncate">{event.time}</span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-dark leading-tight line-clamp-2 break-words mb-3">
                    {event.title}
                  </h3>

                  <p className="text-sm sm:text-base text-brand-charcoal leading-relaxed line-clamp-3 mb-4 break-words">
                    {event.description}
                  </p>
                </div>

                <div className="px-6 py-4 bg-brand-cream flex items-center justify-between text-sm gap-3">
                  <span className="flex items-center gap-1 text-brand-charcoal min-w-0 flex-1">
                    <MapPin className="w-4 h-4 text-brand-blue flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </span>

                  <Link
                    href={`/eventos/${event.id}`}
                    className="font-bold text-brand-blue-dark hover:underline flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Detalles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

