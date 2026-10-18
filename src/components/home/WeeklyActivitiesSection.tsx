'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WeeklyActivity } from '@/lib/types';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

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

  return (
    <section id="actividades" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green-light text-brand-green-dark text-xs font-semibold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Agenda Congregacional</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
            Actividades de la Semana
          </h2>
          <p className="text-brand-muted text-sm sm:text-base mt-2">
            Te invitamos a ser parte de nuestras reuniones de oración, discipulado, jóvenes y cultos congregacionales en Comayagua.
          </p>

          {/* Filtro por días */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {days.map((d) => (
              <button
                key={d.key}
                onClick={() => setSelectedDay(d.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedDay === d.key
                    ? 'bg-brand-blue text-white shadow-soft'
                    : 'bg-brand-cream text-brand-charcoal hover:bg-gray-100'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de actividades */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-brand-cream rounded-3xl border border-brand-border/40 max-w-xl mx-auto">
            <Calendar className="w-8 h-8 text-brand-muted mx-auto mb-2 opacity-50" />
            <p className="text-brand-muted text-sm font-medium">No hay actividades programadas para este día.</p>
            <button
              onClick={() => setSelectedDay('todos')}
              className="mt-3 text-xs font-bold text-brand-blue hover:underline"
            >
              Ver todas las actividades de la semana
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((activity) => (
              <div
                key={activity.id}
                className="bg-brand-cream rounded-3xl p-6 border border-brand-border/60 hover:border-brand-blue/40 shadow-sm hover:shadow-card transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-brand-green-light text-brand-green-dark text-xs font-bold uppercase tracking-wider shrink-0">
                      {activity.day_name}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-charcoal bg-white px-2.5 py-1 rounded-full border border-gray-100 shadow-sm shrink-0">
                      <Clock className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span className="truncate">
                        {activity.start_time}
                        {activity.end_time ? ` - ${activity.end_time}` : ''}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-brand-dark mb-2 leading-tight break-words">
                    {activity.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-4 break-words">
                    {activity.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-border/40 flex items-center justify-between text-xs text-brand-charcoal gap-2">
                  <span className="flex items-center gap-1.5 min-w-0 flex-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                    <span className="truncate">{activity.location}</span>
                  </span>
                  <span className="text-brand-blue font-semibold shrink-0">
                    Presencial
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/actividades"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-dark text-white hover:bg-black font-semibold text-xs sm:text-sm transition-colors shadow-soft"
          >
            <span>Ver horario completo detallado</span>
            <ArrowRight className="w-4 h-4 text-brand-gold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
