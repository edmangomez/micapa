import React from 'react';
import ContactMapSection from '@/components/home/ContactMapSection';
import { getSettings } from '@/lib/data';

export const metadata = {
  title: 'Contacto y Ubicación | MICAPA',
  description: 'Comunícate con la iglesia cristiana MICAPA en Comayagua, Honduras. Peticiones de oración, consejería y horarios.',
};

export const dynamic = 'force-dynamic';

export default function ContactoPage() {
  const settings = getSettings();

  return (
    <div className="py-8">
      <div className="text-center max-w-2xl mx-auto mb-8 px-4">
        <span className="px-3.5 py-1 rounded-full bg-brand-blue-light text-brand-blue-dark text-xs font-bold uppercase tracking-wider">
          Estamos para Servirte
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-brand-dark mt-2">
          Contacto y Peticiones de Oración
        </h1>
        <p className="text-brand-muted text-sm sm:text-base mt-3 leading-relaxed">
          Escríbenos, llámanos o visítanos en Comayagua. Toda la congregación se une en oración por tus necesidades.
        </p>
      </div>

      <ContactMapSection settings={settings} />
    </div>
  );
}
