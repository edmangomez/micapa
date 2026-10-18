import React from 'react';
import Link from 'next/link';
import { getWeeklyActivities } from '@/lib/data';
import { Calendar, Clock, MapPin, Users, Heart, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Actividades Semanales | MICAPA',
  description: 'Horarios de cultos, oración, discipulado y reuniones de la iglesia MICAPA en Comayagua.',
};

export const dynamic = 'force-dynamic';

export default function ActividadesPage() {
  const activities = getWeeklyActivities();

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="px-3.5 py-1 rounded-full bg-brand-green-light text-brand-green text-xs font-bold uppercase tracking-wider">
          Agenda Congregacional
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-brand-dark mt-2">
          Nuestras Actividades Semanales
        </h1>
        <p className="text-brand-muted text-sm sm:text-base mt-3 leading-relaxed">
          Un espacio y una reunión diseñada para cada miembro de la familia. Te esperamos con los brazos abiertos en Comayagua.
        </p>
      </div>

      {activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border/60 shadow-sm hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="px-3.5 py-1 rounded-full bg-brand-green-light text-brand-green-dark text-xs font-bold uppercase tracking-wider shrink-0">
                    {activity.day_name}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-charcoal bg-brand-cream px-3 py-1 rounded-full border border-brand-border/40 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                    <span>
                      {activity.start_time}
                      {activity.end_time ? ` - ${activity.end_time}` : ''}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mb-3 break-words">
                  {activity.title}
                </h2>

                <p className="text-sm text-brand-muted leading-relaxed mb-6 break-words">
                  {activity.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-brand-charcoal gap-2">
                <span className="flex items-center gap-1.5 min-w-0 flex-1">
                  <MapPin className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  <span className="truncate">{activity.location}</span>
                </span>
                <span className="font-semibold text-brand-blue shrink-0">Presencial</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-brand-border/60 shadow-sm max-w-xl mx-auto space-y-3">
          <Calendar className="w-12 h-12 text-brand-muted mx-auto" />
          <h2 className="text-xl font-bold text-brand-dark">No hay actividades programadas</h2>
          <p className="text-sm text-brand-muted">
            Los horarios de los cultos se actualizarán pronto. Comunícate con nosotros para más información.
          </p>
          <div className="pt-2">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-blue text-white font-medium text-xs hover:bg-brand-blue-hover transition-colors"
            >
              <span>Contactar a la iglesia</span>
            </Link>
          </div>
        </div>
      )}

      <div className="bg-brand-cream rounded-3xl p-8 sm:p-12 border border-brand-border/60 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-brand-dark">¿Primera vez visitándonos?</h3>
        <p className="text-brand-muted text-sm max-w-xl mx-auto">
          No te preocupes por cómo vestir o si no conoces a nadie. Nuestro equipo de recepción estará encantado de guiarte y hacerte sentir en casa.
        </p>
        <div className="pt-2">
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs sm:text-sm shadow-soft transition-colors"
          >
            <span>Ver Dirección y Contacto</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
