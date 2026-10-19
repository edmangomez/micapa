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
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                  selectedDay === d.key
                    ? 'bg-brand-blue text-white'
                    : 'bg-brand-cream text-brand-charcoal hover:bg-gray-100'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista estructurada de actividades semanales */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-brand-cream rounded-3xl max-w-xl mx-auto">
            <p className="text-brand-muted text-base font-medium">No hay actividades programadas para este día.</p>
            <button
              onClick={() => setSelectedDay('todos')}
              className="mt-3 text-sm font-bold text-brand-blue-dark hover:underline"
            >
              Ver todas las actividades de la semana
            </button>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {filtered.map((activity) => (
              <div
                key={activity.id}
                className="p-6 sm:p-7 rounded-3xl bg-brand-cream transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 taste-enter"
              >
                <div className="md:w-1/3 shrink-0">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
                    {activity.day_name}
                  </span>
                  <div className="text-base sm:text-lg font-bold text-brand-dark">
                    {activity.start_time}
                    {activity.end_time ? ` - ${activity.end_time}` : ''}
                  </div>
                  <div className="text-sm text-brand-muted mt-0.5">
                    {activity.location} • Presencial
                  </div>
                </div>

                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold text-brand-dark mb-1 leading-snug">
                    {activity.title}
                  </h3>
                  <p className="text-base text-brand-charcoal leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/actividades"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-dark text-white hover:bg-black font-semibold text-sm transition-colors"
          >
            <span>Ver horario completo detallado</span>
            <ArrowRight className="w-4 h-4 text-brand-gold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
