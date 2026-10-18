import React from 'react';
import { getAllThoughts } from '@/lib/data';
import { Quote } from 'lucide-react';
import PensamientosCatalog from '@/components/thoughts/PensamientosCatalog';

export const metadata = {
  title: 'Reflexiones Bíblicas | MICAPA',
  description: 'Reflexiones y mensajes bíblicos pastorales de la iglesia MICAPA en Comayagua.',
};

export const dynamic = 'force-dynamic';

export default function MensajesPage() {
  const thoughts = getAllThoughts();

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold-light text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Quote className="w-3.5 h-3.5" />
          <span>Alimento para el Alma</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-brand-dark">
          Reflexiones Bíblicas
        </h1>
        <p className="text-brand-muted text-sm sm:text-base mt-3 leading-relaxed">
          Reflexiones y meditaciones fundamentadas en la Palabra viva de Dios para fortalecer tu fe y guiar tus decisiones.
        </p>
      </div>

      <PensamientosCatalog initialThoughts={thoughts} />
    </div>
  );
}
