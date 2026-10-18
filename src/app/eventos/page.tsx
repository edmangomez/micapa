import React from 'react';
import Link from 'next/link';
import { getAllEvents } from '@/lib/data';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Próximos Eventos | MICAPA',
  description: 'Conferencias, congresos, vigilias y retiros de la iglesia MICAPA en Comayagua.',
};

export const dynamic = 'force-dynamic';

export default function EventosPage() {
  const events = getAllEvents();

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="px-3.5 py-1 rounded-full bg-brand-gold-light text-amber-800 text-xs font-bold uppercase tracking-wider">
          Calendario Especial
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-brand-dark mt-2">
          Eventos y Convocatorias
        </h1>
        <p className="text-brand-muted text-sm sm:text-base mt-3 leading-relaxed">
          Fechas especiales para congregarnos, buscar el rostro de Dios y celebrar victorias espirituales en comunidad.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-brand-border/60 max-w-xl mx-auto p-8 space-y-3">
          <Calendar className="w-10 h-10 text-brand-gold mx-auto" />
          <h2 className="text-xl font-bold text-brand-dark">Próximamente Nuevas Fechas</h2>
          <p className="text-sm text-brand-muted">
            Estamos preparando las próximas actividades especiales. Mantente atento a nuestras redes o consulta los cultos de la semana.
          </p>
          <Link
            href="/actividades"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline pt-2"
          >
            <span>Ver actividades regulares de la semana</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
          const eventDate = new Date(event.date + 'T12:00:00');
          const dayNum = eventDate.getDate();
          const monthStr = eventDate.toLocaleDateString('es-HN', { month: 'short' }).toUpperCase();
          const yearNum = eventDate.getFullYear();

          return (
            <div
              key={event.id}
              className="bg-white rounded-3xl overflow-hidden border border-brand-border/60 shadow-sm hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-brand-blue-light border border-brand-blue/20 flex flex-col items-center justify-center text-brand-blue">
                    <span className="text-xs font-bold uppercase leading-none">{monthStr}</span>
                    <span className="text-2xl font-bold leading-tight mt-0.5">{dayNum}</span>
                    <span className="text-[10px] text-brand-muted leading-none">{yearNum}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-1">
                      <Clock className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                      <span className="truncate">{event.time}</span>
                    </div>
                    <h2 className="text-xl font-bold text-brand-dark leading-tight break-words">
                      <Link href={`/eventos/${event.id}`} className="hover:text-brand-blue transition-colors">
                        {event.title}
                      </Link>
                    </h2>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed line-clamp-3 mb-6 break-words">
                  {event.description}
                </p>
              </div>

              <div className="px-6 py-4 bg-brand-cream border-t border-brand-border/40 flex items-center justify-between text-xs gap-3">
                <span className="flex items-center gap-1.5 text-brand-charcoal min-w-0 flex-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </span>

                <Link
                  href={`/eventos/${event.id}`}
                  className="font-bold text-brand-blue hover:text-brand-blue-hover flex items-center gap-1 flex-shrink-0"
                >
                  <span>Ver detalles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
