import React from 'react';
import Link from 'next/link';
import { ChurchEvent } from '@/lib/types';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function EventsSection({ events }: { events: ChurchEvent[] }) {
  if (events.length === 0) return null;

  return (
    <section className="py-20 bg-brand-cream-surface border-t border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold-light text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Convocatorias Especiales</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
              Próximos Eventos
            </h2>
            <p className="text-brand-muted text-sm sm:text-base mt-2 max-w-xl">
              Congresos, conferencias de familia, retiros espirituales y vigilias de adoración para toda la congregación.
            </p>
          </div>

          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-brand-blue-hover transition-colors group"
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
                className="bg-white rounded-3xl overflow-hidden border border-brand-border/60 shadow-sm hover:shadow-card transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="p-6 sm:p-7">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Badge de fecha estilo calendario */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-brand-blue-light border border-brand-blue/20 flex flex-col items-center justify-center text-brand-blue">
                      <span className="text-xs font-bold uppercase leading-none">{monthStr}</span>
                      <span className="text-xl font-bold leading-tight mt-0.5">{dayNum}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-1">
                        <Clock className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                        <span className="truncate">{event.time}</span>
                      </div>
                      <h3 className="text-lg font-bold text-brand-dark leading-tight line-clamp-2 break-words">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed line-clamp-3 mb-4 break-words">
                    {event.description}
                  </p>
                </div>

                <div className="px-6 py-4 bg-brand-cream border-t border-brand-border/40 flex items-center justify-between text-xs gap-3">
                  <span className="flex items-center gap-1 text-brand-charcoal min-w-0 flex-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </span>

                  <Link
                    href={`/eventos/${event.id}`}
                    className="font-bold text-brand-blue hover:text-brand-blue-hover flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Detalles</span>
                    <ArrowRight className="w-3 h-3" />
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
