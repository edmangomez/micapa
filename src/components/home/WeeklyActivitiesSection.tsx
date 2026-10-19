'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WeeklyActivity } from '@/lib/types';
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react';

export default function WeeklyActivitiesSection({ activities }: { activities: WeeklyActivity[] }) {
  const [selectedDay, setSelectedDay] = useState<string>('todos');

  const days = [
    { key: 'todos', label: 'Toda la Semana' },
    { key: '1', label: 'Lunes' },
    { key: '2', label: 'Martes' },
    { key: '3', label: 'Miércoles' },
    { key: '4', label: 'Jueves' },
    { key: '5', label: 'Viernes' },
    { key: '6', label: 'Sábado' },
    { key: '7', label: 'Domingo' },
  ];

  const filtered =
    selectedDay === 'todos'
      ? activities
      : activities.filter((a) => a.day_of_week.toString() === selectedDay);

  const getDayBadgeColor = (dayName: string) => {
    const d = dayName.toLowerCase();
    if (d.includes('sábado') || d.includes('sabado')) {
      return 'bg-amber-100 text-amber-950 border border-amber-300/40';
    }
    if (d.includes('viernes')) {
      return 'bg-blue-100 text-blue-950 border border-blue-200/50';
    }
    if (d.includes('martes') || d.includes('miércoles') || d.includes('miercoles')) {
      return 'bg-emerald-100 text-emerald-950 border border-emerald-200/50';
    }
    return 'bg-slate-100 text-slate-900 border border-slate-200/50';
  };

  return (
    <section id="actividades" className="py-20 bg-brand-cream-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
            Actividades de la Semana
          </h2>
          <p className="text-brand-charcoal text-base sm:text-lg mt-3 leading-relaxed">
            Te invitamos a ser parte de nuestras reuniones de oración, discipulado, jóvenes y cultos congregacionales en Comayagua.
          </p>

          {/* Filtro por días */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {days.map((d) => (
              <button
                key={d.key}
                onClick={() => setSelectedDay(d.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors duration-200 ${
                  selectedDay === d.key
                    ? 'bg-brand-blue-dark text-white'
                    : 'bg-white text-brand-charcoal hover:bg-gray-100'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid modular de actividades */}
        {filtered.length === 0 ? (
          <div className="text-center py-14 bg-white rounded-3xl max-w-xl mx-auto">
            <Calendar className="w-10 h-10 text-brand-muted mx-auto mb-3 opacity-50" />
            <p className="text-brand-charcoal text-base font-semibold">No hay actividades programadas para este día.</p>
            <button
              onClick={() => setSelectedDay('todos')}
              className="mt-3 text-sm font-bold text-brand-blue-dark hover:underline"
            >
              Ver todas las actividades de la semana
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((activity) => {
              const isSaturday = activity.day_name.toLowerCase().includes('sábado') || activity.day_name.toLowerCase().includes('sabado');

              return (
                <div
                  key={activity.id}
                  className={`bg-white rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-card group taste-enter ${
                    isSaturday ? 'border-2 border-amber-400' : 'border border-transparent'
                  }`} /* taste-skill-ignore */
                >
                  <div>
                    {/* Header: Día y Horario */}
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <span className={`px-3.5 py-1 rounded-full text-xs font-bold capitalize shrink-0 ${getDayBadgeColor(activity.day_name)}`}>
                        {activity.day_name}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-brand-charcoal bg-brand-cream px-3 py-1 rounded-full shrink-0">
                        <Clock className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span className="truncate">
                          {activity.start_time}
                          {activity.end_time ? ` - ${activity.end_time}` : ''}
                        </span>
                      </div>
                    </div>

                    {isSaturday && (
                      <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg">
                        <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                        <span>Reunión Principal Congregacional</span>
                      </div>
                    )}

                    <h3 className="text-xl sm:text-2xl font-bold text-brand-dark mb-2.5 leading-snug group-hover:text-brand-blue transition-colors break-words">
                      {activity.title}
                    </h3>

                    <p className="text-base text-brand-charcoal leading-relaxed mb-6 font-normal break-words">
                      {activity.description}
                    </p>
                  </div>

                  {/* Footer: Ubicación y Modalidad */}
                  <div className="pt-4 flex items-center justify-between text-xs sm:text-sm text-brand-charcoal gap-2 bg-slate-50/70 -mx-7 sm:-mx-8 -mb-7 sm:-mb-8 px-7 sm:px-8 py-3.5 rounded-b-3xl">
                    <span className="flex items-center gap-1.5 min-w-0 flex-1">
                      <MapPin className="w-4 h-4 text-brand-blue flex-shrink-0" />
                      <span className="truncate text-brand-muted">{activity.location}</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full shrink-0">
                      Presencial
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-14 text-center">
          <Link
            href="/actividades"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-dark text-white hover:bg-black font-bold text-base transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            <span>Ver horario completo detallado</span>
            <ArrowRight className="w-4 h-4 text-brand-gold" />
          </Link>
        </div>
      </div>
    </section>
  );
}

